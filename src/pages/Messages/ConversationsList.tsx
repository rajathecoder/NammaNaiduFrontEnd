import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatService, type Conversation } from '../../services/chat.service';
import { getAuthData } from '../../utils/auth';
import { deleteConversation } from '../../services/api/chat.api';
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
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const contextRef = useRef<HTMLDivElement>(null);

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
    } catch {
      setError('Firebase not configured. Add VITE_FIREBASE_* env vars for chat.');
      setLoading(false);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [navigate]);

  // Close context menu on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (contextRef.current && !contextRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleContextMenu = (e: React.MouseEvent, conversationId: string) => {
    e.preventDefault();
    setContextMenu({ id: conversationId, x: e.clientX, y: e.clientY });
  };

  const handleDelete = async (conversationId: string) => {
    setDeleting(true);
    try {
      const data = await deleteConversation(conversationId);
      if (data.success) {
        setDeleteConfirm(null);
      } else {
        alert(data.message || 'Failed to delete conversation');
      }
    } catch {
      alert('Failed to delete conversation');
    }
    setDeleting(false);
  };

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B5E20]"></div>
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
                  onContextMenu={(e) => handleContextMenu(e, conv.conversationId)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-3 relative group"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1B5E20] to-[#0D3B13] flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
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
                        <span className="bg-[#1B5E20] text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Delete button on hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(conv.conversationId);
                    }}
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all text-sm"
                    title="Delete conversation"
                  >
                    🗑
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          ref={contextRef}
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-48 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => {
              setDeleteConfirm(contextMenu.id);
              setContextMenu(null);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            🗑 Delete Conversation
          </button>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Conversation</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this conversation? This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationsList;
