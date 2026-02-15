import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../config/api.config';

interface FlaggedUser {
  id: number;
  accountId: string;
  name: string;
  userCode: string;
  phone: string;
  email: string;
  gender: string;
  isActive: boolean;
  isFlagged: boolean;
  flagReason: string | null;
  reportCount: number;
  createdAt: string;
}

const FlaggedUsers: React.FC = () => {
  const [users, setUsers] = useState<FlaggedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const itemsPerPage = 20;

  const token = localStorage.getItem('adminToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const fetchFlaggedUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/flagged-users?page=${currentPage}&limit=${itemsPerPage}`, { headers });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data || []);
        setTotalUsers(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Error fetching flagged users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlaggedUsers();
  }, [currentPage]);

  const handleAction = async (accountId: string, action: 'clear' | 'warn' | 'block') => {
    const labels = { clear: 'clear the flag for', warn: 'warn', block: 'block' };
    if (!window.confirm(`Are you sure you want to ${labels[action]} this user?`)) return;

    setActionLoading(accountId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/flagged-users/${accountId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        // Remove from list (no longer flagged)
        setUsers(prev => prev.filter(u => u.accountId !== accountId));
        setTotalUsers(prev => prev - 1);
      } else {
        alert(data.message || 'Action failed');
      }
    } catch (err) {
      console.error('Error performing action:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px] text-lg text-gray-600">Loading flagged users...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Flagged Users</h1>
          <p className="text-sm text-gray-500 mt-1">Users auto-flagged due to multiple reports. Review and take action.</p>
        </div>
        <div className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
          {totalUsers} flagged
        </div>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <span className="text-5xl mb-4 block">✅</span>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Flagged Users</h3>
          <p className="text-sm text-gray-500">All clear! No users are currently flagged for review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.accountId} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-lg">
                    {user.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 flex items-center gap-2">
                      {user.name}
                      <span className="text-xs text-gray-500">{user.userCode}</span>
                      {!user.isActive && <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">Banned</span>}
                    </div>
                    <div className="text-sm text-gray-500">{user.email} | {user.phone} | {user.gender}</div>
                    <div className="text-xs text-orange-600 mt-1 font-medium">{user.flagReason}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">{user.reportCount}</div>
                  <div className="text-xs text-gray-500">reports</div>
                </div>
              </div>

              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleAction(user.accountId, 'clear')}
                  disabled={actionLoading === user.accountId}
                  className="flex-1 px-4 py-2.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-50"
                >
                  Clear Flag
                </button>
                <button
                  onClick={() => handleAction(user.accountId, 'warn')}
                  disabled={actionLoading === user.accountId}
                  className="flex-1 px-4 py-2.5 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors disabled:opacity-50"
                >
                  Warn User
                </button>
                <button
                  onClick={() => handleAction(user.accountId, 'block')}
                  disabled={actionLoading === user.accountId || !user.isActive}
                  className="flex-1 px-4 py-2.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  {user.isActive ? 'Block User' : 'Already Blocked'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
          <div className="flex gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="py-2 px-4 border border-gray-300 bg-white rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="py-2 px-4 border border-gray-300 bg-white rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlaggedUsers;
