import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatService, type Conversation } from '../../services/chat.service';
import { getAuthData } from '../../utils/auth';
import Header from '../../components/layout/Header';

function formatTime(timestamp: { toDate?: () => Date } | null): string {
  if (!timestamp) return '';
  const date = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date();
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

const ConversationsList = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authData = getAuthData();
    if (!authData?.accountId) {
      navigate('/login');
      return;
    }

    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = ChatService.subscribeToConversations(
        authData.accountId,
        (updated) => {
          setConversations(updated);
          setLoading(false);
          setError(null);
        }
      );
    } catch (e) {
      setError('Firebase not configured. Add VITE_FIREBASE_* env vars for chat.');
      setLoading(false);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#f0f2f5]">
        <Header />
        <div className="max-w-2xl mx-auto p-6">
          <p className="text-gray-600 text-center py-12">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5]">
        <Header />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a413ed]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
      <Header />
      <div className="flex-1 max-w-2xl mx-auto w-full p-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 m-0">Messages</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No conversations yet. Send interest to a profile and get accepted to start chatting.
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.conversationId}
                  onClick={() => navigate(`/messages/${conv.conversationId}`)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-3"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#a413ed] to-[#8b10c9] flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
                    {conv.otherUserPhoto ? (
                      <img
                        src={conv.otherUserPhoto}
                        alt={conv.otherUserName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      conv.otherUserName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conv.otherUserName}
                      </h3>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {formatTime(conv.lastMessageTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-gray-600 truncate flex-1">
                        {conv.lastMessage || 'Start a conversation'}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="bg-[#a413ed] text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationsList;
