import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import { getAuthData } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, getApiUrl } from '../../config/api.config';

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
            default: return '📢';
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <Header />
            <div className="max-w-4xl mx-auto py-12 px-6">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#1a1a1a] mb-2">Notifications</h1>
                        <p className="text-gray-500 font-medium">Stay updated with your latest activities and matches.</p>
                    </div>
                    <button className="text-[#8b10c9] font-bold text-sm hover:underline" onClick={markAllAsRead}>Mark all as read</button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] shadow-sm border border-gray-100">
                        <div className="w-12 h-12 border-4 border-[#a413ed10] border-t-[#a413ed] rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 font-bold">Fetching your updates...</p>
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`group relative bg-white p-6 rounded-[32px] border transition-all duration-300 flex gap-6 items-start cursor-pointer hover:shadow-xl hover:-translate-y-1 ${notification.isRead ? 'border-gray-50 opacity-80' : 'border-[#a413ed20] shadow-md shadow-[#a413ed05]'}`}
                                onClick={() => {
                                    markAsRead(notification.id);
                                    if (notification.sender?.accountId) navigate(`/profile/${notification.sender.accountId}`);
                                }}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform group-hover:scale-110 ${notification.isRead ? 'bg-gray-100 text-gray-400' : 'bg-gradient-to-br from-[#a413ed10] to-[#8b10c910] text-[#8b10c9]'}`}>
                                    {getTypeIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`text-lg font-bold ${notification.isRead ? 'text-gray-700' : 'text-[#1a1a1a]'}`}>{notification.title}</h3>
                                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{formatTime(notification.createdAt)}</span>
                                    </div>
                                    <p className="text-gray-500 font-medium leading-relaxed">{notification.message}</p>
                                </div>
                                {!notification.isRead && (
                                    <div className="w-3 h-3 bg-gradient-to-r from-[#a413ed] to-[#8b10c9] rounded-full shadow-lg shadow-[#a413ed50]"></div>
                                )}
                            </div>
                        ))}
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

