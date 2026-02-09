import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChatService, type Message } from '../../services/chat.service';
import { getAuthData } from '../../utils/auth';
import { getApiUrl } from '../../config/api.config';
import Header from '../../components/layout/Header';

function formatMessageTime(timestamp: { toDate?: () => Date } | null): string {
  if (!timestamp) return '';
  const date = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date();
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const ChatWindow = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const authData = getAuthData();

  useEffect(() => {
    if (!authData?.accountId || !conversationId) {
      navigate('/login');
      return;
    }

    const unsubscribe = ChatService.subscribeToMessages(
      conversationId,
      (updated) => {
        setMessages(updated);
        setLoading(false);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    );
    return () => unsubscribe();
  }, [conversationId, navigate, authData?.accountId]);

  useEffect(() => {
    if (!authData?.token || !conversationId) return;
    const markAsRead = async () => {
      try {
        await fetch(getApiUrl(`/api/chat/conversations/${conversationId}/read`), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authData.token}`,
          },
        });
      } catch (e) {
        console.error('Error marking as read:', e);
      }
    };
    markAsRead();
  }, [conversationId, authData?.token]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !authData?.token || !conversationId) return;

    setSending(true);
    try {
      const res = await fetch(getApiUrl('/api/chat/messages'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify({
          conversationId,
          text: newMessage.trim(),
          type: 'text',
          deviceType: 'web',
        }),
      });
      if (res.ok) {
        setNewMessage('');
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Failed to send message');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

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
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full bg-white shadow-sm rounded-t-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/messages')}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-700"
          >
            ← Back
          </button>
          <h2 className="text-xl font-bold text-gray-800 m-0">Chat</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
          {messages.map((msg) => {
            const isSentByMe = msg.senderId === authData?.accountId;
            return (
              <div
                key={msg.messageId}
                className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    isSentByMe
                      ? 'bg-gradient-to-r from-[#a413ed] to-[#8b10c9] text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm break-words m-0">{msg.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs ${isSentByMe ? 'text-white/80' : 'text-gray-500'}`}
                    >
                      {formatMessageTime(msg.timestamp)}
                    </span>
                    {isSentByMe && (
                      <span className="text-xs">
                        {msg.isRead ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-[#a413ed] focus:ring-1 focus:ring-[#a413ed]"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-6 py-2 bg-gradient-to-r from-[#a413ed] to-[#8b10c9] text-white rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
