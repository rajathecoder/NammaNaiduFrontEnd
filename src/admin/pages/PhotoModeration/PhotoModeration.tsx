import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../../../config/api.config';

interface Photo {
  id: string;
  personPhotoId: number;
  userId: number;
  accountId: string;
  userName: string;
  userCode: string;
  photoUrl: string;
  photoType: 'profile' | 'proof';
  photoPlacement: number | null;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  profileverified?: number;
  proofverified?: number;
  aiDetection: {
    nudity: boolean;
    blur: boolean;
    quality: 'good' | 'medium' | 'poor';
  };
}

const PhotoModeration: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<Photo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchPhotos();
  }, [filter, currentPage]);

  // Handle ESC key to close full screen image
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullScreenImage) {
        setFullScreenImage(null);
      }
    };

    if (fullScreenImage) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [fullScreenImage]);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      const response = await fetch(getApiUrl(`/api/admin/photo-moderation?status=${filter}&page=${currentPage}&limit=${itemsPerPage}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setPhotos(data.data.photos || []);
        }
      } else {
        console.error('Failed to fetch photos');
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPhotos = photos.filter(photo => 
    filter === 'all' || photo.status === filter
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const totalPages = Math.ceil(filteredPhotos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPhotos = filteredPhotos.slice(startIndex, endIndex);

  const toggleSelectPhoto = (photoId: string) => {
    setSelectedPhotos(prev =>
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handleApprove = async (photoId: string) => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(getApiUrl(`/api/admin/photo-moderation/${photoId}/approve`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
    setSelectedPhotos(prev => prev.filter(id => id !== photoId));
          alert('Photo approved successfully! Verification status updated.');
          // Switch to Approved tab and refresh photos
          setFilter('approved');
          // Refresh will happen automatically via useEffect when filter changes
        } else {
          alert(data.message || 'Failed to approve photo');
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to approve photo');
      }
    } catch (error) {
      console.error('Error approving photo:', error);
      alert('Error approving photo');
    }
  };

  const handleReject = async (photoId: string) => {
    const reason = window.prompt('Please provide a reason for rejecting this photo:');
    if (!reason) return;

    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(getApiUrl(`/api/admin/photo-moderation/${photoId}/reject`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
    setPhotos(prev =>
      prev.map(p => p.id === photoId ? { ...p, status: 'rejected' as const } : p)
    );
    setSelectedPhotos(prev => prev.filter(id => id !== photoId));
          alert('Photo rejected successfully! Verification status updated.');
          // Refresh photos to get updated status
          fetchPhotos();
        } else {
          alert(data.message || 'Failed to reject photo');
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to reject photo');
      }
    } catch (error) {
      console.error('Error rejecting photo:', error);
      alert('Error rejecting photo');
    }
  };

  const handleBulkApprove = async () => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      if (!token) return;

      const promises = selectedPhotos.map(photoId =>
        fetch(getApiUrl(`/api/admin/photo-moderation/${photoId}/approve`), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
    );

      await Promise.all(promises);
    setSelectedPhotos([]);
      alert('Selected photos approved successfully!');
      // Switch to Approved tab and refresh photos
      setFilter('approved');
      // Refresh will happen automatically via useEffect when filter changes
    } catch (error) {
      console.error('Error bulk approving photos:', error);
      alert('Error approving photos');
    }
  };

  const handleBulkReject = async () => {
    const reason = window.prompt('Please provide a reason for rejecting these photos:');
    if (!reason) return;

    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      if (!token) return;

      const promises = selectedPhotos.map(photoId =>
        fetch(getApiUrl(`/api/admin/photo-moderation/${photoId}/reject`), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ reason })
        })
      );

      await Promise.all(promises);
    setPhotos(prev =>
      prev.map(p =>
        selectedPhotos.includes(p.id) ? { ...p, status: 'rejected' as const } : p
      )
    );
    setSelectedPhotos([]);
    } catch (error) {
      console.error('Error bulk rejecting photos:', error);
      alert('Error rejecting photos');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-lg text-gray-600">
        Loading photos...
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Proof Verification</h1>
        <div className="flex gap-3">
          {selectedPhotos.length > 0 && (
            <>
              <button onClick={handleBulkApprove} className="py-2 px-4 bg-green-500 text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-green-600">
                ✓ Approve Selected ({selectedPhotos.length})
              </button>
              <button onClick={handleBulkReject} className="py-2 px-4 bg-red-500 text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-red-600">
                ✗ Reject Selected ({selectedPhotos.length})
              </button>
            </>
          )}
          <button className="py-2 px-4 bg-[#14b8a6] text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#0d9488]">📥 Export</button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 bg-white p-1 rounded-lg">
        <button
          className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-200 ${filter === 'all' ? 'bg-[#14b8a6] text-white' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}
          onClick={() => setFilter('all')}
        >
          All ({photos.length})
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-200 ${filter === 'pending' ? 'bg-[#14b8a6] text-white' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({photos.filter(p => p.status === 'pending').length})
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-200 ${filter === 'approved' ? 'bg-[#14b8a6] text-white' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}
          onClick={() => setFilter('approved')}
        >
          Approved ({photos.filter(p => p.status === 'approved').length})
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-200 ${filter === 'rejected' ? 'bg-[#14b8a6] text-white' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}
          onClick={() => setFilter('rejected')}
        >
          Rejected ({photos.filter(p => p.status === 'rejected').length})
        </button>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPhotos.map(photo => (
              <div
                key={photo.id}
                className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer transition-all duration-200 border-2 ${selectedPhotos.includes(photo.id) ? 'border-[#14b8a6]' : 'border-transparent hover:border-gray-200'} ${photo.status === 'approved' ? 'opacity-60' : ''}`}
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="flex justify-end mb-2">
                  <input
                    type="checkbox"
                    checked={selectedPhotos.includes(photo.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSelectPhoto(photo.id);
                    }}
                    className="w-4 h-4"
                  />
                </div>
                <div className="relative mb-4">
                  <div 
                    className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setFullScreenImage(photo);
                    }}
                  >
                    <img 
                      src={photo.photoUrl} 
                      alt={photo.photoType === 'proof' ? 'Proof Image' : `Photo ${photo.photoPlacement}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="w-full h-full flex flex-col items-center justify-center"><span class="text-6xl mb-2">📷</span><p class="text-xs text-gray-500">Image not available</p></div>';
                        }
                      }}
                    />
                  </div>
                  <div className="absolute top-2 right-2 z-10">
                    <div className={`px-2 py-1 text-xs font-semibold rounded-full ${photo.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : photo.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{photo.status}</div>
                  </div>
                  {photo.photoType === 'proof' && (
                    <div className="absolute top-2 left-2 z-10">
                      <div className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Proof</div>
                    </div>
                  )}
                </div>
                <div>
                  <div className="mb-3">
                    <h3 className="text-base font-semibold text-gray-800 mb-1">{photo.userName}</h3>
                    <p className="text-xs text-gray-600">{photo.userCode}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {photo.photoType === 'proof' ? 'Aadhar Card' : `Photo ${photo.photoPlacement}`}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className={`px-2 py-1 text-xs font-semibold rounded-full ${photo.aiDetection.nudity ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {photo.aiDetection.nudity ? '⚠️ Nudity' : '✓ Safe'}
                    </div>
                    <div className={`px-2 py-1 text-xs font-semibold rounded-full ${photo.aiDetection.blur ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {photo.aiDetection.blur ? '🔍 Blur' : '✓ Clear'}
                    </div>
                    <div className={`px-2 py-1 text-xs font-semibold rounded-full ${photo.aiDetection.quality === 'good' ? 'bg-green-100 text-green-800' : photo.aiDetection.quality === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      Quality: {photo.aiDetection.quality}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {photo.status !== 'approved' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(photo.id);
                      }}
                        className="flex-1 py-2 px-3 bg-green-500 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-200 hover:bg-green-600"
                    >
                      ✓ Approve
                    </button>
                    )}
                    {photo.status !== 'rejected' && !(photo.profileverified === 1 && photo.proofverified === 1) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(photo.id);
                      }}
                        className="flex-1 py-2 px-3 bg-red-500 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-200 hover:bg-red-600"
                    >
                      ✗ Reject
                    </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPhotos.length > 0 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredPhotos.length)} of {filteredPhotos.length} photos
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
                          className={`w-10 h-10 flex items-center justify-center border rounded-lg text-sm transition-all duration-200 ${currentPage === pageNum ? 'bg-[#14b8a6] text-white border-[#14b8a6]' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
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
        </div>

        {selectedPhoto && (
          <div className="w-96 bg-white rounded-xl shadow-lg p-6 h-fit sticky top-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Photo Details</h2>
              <button onClick={() => setSelectedPhoto(null)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200">×</button>
            </div>
            <div>
              <div className="mb-4">
                <div 
                  className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity" 
                  onClick={() => setFullScreenImage(selectedPhoto)}
                >
                  <img 
                    src={selectedPhoto.photoUrl} 
                    alt={selectedPhoto.photoType === 'proof' ? 'Proof Image' : `Photo ${selectedPhoto.photoPlacement}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-full flex flex-col items-center justify-center"><span class="text-8xl mb-2">📷</span><p class="text-sm text-gray-500">Image not available</p></div>';
                      }
                    }}
                  />
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-base font-semibold text-gray-800 mb-2">User Information</h3>
                <p className="text-sm text-gray-700 mb-1"><strong>Name:</strong> {selectedPhoto.userName}</p>
                <p className="text-sm text-gray-700 mb-1"><strong>User Code:</strong> {selectedPhoto.userCode}</p>
                <p className="text-sm text-gray-700 mb-1"><strong>Photo Type:</strong> {selectedPhoto.photoType === 'proof' ? 'Aadhar Card (Proof)' : `Profile Photo ${selectedPhoto.photoPlacement}`}</p>
                <p className="text-sm text-gray-700"><strong>Uploaded:</strong> {new Date(selectedPhoto.uploadedAt).toLocaleDateString()}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-base font-semibold text-gray-800 mb-2">AI Detection Results</h3>
                <div className="space-y-2">
                  <div className={`flex justify-between items-center p-2 rounded ${selectedPhoto.aiDetection.nudity ? 'bg-red-50' : 'bg-green-50'}`}>
                    <span className="text-sm text-gray-700">Nudity Detection:</span>
                    <strong className={`text-sm ${selectedPhoto.aiDetection.nudity ? 'text-red-800' : 'text-green-800'}`}>{selectedPhoto.aiDetection.nudity ? '⚠️ Detected' : '✓ Safe'}</strong>
                  </div>
                  <div className={`flex justify-between items-center p-2 rounded ${selectedPhoto.aiDetection.blur ? 'bg-yellow-50' : 'bg-green-50'}`}>
                    <span className="text-sm text-gray-700">Blur Detection:</span>
                    <strong className={`text-sm ${selectedPhoto.aiDetection.blur ? 'text-yellow-800' : 'text-green-800'}`}>{selectedPhoto.aiDetection.blur ? '🔍 Blurred' : '✓ Clear'}</strong>
                  </div>
                  <div className={`flex justify-between items-center p-2 rounded ${selectedPhoto.aiDetection.quality === 'good' ? 'bg-green-50' : selectedPhoto.aiDetection.quality === 'medium' ? 'bg-yellow-50' : 'bg-red-50'}`}>
                    <span className="text-sm text-gray-700">Quality:</span>
                    <strong className={`text-sm ${selectedPhoto.aiDetection.quality === 'good' ? 'text-green-800' : selectedPhoto.aiDetection.quality === 'medium' ? 'text-yellow-800' : 'text-red-800'}`}>{selectedPhoto.aiDetection.quality.toUpperCase()}</strong>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {selectedPhoto.status !== 'approved' && (
                <button
                  onClick={() => {
                    handleApprove(selectedPhoto.id);
                    setSelectedPhoto(null);
                  }}
                    className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-green-600"
                >
                  ✓ Approve Photo
                </button>
                )}
                {selectedPhoto.status !== 'rejected' && !(selectedPhoto.profileverified === 1 && selectedPhoto.proofverified === 1) && (
                <button
                  onClick={() => {
                    handleReject(selectedPhoto.id);
                    setSelectedPhoto(null);
                  }}
                    className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-red-600"
                >
                  ✗ Reject Photo
                </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Image Viewer */}
      {fullScreenImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 flex flex-col items-center justify-center z-[3000] p-4"
          onClick={() => setFullScreenImage(null)}
        >
          <div className="relative max-w-[95vw] max-h-[85vh] flex flex-col items-center">
            <div className="mb-4 text-white text-center">
              <h3 className="text-xl font-semibold mb-1">{fullScreenImage.photoType === 'proof' ? 'Aadhar Card (Proof)' : `Photo ${fullScreenImage.photoPlacement}`}</h3>
              <p className="text-sm text-gray-300">User: {fullScreenImage.userName} ({fullScreenImage.userCode})</p>
              <div className={`mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                fullScreenImage.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                fullScreenImage.status === 'approved' ? 'bg-green-100 text-green-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {fullScreenImage.status}
              </div>
            </div>
            
            <img 
              src={fullScreenImage.photoUrl} 
              alt={fullScreenImage.photoType === 'proof' ? 'Proof Image' : `Photo ${fullScreenImage.photoPlacement}`}
              className="max-w-full max-h-[70vh] object-contain rounded-lg mb-4"
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

            {/* Show buttons based on status */}
            <div className="flex gap-4 mt-4" onClick={(e) => e.stopPropagation()}>
              {fullScreenImage.status !== 'approved' && (
                <button
                  onClick={() => {
                    handleApprove(fullScreenImage.id);
                    setFullScreenImage(null);
                  }}
                  className="px-8 py-3 bg-green-500 text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-green-600"
                >
                  ✓ Approve
                </button>
              )}
              {fullScreenImage.status !== 'rejected' && 
               !(fullScreenImage.profileverified === 1 && fullScreenImage.proofverified === 1) && (
                <button
                  onClick={() => {
                    handleReject(fullScreenImage.id);
                    setFullScreenImage(null);
                  }}
                  className="px-8 py-3 bg-red-500 text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-red-600"
                >
                  ✗ Reject
                </button>
              )}
            </div>

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

export default PhotoModeration;
