import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api/admin.api';
import { getApiUrl } from '../../../config/api.config';

interface User {
  id: number;
  accountId?: string;
  userCode?: string;
  name: string;
  gender?: string;
  age?: number;
  religion?: string;
  caste?: string;
  mobile?: string;
  phone?: string;
  email?: string;
  status?: 'Active' | 'Inactive' | 'active' | 'inactive';
  verified?: boolean;
  isActive?: boolean;
  profileverified?: number;
  proofverified?: number;
  basicDetail?: {
    dateOfBirth?: string;
    religion?: string;
    caste?: string;
  };
}

const AllUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setError('No authentication token found. Please login again.');
          setLoading(false);
          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }

        const response = await adminApi.getAllUsers(token);

        // Check if token is invalid
        if (response.message && (response.message.includes('Token is not valid') || response.message.includes('authorization denied') || response.message === 'Token is not valid')) {
          setError('Your session has expired. Please login again.');
          // Clear invalid token
          localStorage.removeItem('adminToken');
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('adminInfo');
          localStorage.removeItem('adminRole');
          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          setLoading(false);
          return;
        }

        if (response.success && response.data) {
          // Transform API data to match our interface
          const transformedUsers = response.data.map((user: any) => {
            // Calculate age from dateOfBirth if available
            let age: number | undefined;
            if (user.basicDetail?.dateOfBirth) {
              const birthDate = new Date(user.basicDetail.dateOfBirth);
              const today = new Date();
              age = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();
              if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
              }
            }

            // Determine status - use status from API if available, otherwise derive from isActive
            const status = user.status || (user.isActive === false ? 'Inactive' : 'Active');

            return {
              id: user.id,
              accountId: user.accountId,
              userCode: user.userCode || `NN#${String(user.id).padStart(5, '0')}`,
              name: user.name || 'Unknown',
              gender: user.gender,
              age: age,
              religion: user.basicDetail?.religion,
              caste: user.basicDetail?.caste,
              mobile: user.phone || user.mobile,
              email: user.email,
              status: status as 'Active' | 'Inactive',
              verified: user.verified || user.profileveriffied === 1 || false,
              profileverified: user.profileverified || 0,
              proofverified: user.proofverified || 0,
            };
          });

          setUsers(transformedUsers);
        } else {
          setError(response.message || 'Failed to fetch users');
        }
      } catch (error: any) {
        console.error('Error fetching users:', error);
        
        // Check if it's a network error
        if (error.message && error.message.includes('Failed to fetch')) {
          setError('Unable to connect to server. Please check your internet connection and ensure the backend server is running.');
        } 
        // Check if it's an authentication error
        else if (error.message && (error.message.includes('Token is not valid') || error.message.includes('authorization denied') || error.message.includes('401'))) {
          setError('Your session has expired. Please login again.');
          localStorage.removeItem('adminToken');
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('adminInfo');
          localStorage.removeItem('adminRole');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } 
        // Other errors
        else {
          setError(error.message || 'Error loading users. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.mobile && user.mobile.includes(searchTerm)) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.userCode && user.userCode.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'Active' && (user.status === 'Active' || user.status === 'active')) ||
      (filterStatus === 'Inactive' && (user.status === 'Inactive' || user.status === 'inactive'));
    const matchesGender = filterGender === 'all' || user.gender === filterGender;
    
    return matchesSearch && matchesStatus && matchesGender;
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterGender, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Helper function to get verification status badge
  const getVerificationStatus = (status: number | undefined): React.JSX.Element => {
    if (status === 1) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Verified</span>;
    } else if (status === 2) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Unverified</span>;
    }
  };

  const handleBlock = async (userId: number) => {
    if (window.confirm('Are you sure you want to block this user?')) {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          alert('No authentication token found');
          return;
        }

        const user = users.find(u => u.id === userId);
        const isCurrentlyActive = user?.status === 'Active' || user?.status === 'active';
        const response = await adminApi.updateUserStatus(userId, !isCurrentlyActive, token);

        if (response.success) {
          // Refresh the user list
          const refreshResponse = await adminApi.getAllUsers(token);
          if (refreshResponse.success && refreshResponse.data) {
            const transformedUsers = refreshResponse.data.map((user: any) => {
              let age: number | undefined;
              if (user.basicDetail?.dateOfBirth) {
                const birthDate = new Date(user.basicDetail.dateOfBirth);
                const today = new Date();
                age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                  age--;
                }
              }
              const status = user.status || (user.isActive === false ? 'Inactive' : 'Active');
              return {
                id: user.id,
                accountId: user.accountId,
                userCode: user.userCode || `NN#${String(user.id).padStart(5, '0')}`,
                name: user.name || 'Unknown',
                gender: user.gender,
                age: age,
                religion: user.basicDetail?.religion,
                caste: user.basicDetail?.caste,
                mobile: user.phone || user.mobile,
                email: user.email,
                status: status as 'Active' | 'Inactive',
                verified: user.verified || user.profileveriffied === 1 || false,
              };
            });
            setUsers(transformedUsers);
          }
          alert(response.message || `User ${isCurrentlyActive ? 'blocked' : 'activated'} successfully`);
        } else {
          alert(response.message || 'Failed to update user status');
        }
      } catch (error: any) {
        console.error('Error blocking user:', error);
        alert('Failed to update user status. Please try again.');
      }
    }
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          alert('No authentication token found');
          return;
        }

        const response = await fetch(getApiUrl(`/api/admin/users/${userId}`), {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (result.success) {
          // Remove user from list
          setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
          alert('User deleted successfully');
        } else {
          alert(result.message || 'Failed to delete user');
        }
      } catch (error: any) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px] text-lg text-gray-600">Loading users...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Users</h1>
        <div>
          <button className="py-2 px-4 bg-[#14b8a6] text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#0d9488]">Export CSV</button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-6 bg-white p-1 rounded-lg">
        <button
          className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-200 ${filterGender === 'all' ? 'bg-[#14b8a6] text-white' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}
          onClick={() => setFilterGender('all')}
        >
          All ({users.length})
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-200 ${filterGender === 'Male' ? 'bg-[#14b8a6] text-white' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}
          onClick={() => setFilterGender('Male')}
        >
          👨 Male ({users.filter(u => u.gender === 'Male').length})
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-200 ${filterGender === 'Female' ? 'bg-[#14b8a6] text-white' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}
          onClick={() => setFilterGender('Female')}
        >
          👩 Female ({users.filter(u => u.gender === 'Female').length})
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by name, mobile, email, or user code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Gender</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Age</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Religion / Caste</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Mobile</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">PhotoVerified</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ProofVerified</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-gray-500">No users found</td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{user.userCode || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <Link to={`/admin/users/${user.id}`} className="text-[#14b8a6] hover:underline font-medium">
                        {user.name || 'Unknown'}
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{user.gender || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{user.age || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-800">{user.religion || '-'}</span>
                        <span className="text-gray-500 text-xs">{user.caste || '-'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{user.mobile || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{user.email || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        (user.status === 'Active' || user.status === 'active') 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getVerificationStatus(user.profileverified)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getVerificationStatus(user.proofverified)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/users/${user.id}`} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200" title="View">
                          👁️
                        </Link>
                        <Link to={`/admin/users/${user.id}/edit`} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200" title="Edit">
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleBlock(user.id)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
                          title="Block"
                        >
                          🚫
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
                // Show first page, last page, current page, and pages around current
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
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
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
  );
};

export default AllUsers;


