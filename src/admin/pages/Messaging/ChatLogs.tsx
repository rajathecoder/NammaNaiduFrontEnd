import React, { useState, useEffect, useCallback } from 'react';
import {
  getAdminConversations,
  getAdminConversationMessages,
  getAdminChatReports,
  updateAdminChatReport,
} from '../../../services/api/chat.api';

interface ParticipantData {
  name: string;
  userCode?: string;
  photoUrl?: string;
}

interface AdminConversation {
  id: string;
  participants: string[];
  participantsData: Record<string, ParticipantData>;
  lastMessage?: { text: string; senderId: string; type?: string };
  lastMessageTime?: string;
  isBlocked?: boolean;
  blockedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AdminMessage {
  id: string;
  messageId: string;
  senderId: string;
  receiverId: string;
  text: string;
  type: string;
  imageUrl?: string;
  timestamp: string;
  isRead: boolean;
}

interface ChatReport {
  id: number;
  conversationId: string;
  reporterAccountId: string;
  reportedAccountId: string;
  reason: string;
  description?: string;
  status: string;
  adminNotes?: string;
  reviewedBy?: number;
  reviewedAt?: string;
  createdAt: string;
  reporter?: { name: string; userCode: string };
  reported?: { name: string; userCode: string };
}

const ChatLogs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'conversations' | 'reports'>('conversations');
  const [conversations, setConversations] = useState<AdminConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<AdminConversation | null>(null);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [reports, setReports] = useState<ChatReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [reportFilter, setReportFilter] = useState<string>('');
  const [reportPage, setReportPage] = useState(1);
  const [reportTotal, setReportTotal] = useState(0);
  const [editingReport, setEditingReport] = useState<ChatReport | null>(null);
  const [reportForm, setReportForm] = useState({ status: '', adminNotes: '' });

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminConversations({ limit: 50, search: searchQuery || undefined });
      if (data.success) {
        setConversations(data.data.conversations || []);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
    setLoading(false);
  }, [searchQuery]);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminChatReports({
        page: reportPage,
        limit: 20,
        status: reportFilter || undefined,
      });
      if (data.success) {
        setReports(data.data.reports || []);
        setReportTotal(data.data.total || 0);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
    setLoading(false);
  }, [reportPage, reportFilter]);

  useEffect(() => {
    if (activeTab === 'conversations') {
      fetchConversations();
    } else {
      fetchReports();
    }
  }, [activeTab, fetchConversations, fetchReports]);

  const handleSelectConversation = async (conv: AdminConversation) => {
    setSelectedConversation(conv);
    setMessagesLoading(true);
    try {
      const data = await getAdminConversationMessages(conv.id, { limit: 100 });
      if (data.success) {
        setMessages(data.data.messages || []);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
    setMessagesLoading(false);
  };

  const handleUpdateReport = async () => {
    if (!editingReport) return;
    try {
      const data = await updateAdminChatReport(editingReport.id, {
        status: reportForm.status || undefined,
        adminNotes: reportForm.adminNotes || undefined,
      });
      if (data.success) {
        setEditingReport(null);
        fetchReports();
      }
    } catch (err) {
      console.error('Error updating report:', err);
    }
  };

  const getParticipantNames = (conv: AdminConversation) => {
    if (!conv.participantsData) return 'Unknown';
    const names = Object.values(conv.participantsData).map((p) => p.name || 'Unknown');
    return names.join(' & ');
  };

  const getParticipantCodes = (conv: AdminConversation) => {
    if (!conv.participantsData) return '';
    const codes = Object.values(conv.participantsData)
      .map((p) => p.userCode || '')
      .filter(Boolean);
    return codes.join(' & ');
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString();
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'action_taken': return 'bg-red-100 text-red-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Messaging & Chat Logs</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('conversations')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'conversations' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Conversations
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'reports' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Reports ({reportTotal})
          </button>
        </div>
      </div>

      {/* Conversations Tab */}
      {activeTab === 'conversations' && (
        <div className="flex gap-4 h-[calc(100vh-200px)]">
          {/* Conversation List */}
          <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchConversations()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No conversations found</div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedConversation?.id === conv.id ? 'bg-teal-50 border-l-4 border-l-teal-500' : ''}`}
                  >
                    <div className="font-medium text-sm text-gray-900">{getParticipantNames(conv)}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{getParticipantCodes(conv)}</div>
                    <div className="text-xs text-gray-600 mt-1 truncate">
                      {conv.lastMessage?.type === 'image' ? '📷 Image' : conv.lastMessage?.text || 'No messages'}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-gray-400">{formatDate(conv.updatedAt)}</span>
                      {conv.isBlocked && (
                        <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Blocked</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Messages Panel */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Select a conversation to view messages
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                  <div className="font-semibold text-gray-900">{getParticipantNames(selectedConversation)}</div>
                  <div className="text-xs text-gray-500">{getParticipantCodes(selectedConversation)}</div>
                  {selectedConversation.isBlocked && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded mt-1 inline-block">
                      Blocked by {selectedConversation.participantsData?.[selectedConversation.blockedBy || '']?.name || 'Unknown'}
                    </span>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messagesLoading ? (
                    <div className="text-center text-gray-400">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-400">No messages</div>
                  ) : (
                    messages.map((msg) => {
                      const senderName =
                        selectedConversation.participantsData?.[msg.senderId]?.name || 'Unknown';
                      const isFirstParticipant = msg.senderId === selectedConversation.participants?.[0];
                      return (
                        <div key={msg.id} className={`flex ${isFirstParticipant ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[70%] rounded-xl px-4 py-2 ${isFirstParticipant ? 'bg-gray-100' : 'bg-teal-100'}`}>
                            <div className="text-[10px] font-semibold text-gray-600 mb-1">{senderName}</div>
                            {msg.type === 'image' && msg.imageUrl ? (
                              <img src={msg.imageUrl} alt="Chat" className="max-w-[200px] rounded-lg cursor-pointer" onClick={() => window.open(msg.imageUrl, '_blank')} />
                            ) : (
                              <div className="text-sm text-gray-800">{msg.text}</div>
                            )}
                            <div className="text-[10px] text-gray-400 mt-1 text-right">
                              {formatDate(msg.timestamp)}
                              {msg.isRead && ' ✓✓'}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center gap-4">
            <select
              value={reportFilter}
              onChange={(e) => { setReportFilter(e.target.value); setReportPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="action_taken">Action Taken</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 text-xs font-semibold text-gray-600">ID</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-600">Reporter</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-600">Reported</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-600">Reason</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-600">Description</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-600">Status</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-600">Date</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="p-4 text-center text-gray-500">Loading...</td></tr>
                ) : reports.length === 0 ? (
                  <tr><td colSpan={8} className="p-4 text-center text-gray-500">No reports found</td></tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="p-3 text-sm">{report.id}</td>
                      <td className="p-3 text-sm">
                        <div>{report.reporter?.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-400">{report.reporter?.userCode}</div>
                      </td>
                      <td className="p-3 text-sm">
                        <div>{report.reported?.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-400">{report.reported?.userCode}</div>
                      </td>
                      <td className="p-3 text-sm capitalize">{report.reason.replace('_', ' ')}</td>
                      <td className="p-3 text-sm max-w-[150px] truncate">{report.description || '-'}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadgeColor(report.status)}`}>
                          {report.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-gray-500">{formatDate(report.createdAt)}</td>
                      <td className="p-3">
                        <button
                          onClick={() => {
                            setEditingReport(report);
                            setReportForm({ status: report.status, adminNotes: report.adminNotes || '' });
                          }}
                          className="text-xs text-teal-600 hover:text-teal-800 font-medium"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {reportTotal > 20 && (
            <div className="p-4 flex justify-center gap-2">
              <button
                disabled={reportPage === 1}
                onClick={() => setReportPage((p) => p - 1)}
                className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm">Page {reportPage}</span>
              <button
                disabled={reportPage * 20 >= reportTotal}
                onClick={() => setReportPage((p) => p + 1)}
                className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Edit Report Modal */}
      {editingReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Review Report #{editingReport.id}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reporter</label>
                <p className="text-sm text-gray-600">{editingReport.reporter?.name} ({editingReport.reporter?.userCode})</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reported User</label>
                <p className="text-sm text-gray-600">{editingReport.reported?.name} ({editingReport.reported?.userCode})</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <p className="text-sm text-gray-600 capitalize">{editingReport.reason.replace('_', ' ')}</p>
              </div>
              {editingReport.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-sm text-gray-600">{editingReport.description}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={reportForm.status}
                  onChange={(e) => setReportForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="action_taken">Action Taken</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                <textarea
                  value={reportForm.adminNotes}
                  onChange={(e) => setReportForm((f) => ({ ...f, adminNotes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Add notes about this report..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingReport(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateReport}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatLogs;
