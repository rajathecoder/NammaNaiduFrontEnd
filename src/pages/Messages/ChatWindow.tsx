import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChatService, type Message } from '../../services/chat.service';
import { getAuthData } from '../../utils/auth';
import { getApiUrl } from '../../config/api.config';
import { reportConversation, deleteConversation, uploadChatImage } from '../../services/api/chat.api';
import Header from '../../components/layout/Header';

function formatMessageTime(timestamp: { toDate?: () => Date } | null): string {
  if (!timestamp) return '';
  const date = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date();
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const REPORT_REASONS = [
  { value: 'inappropriate', label: 'Inappropriate Content' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'spam', label: 'Spam' },
  { value: 'fake_profile', label: 'Fake Profile' },
  { value: 'other', label: 'Other' },
];

const ChatWindow = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
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

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const sendTextMessage = async (e: React.FormEvent) => {
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
      const data = await res.json();
      if (res.ok) {
        setNewMessage('');
      } else {
        if (data.code === 'INSUFFICIENT_TOKENS') {
          alert('You need profile view tokens to send your first message. Please purchase a subscription.');
        } else {
          alert(data.message || 'Failed to send message');
        }
      }
    } catch (e) {
      console.error(e);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be under 10MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const sendImageMessage = async () => {
    if (!imagePreview || !conversationId || !authData?.token || uploadingImage) return;

    setUploadingImage(true);
    try {
      // Upload to Cloudinary
      const uploadRes = await uploadChatImage(imagePreview, conversationId);
      if (!uploadRes.success) {
        if (uploadRes.code === 'INSUFFICIENT_TOKENS') {
          alert('You need profile view tokens to send your first message. Please purchase a subscription.');
        } else {
          alert(uploadRes.message || 'Failed to upload image');
        }
        setUploadingImage(false);
        return;
      }

      // Send message with image URL
      const res = await fetch(getApiUrl('/api/chat/messages'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify({
          conversationId,
          text: '',
          type: 'image',
          imageUrl: uploadRes.data.imageUrl,
          deviceType: 'web',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setImagePreview(null);
        setImageFile(null);
      } else {
        alert(data.message || 'Failed to send image');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to send image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason || !conversationId) return;
    setReportSubmitting(true);
    try {
      const data = await reportConversation(conversationId, reportReason, reportDescription);
      if (data.success) {
        alert('Report submitted successfully');
        setShowReportModal(false);
        setReportReason('');
        setReportDescription('');
      } else {
        alert(data.message || 'Failed to submit report');
      }
    } catch {
      alert('Failed to submit report');
    }
    setReportSubmitting(false);
  };

  const handleDelete = async () => {
    if (!conversationId) return;
    setDeleting(true);
    try {
      const data = await deleteConversation(conversationId);
      if (data.success) {
        navigate('/messages');
      } else {
        alert(data.message || 'Failed to delete conversation');
      }
    } catch {
      alert('Failed to delete conversation');
    }
    setDeleting(false);
  };

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
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full bg-white shadow-sm rounded-t-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/messages')}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-700"
          >
            ← Back
          </button>
          <h2 className="text-xl font-bold text-gray-800 m-0 flex-1">Chat</h2>
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 text-xl"
            >
              ⋮
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-48 z-50">
                <button
                  onClick={() => { setShowMenu(false); setShowReportModal(true); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  🚩 Report
                </button>
                <button
                  onClick={() => { setShowMenu(false); setShowDeleteConfirm(true); }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  🗑 Delete Conversation
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
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
                      ? 'bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {msg.type === 'image' && msg.imageUrl ? (
                    <img
                      src={msg.imageUrl}
                      alt="Shared"
                      className="max-w-[250px] max-h-[300px] rounded-lg cursor-pointer object-cover"
                      onClick={() => setViewingImage(msg.imageUrl || null)}
                    />
                  ) : (
                    <p className="text-sm break-words m-0">{msg.text}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs ${isSentByMe ? 'text-white/80' : 'text-gray-500'}`}>
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

        {/* Image Preview */}
        {imagePreview && (
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 m-0">{imageFile?.name}</p>
                <p className="text-xs text-gray-400 m-0">{imageFile ? Math.round(imageFile.size / 1024) + ' KB' : ''}</p>
              </div>
              <button
                onClick={() => { setImagePreview(null); setImageFile(null); }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
              <button
                onClick={sendImageMessage}
                disabled={uploadingImage}
                className="px-4 py-2 bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] text-white rounded-full text-sm font-semibold disabled:opacity-50"
              >
                {uploadingImage ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        )}

        {/* Message Input */}
        <form onSubmit={sendTextMessage} className="p-4 border-t border-gray-100">
          <div className="flex gap-2 items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg text-xl"
              title="Send image"
            >
              📎
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-6 py-2 bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] text-white rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
            >
              {sending ? '...' : 'Send'}
            </button>
          </div>
        </form>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Report Conversation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <div className="space-y-2">
                  {REPORT_REASONS.map((r) => (
                    <label key={r.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="reason"
                        value={r.value}
                        checked={reportReason === r.value}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="text-[#1B5E20]"
                      />
                      <span className="text-sm text-gray-700">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details (optional)</label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                  placeholder="Describe the issue..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowReportModal(false); setReportReason(''); setReportDescription(''); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason || reportSubmitting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
              >
                {reportSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Conversation</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this conversation? This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer */}
      {viewingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={() => setViewingImage(null)}>
          <button
            className="absolute top-4 right-4 text-white text-2xl p-2 hover:bg-white/10 rounded-full"
            onClick={() => setViewingImage(null)}
          >
            ✕
          </button>
          <img src={viewingImage} alt="Full size" className="max-w-[90vw] max-h-[90vh] object-contain" />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
