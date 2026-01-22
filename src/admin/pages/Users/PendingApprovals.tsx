import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../../../config/api.config';

interface Photo {
  type: 'profile' | 'proof';
  placement: number | null;
  url: string;
  label: string;
}

interface UserData {
  id: number;
  accountId: string;
  userId: number;
  userName: string;
  userCode: string;
  name: string;
  email: string;
  phone: string;
  photos: Photo[];
  profileverified: number;
  proofverified: number;
  createdAt: string;
}

interface FullScreenImage {
  url: string;
  label: string;
  placement: number | null;
  type: 'profile' | 'proof';
  userId: number;
  accountId: string;
}

const PendingApprovals: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [fullScreenImage, setFullScreenImage] = useState<FullScreenImage | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Handle ESC key to close full screen image and popup
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (fullScreenImage) {
          setFullScreenImage(null);
        } else if (selectedUser) {
          setSelectedUser(null);
        }
      }
    };

    if (fullScreenImage || selectedUser) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [fullScreenImage, selectedUser]);

  const fetchPendingUsers = async () => {
      try {
      setLoading(true);
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(getApiUrl('/api/admin/users/pending'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Transform to UserData format
          const formattedUsers: UserData[] = data.data.map((user: any) => {
            // Filter out invalid photo URLs
            const validPhotos = (user.photos || []).filter((photo: Photo) => 
              photo.url && 
              photo.url.trim() !== '' && 
              photo.url !== 'null' &&
              (photo.url.startsWith('http') || photo.url.startsWith('data:'))
            );
            
            return {
              id: user.id,
              accountId: user.accountId,
              userId: user.id,
              userName: user.name,
              userCode: user.userCode,
              name: user.name,
              email: user.email || '',
              phone: user.phone || '',
              photos: validPhotos,
              profileverified: user.profileverified || 0,
              proofverified: user.proofverified || 0,
              createdAt: user.createdAt || new Date().toISOString(),
            };
          });
          
          // Debug: Log photo URLs to console
          console.log('Formatted users with photos:', formattedUsers.map(u => ({
            name: u.userName,
            photoCount: u.photos.length,
            photoUrls: u.photos.map(p => p.url)
          })));
          
          setUsers(formattedUsers);
        }
      } else {
        console.error('Failed to fetch pending users');
      }
      } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
        setLoading(false);
      }
    };

  // Determine user status based on verification fields
  const getUserStatus = (user: UserData): 'pending' | 'approved' | 'rejected' => {
    // If either profile or proof is rejected (2), it's rejected
    if (user.profileverified === 2 || user.proofverified === 2) {
      return 'rejected';
    }
    // If both profile and proof are verified (1), it's approved
    if (user.profileverified === 1 && user.proofverified === 1) {
      return 'approved';
    }
    // Otherwise it's pending (0 or partial verification)
    return 'pending';
  };

  // Filter users based on selected tab
  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    const status = getUserStatus(user);
    return status === filter;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Get profile photos only (photo1-5, excluding proof)
  const getProfilePhotos = (photos: Photo[]): Photo[] => {
    return photos.filter(photo => photo.type === 'profile' && photo.placement !== null).sort((a, b) => (a.placement || 0) - (b.placement || 0));
  };

  const handleImageClick = (photo: Photo, user: UserData, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setFullScreenImage({
      url: photo.url,
      label: photo.label,
      placement: photo.placement,
      type: photo.type,
      userId: user.userId,
      accountId: user.accountId,
    });
  };

  const handleCardClick = (user: UserData) => {
    setSelectedUser(user);
  };

  const handleApproveUser = async (user: UserData) => {
    if (window.confirm(`Are you sure you want to approve profile verification for ${user.userName}?`)) {
      try {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
        if (!token) {
          alert('Please login to continue');
          return;
        }

        const response = await fetch(getApiUrl('/api/admin/users/pending/approve'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: user.userId,
            type: 'profile'
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            alert(`Profile verification approved successfully for ${user.userName}!`);
            setSelectedUser(null);
            fetchPendingUsers();
          } else {
            alert(data.message || 'Failed to approve');
          }
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Failed to approve');
        }
      } catch (error) {
        console.error('Error approving user:', error);
        alert('Error approving user');
      }
    }
  };

  const handleRejectUser = async (user: UserData) => {
    const reason = window.prompt(`Please provide a reason for rejecting profile verification for ${user.userName}:`);
    if (!reason) return;

    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      if (!token) {
        alert('Please login to continue');
        return;
      }

      const response = await fetch(getApiUrl('/api/admin/users/pending/reject'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.userId,
          type: 'profile',
          reason: reason
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert(`Profile verification rejected for ${user.userName}.`);
          setSelectedUser(null);
          fetchPendingUsers();
        } else {
          alert(data.message || 'Failed to reject');
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to reject');
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Error rejecting user');
    }
  };



  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px] text-lg text-gray-600">Loading profile verifications...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Profile Verification</h1>
          <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Total Users:</span>
          <span className="text-lg font-semibold text-gray-800">{users.length}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 bg-white p-1 rounded-lg">
        <button
          className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-200 ${
            filter === 'all' 
              ? 'bg-[#14b8a6] text-white' 
              : 'bg-transparent text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setFilter('all')}
        >
          All ({users.length})
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-200 ${
            filter === 'pending' 
              ? 'bg-[#14b8a6] text-white' 
              : 'bg-transparent text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setFilter('pending')}
        >
          Pending ({users.filter(u => getUserStatus(u) === 'pending').length})
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-200 ${
            filter === 'approved' 
              ? 'bg-[#14b8a6] text-white' 
              : 'bg-transparent text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setFilter('approved')}
        >
          Approved ({users.filter(u => getUserStatus(u) === 'approved').length})
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-200 ${
            filter === 'rejected' 
              ? 'bg-[#14b8a6] text-white' 
              : 'bg-transparent text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setFilter('rejected')}
        >
          Rejected ({users.filter(u => getUserStatus(u) === 'rejected').length})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedUsers.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-8 text-center">
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'No profile verifications found' 
                : `No ${filter} profile verifications found`}
            </p>
          </div>
        ) : (
          paginatedUsers.map((user) => {
            const profilePhotos = getProfilePhotos(user.photos);
            
            return (
              <div 
                key={user.id} 
                className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-yellow-500 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleCardClick(user)}
              >
              <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-lg font-semibold text-[#14b8a6]">
                      {user.userName}
                    </div>
                    <p className="text-sm text-gray-600">{user.userCode}</p>
                </div>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
              </div>

              <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-700 mb-3">Profile Photos ({profilePhotos.length}/5)</p>
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 5 }, (_, index) => {
                      const photoIndex = index + 1;
                      const photo = profilePhotos.find(p => p.placement === photoIndex);
                      
                      return (
                        <div
                          key={photoIndex}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                            photo 
                              ? 'border-gray-300 cursor-pointer hover:border-[#14b8a6] transition-all' 
                              : 'border-dashed border-gray-200 bg-gray-50'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (photo) handleImageClick(photo, user, e);
                          }}
                        >
                          {photo ? (
                            <>
                              <img
                                src={photo.url}
                                alt={photo.label}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><span class="text-xs text-gray-400">Error</span></div>';
                                  }
                                }}
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-0.5">
                                {photoIndex}
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-xs text-gray-400">-</span>
                            </div>
                          )}
                </div>
                      );
                    })}
                </div>
              </div>

                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>Profile: {user.profileverified === 1 ? '✓ Verified' : '✗ Pending'}</span>
                  <span>•</span>
                  <span>Proof: {user.proofverified === 1 ? '✓ Verified' : '✗ Pending'}</span>
              </div>
            </div>
            );
          })
        )}
      </div>

      {filteredUsers.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="py-2 px-4 border border-gray-300 bg-white rounded-lg text-sm text-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center border rounded-lg text-sm transition-all duration-200 ${
                        currentPage === pageNum 
                          ? 'bg-[#14b8a6] text-white border-[#14b8a6]' 
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return <span key={pageNum} className="px-2 text-gray-500">...</span>;
                }
                return null;
              })}
            </div>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="py-2 px-4 border border-gray-300 bg-white rounded-lg text-sm text-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* User Profile Popup Modal */}
      {selectedUser && (
        <div 
          className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-[2000] p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedUser.userName}</h2>
                <p className="text-sm text-gray-600">{selectedUser.userCode}</p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full transition-colors text-2xl"
                title="Close (ESC)"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                All Photos ({selectedUser.photos.length})
              </h3>
              {selectedUser.photos.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">📷</span>
                  <p className="text-gray-600">No photos uploaded</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
                  {selectedUser.photos.map((photo, index) => {
                    // Validate photo URL
                    const isValidUrl = photo.url && photo.url.trim() !== '' && photo.url !== 'null' && photo.url.startsWith('http');
                    
                    return (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-[#14b8a6] transition-all group bg-gray-100"
                        onClick={() => handleImageClick(photo, selectedUser)}
                      >
                        {isValidUrl ? (
                          <>
                            <img
                              src={photo.url}
                              alt={photo.label}
                              className="w-full h-full object-cover bg-gray-100"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                const parent = target.parentElement;
                                if (parent) {
                                  target.style.display = 'none';
                                  // Check if error div already exists
                                  if (!parent.querySelector('.error-placeholder')) {
                                    const errorDiv = document.createElement('div');
                                    errorDiv.className = 'error-placeholder w-full h-full flex flex-col items-center justify-center bg-gray-200 absolute inset-0';
                                    errorDiv.innerHTML = '<span class="text-3xl mb-1">📷</span><p class="text-[10px] text-gray-500 px-1 text-center">Failed to load</p>';
                                    parent.appendChild(errorDiv);
                                  }
                                }
                              }}
                              onLoad={(e) => {
                                // Image loaded successfully - ensure it's visible
                                const target = e.target as HTMLImageElement;
                                target.style.opacity = '1';
                                target.style.display = 'block';
                              }}
                              style={{ 
                                opacity: 0, 
                                transition: 'opacity 0.3s',
                                display: 'block',
                                backgroundColor: 'transparent'
                              }}
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gray-100 animate-pulse" style={{ display: 'none' }}></div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
                            <span className="text-3xl mb-1">📷</span>
                            <p className="text-[10px] text-gray-500 px-1 text-center">No image URL</p>
                          </div>
                        )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-[10px] text-center py-1 px-1">
                        <div className="font-semibold truncate">{photo.label}</div>
                        {photo.type === 'proof' && (
                          <div className="text-[9px] mt-0.5 opacity-90">Proof</div>
                        )}
                      </div>
                        {isValidUrl && (
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                            <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">👁️</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t border-gray-200">
                {/* Show Accept button only if not fully verified */}
                {!(selectedUser.profileverified === 1 && selectedUser.proofverified === 1) && (
                  <button
                    onClick={() => handleApproveUser(selectedUser)}
                    className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-green-600"
                  >
                    ✓ Accept
                  </button>
                )}
                {/* Show Reject button only if not fully verified */}
                {!(selectedUser.profileverified === 1 && selectedUser.proofverified === 1) && (
                  <button
                    onClick={() => handleRejectUser(selectedUser)}
                    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-red-600"
                  >
                    ✗ Reject
                  </button>
                )}
                {/* Show message if fully verified */}
                {selectedUser.profileverified === 1 && selectedUser.proofverified === 1 && (
                  <div className="flex-1 px-6 py-3 bg-green-100 text-green-800 rounded-lg font-semibold text-center">
                    ✓ Fully Verified
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Image Viewer */}
      {fullScreenImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 flex flex-col items-center justify-center z-[3000] p-4"
          onClick={() => setFullScreenImage(null)}
          style={{ zIndex: 3000 }}
        >
          <div className="relative max-w-[95vw] max-h-[85vh] flex flex-col items-center">
            <div className="mb-4 text-white text-center">
              <h3 className="text-xl font-semibold mb-1">{fullScreenImage.label}</h3>
              <p className="text-sm text-gray-300">User: {users.find(u => u.userId === fullScreenImage.userId)?.userName || 'Unknown'}</p>
            </div>
            
            <img 
              src={fullScreenImage.url} 
              alt={fullScreenImage.label}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="text-white text-center"><span class="text-8xl mb-2 block">📷</span><p class="text-lg">Image not available</p></div>';
                }
              }}
            />

            <button
              onClick={() => setFullScreenImage(null)}
              className="absolute top-4 right-4 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full flex items-center justify-center text-3xl font-light transition-all duration-200 backdrop-blur-sm z-10"
              title="Close (ESC)"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;

