import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface BlockedUser {
  id: number;
  accountId: string;
  userCode: string;
  name: string;
  gender: string;
  age: number;
  mobile: string;
  email?: string;
  blockedDate: string;
  blockedReason: string;
  blockedBy: string;
}

const BlockedUsers: React.FC = () => {
  const [users, setUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        // Simulate API call
        setTimeout(() => {
          setUsers([
            {
              id: 10,
              accountId: 'uuid-10',
              userCode: 'NN#00010',
              name: 'John Doe',
              gender: 'Male',
              age: 35,
              mobile: '+919988776655',
              email: 'john@example.com',
              blockedDate: '2024-09-20',
              blockedReason: 'Inappropriate behavior',
              blockedBy: 'Admin User',
            },
            {
              id: 11,
              accountId: 'uuid-11',
              userCode: 'NN#00011',
              name: 'Jane Smith',
              gender: 'Female',
              age: 28,
              mobile: '+919877665544',
              email: 'jane@example.com',
              blockedDate: '2024-09-18',
              blockedReason: 'Fake profile',
              blockedBy: 'Admin User',
            },
          ]);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching blocked users:', error);
        setLoading(false);
      }
    };

    fetchBlockedUsers();
  }, []);

  const handleUnblock = (userId: number, userName: string) => {
    if (window.confirm(`Are you sure you want to unblock ${userName}?`)) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      // TODO: Implement API call to unblock user
      console.log('Unblock user:', userId);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile.includes(searchTerm) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px] text-lg text-gray-600">Loading blocked users...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Blocked Users</h1>
        <div>
          <button className="py-2 px-4 bg-[#14b8a6] text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#0d9488]">Export CSV</button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex-1 relative max-w-md">
          <input
            type="text"
            placeholder="Search by name, user code, mobile, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Mobile</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Blocked Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Blocked Reason</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Blocked By</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                    {searchTerm ? 'No blocked users found matching your search' : 'No blocked users'}
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{user.userCode}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <Link to={`/admin/users/${user.id}`} className="text-[#14b8a6] hover:underline font-medium">
                        {user.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{user.gender}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{user.age}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{user.mobile}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{user.email || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{user.blockedDate}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">{user.blockedReason}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{user.blockedBy}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/users/${user.id}`} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200" title="View">
                          👁️
                        </Link>
                        <button
                          onClick={() => handleUnblock(user.id, user.name)}
                          className="w-8 h-8 flex items-center justify-center text-green-600 hover:bg-green-50 rounded transition-colors duration-200"
                          title="Unblock"
                        >
                          🔓
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
  );
};

export default BlockedUsers;
