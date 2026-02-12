import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import { getAuthData } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, getApiUrl, API_BASE_URL } from '../../config/api.config';

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        const authData = getAuthData();
        if (!authData?.token) {
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.NOTIFICATIONS.GET), {
                headers: { 'Authorization': `Bearer ${authData.token}` }
            });
            const data = await response.json();
            if (data.success) {
                setNotifications(data.data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [navigate]);

    const markAsRead = async (id: number) => {
        const authData = getAuthData();
        if (!authData?.token) return;

        try {
            await fetch(getApiUrl(API_ENDPOINTS.USERS.NOTIFICATIONS.READ(id)), {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${authData.token}` }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        const authData = getAuthData();
        if (!authData?.token) return;

        try {
            await fetch(getApiUrl(API_ENDPOINTS.USERS.NOTIFICATIONS.READ_ALL), {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${authData.token}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        return date.toLocaleDateString();
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'interest_received': return '💖';
            case 'interest_accepted': return '✨';
            case 'shortlisted': return '⭐';
            case 'profile_viewed': return '👁️';
            case 'system': return '📢';
            default: return '🔔';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'interest_received': return 'Interest Received';
            case 'interest_accepted': return 'Interest Accepted';
            case 'shortlisted': return 'Shortlisted';
            case 'profile_viewed': return 'Profile Viewed';
            case 'system': return 'System';
            default: return 'Notification';
        }
    };

    /* ── Helper: build sender photo URL ─── */
    const getSenderPhoto = (notification: any): string | null => {
        const photo1 = notification.sender?.personPhoto?.photo1;
        if (!photo1) return null;
        // If already a full URL, use directly; otherwise prepend base
        if (photo1.startsWith('http')) return photo1;
        return `${API_BASE_URL}${photo1.startsWith('/') ? '' : '/'}${photo1}`;
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <Header />
            <div className="max-w-4xl mx-auto py-12 px-6">
                {/* ── Header ─── */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#1a1a1a] mb-2">Notifications</h1>
                        <p className="text-gray-500 font-medium">
                            {unreadCount > 0
                                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                                : 'Stay updated with your latest activities and matches.'}
                        </p>
                    </div>
                    {notifications.length > 0 && (
                        <button
                            className="text-[#0D3B13] font-bold text-sm hover:underline"
                            onClick={markAllAsRead}
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] shadow-sm border border-gray-100">
                        <div className="w-12 h-12 border-4 border-[#1B5E2010] border-t-[#1B5E20] rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 font-bold">Fetching your updates...</p>
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="space-y-4">
                        {notifications.map((notification) => {
                            const senderPhoto = getSenderPhoto(notification);

                            return (
                                <div
                                    key={notification.id}
                                    className={`group relative bg-white rounded-[28px] border transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 overflow-hidden ${
                                        notification.isRead
                                            ? 'border-gray-50 opacity-80'
                                            : 'border-[#1B5E2020] shadow-md shadow-[#1B5E2005]'
                                    }`}
                                    onClick={() => {
                                        markAsRead(notification.id);
                                        if (notification.sender?.accountId) navigate(`/profile/${notification.sender.accountId}`);
                                    }}
                                >
                                    {/* ── Notification image (if present) ─── */}
                                    {notification.imageUrl && (
                                        <div className="w-full h-48 overflow-hidden">
                                            <img
                                                src={notification.imageUrl}
                                                alt=""
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}

                                    <div className="p-6 flex gap-5 items-start">
                                        {/* ── Avatar / Icon ─── */}
                                        {senderPhoto ? (
                                            <img
                                                src={senderPhoto}
                                                alt={notification.sender?.name || ''}
                                                className="w-14 h-14 rounded-2xl object-cover shrink-0 transition-transform group-hover:scale-110 border-2 border-gray-100"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                    (e.target as HTMLImageElement).nextElementSibling!.classList.remove('hidden');
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform group-hover:scale-110 ${
                                                senderPhoto ? 'hidden' : ''
                                            } ${
                                                notification.isRead
                                                    ? 'bg-gray-100 text-gray-400'
                                                    : 'bg-gradient-to-br from-[#1B5E2010] to-[#0D3B1310] text-[#0D3B13]'
                                            }`}
                                        >
                                            {getTypeIcon(notification.type)}
                                        </div>

                                        {/* ── Content ─── */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1 gap-3">
                                                <div className="min-w-0">
                                                    <h3
                                                        className={`text-lg font-bold truncate ${
                                                            notification.isRead ? 'text-gray-700' : 'text-[#1a1a1a]'
                                                        }`}
                                                    >
                                                        {notification.title}
                                                    </h3>
                                                    {notification.sender?.name && (
                                                        <p className="text-xs text-gray-400 font-semibold mt-0.5">
                                                            from {notification.sender.name}
                                                            {notification.sender.userCode ? ` (${notification.sender.userCode})` : ''}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="shrink-0 text-right">
                                                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                                        {formatTime(notification.createdAt)}
                                                    </span>
                                                    <div className="mt-1">
                                                        <span
                                                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                                notification.type === 'system'
                                                                    ? 'bg-blue-50 text-blue-600'
                                                                    : 'bg-green-50 text-green-600'
                                                            }`}
                                                        >
                                                            {getTypeLabel(notification.type)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-500 font-medium leading-relaxed mt-1">
                                                {notification.message}
                                            </p>
                                        </div>

                                        {/* ── Unread dot ─── */}
                                        {!notification.isRead && (
                                            <div className="w-3 h-3 bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] rounded-full shadow-lg shadow-[#1B5E2050] shrink-0 mt-2"></div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-[40px] border border-gray-100 shadow-sm">
                        <div className="text-6xl mb-6">📭</div>
                        <h3 className="text-xl font-bold text-gray-400">All caught up!</h3>
                        <p className="text-gray-400 text-sm mt-2 font-medium">No new notifications at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
