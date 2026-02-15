import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { getApiUrl, API_ENDPOINTS } from '../../config/api.config';
import { getAuthData } from '../../utils/auth';

interface BlockedUser {
    id: number;
    blockedAccountId: string;
    reason: string | null;
    createdAt: string;
    blocked: {
        accountId: string;
        name: string;
        userCode: string;
        gender: string;
        dateOfBirth: string | null;
    } | null;
}

const BlockedUsers = () => {
    const navigate = useNavigate();
    const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [unblocking, setUnblocking] = useState<string | null>(null);

    useEffect(() => {
        fetchBlockedUsers();
    }, []);

    const fetchBlockedUsers = async () => {
        try {
            const auth = getAuthData();
            if (!auth?.token) { navigate('/login'); return; }
            const res = await fetch(getApiUrl(API_ENDPOINTS.USERS.BLOCKED_USERS), {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            const data = await res.json();
            if (data.success) {
                setBlockedUsers(data.data || []);
            }
        } catch (err) {
            console.error('Error fetching blocked users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUnblock = async (accountId: string) => {
        const auth = getAuthData();
        if (!auth?.token) return;
        setUnblocking(accountId);
        try {
            const res = await fetch(getApiUrl(API_ENDPOINTS.USERS.BLOCK_USER), {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
                body: JSON.stringify({ targetAccountId: accountId }),
            });
            const data = await res.json();
            if (data.success) {
                setBlockedUsers(prev => prev.filter(b => b.blockedAccountId !== accountId));
            } else {
                alert(data.message || 'Failed to unblock user');
            }
        } catch {
            alert('Failed to unblock user. Please try again.');
        } finally {
            setUnblocking(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Blocked Users</h1>
                        <p className="text-sm text-gray-500 mt-1">Users you have blocked will not be able to see your profile or contact you</p>
                    </div>
                    <button onClick={() => navigate('/profile-settings')} className="text-sm text-[#1B5E20] hover:underline font-medium">
                        Back to Settings
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-[40vh]">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1B5E20]" />
                    </div>
                ) : blockedUsers.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <span className="text-5xl mb-4 block">🕊️</span>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Blocked Users</h3>
                        <p className="text-sm text-gray-500">You haven't blocked anyone yet. When you block someone, they'll appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {blockedUsers.map((block) => (
                            <div key={block.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1B5E20] to-[#0D3B13] flex items-center justify-center text-white font-bold text-lg">
                                        {block.blocked?.name?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-800">{block.blocked?.name || 'Unknown User'}</div>
                                        <div className="text-xs text-gray-500">{block.blocked?.userCode || ''} {block.blocked?.gender ? `· ${block.blocked.gender}` : ''}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">Blocked on {new Date(block.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleUnblock(block.blockedAccountId)}
                                    disabled={unblocking === block.blockedAccountId}
                                    className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                                >
                                    {unblocking === block.blockedAccountId ? 'Unblocking...' : 'Unblock'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlockedUsers;
