import React, { useState, useEffect, useCallback } from 'react';
import { getApiUrl, API_ENDPOINTS } from '../../../config/api.config';

/* ── Types ───────────────────────────────────────────────── */
interface HistoryItem {
  id: number;
  title: string;
  message: string;
  imageUrl: string | null;
  sentAt: string;
  recipientCount: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface NotifStats {
  totalUsers: number;
  totalDeviceTokens: number;
  validDeviceTokens: number;
  placeholderTokens: number;
  mobileTokens: number;
  webTokens: number;
}

/* ── Component ───────────────────────────────────────────── */
const NotificationManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'push' | 'history' | 'stats'>('push');

  /* ── Send form state ─── */
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    target: 'all',
    imageUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  /* ── History state ─── */
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [historyLoading, setHistoryLoading] = useState(false);

  /* ── Stats state ─── */
  const [stats, setStats] = useState<NotifStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const adminToken = localStorage.getItem('adminToken');

  /* ────────────────────────────────────────────────────────
     Send Push Notification
  ──────────────────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      setSubmitMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      if (!adminToken) {
        setSubmitMessage({ type: 'error', text: 'Admin authentication required' });
        setIsSubmitting(false);
        return;
      }

      const payload: Record<string, string> = {
        title: formData.title,
        message: formData.message,
        target: formData.target,
      };
      if (formData.imageUrl.trim()) {
        payload.imageUrl = formData.imageUrl.trim();
      }

      const response = await fetch(getApiUrl(API_ENDPOINTS.ADMIN.SEND_PUSH_NOTIFICATION), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        setSubmitMessage({ type: 'error', text: `Server error: ${response.status} ${response.statusText}` });
        setIsSubmitting(false);
        return;
      }

      if (response.ok && data.success) {
        setSubmitMessage({
          type: 'success',
          text: data.message || `Notification sent to ${data.data?.sentCount || 0} users successfully!`,
        });
        setFormData({ title: '', message: '', target: 'all', imageUrl: '' });
        setTimeout(() => setSubmitMessage(null), 5000);
        // Refresh history
        if (activeTab === 'history') fetchHistory(1);
      } else {
        setSubmitMessage({ type: 'error', text: data.message || `Failed (${response.status})` });
      }
    } catch (error: any) {
      setSubmitMessage({ type: 'error', text: error.message || 'An error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ────────────────────────────────────────────────────────
     Fetch Notification History
  ──────────────────────────────────────────────────────── */
  const fetchHistory = useCallback(
    async (page = 1) => {
      if (!adminToken) return;
      setHistoryLoading(true);
      try {
        const url = getApiUrl(API_ENDPOINTS.ADMIN.NOTIFICATION_HISTORY) + `?page=${page}&limit=20`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        const data = await res.json();
        if (data.success) {
          setHistory(data.data.notifications);
          setPagination(data.data.pagination);
        }
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setHistoryLoading(false);
      }
    },
    [adminToken],
  );

  /* ────────────────────────────────────────────────────────
     Fetch Stats
  ──────────────────────────────────────────────────────── */
  const fetchStats = useCallback(async () => {
    if (!adminToken) return;
    setStatsLoading(true);
    try {
      const url = getApiUrl(API_ENDPOINTS.ADMIN.NOTIFICATION_STATS);
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, [adminToken]);

  /* ── Auto-fetch on tab change ─── */
  useEffect(() => {
    if (activeTab === 'history') fetchHistory(1);
    if (activeTab === 'stats') fetchStats();
  }, [activeTab, fetchHistory, fetchStats]);

  /* ── Helpers ─── */
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  /* ────────────────────────────────────────────────────────
     Render
  ──────────────────────────────────────────────────────── */
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Notification Management</h1>
      </div>

      {/* ── Tabs ─── */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: 'push' as const, label: 'Send Notification', icon: '📤' },
          { key: 'history' as const, label: 'Sent History', icon: '📋' },
          { key: 'stats' as const, label: 'Stats', icon: '📊' },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-[#14b8a6] text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* ════════════════════════════════════════════════════
           TAB: Send Push Notification
        ════════════════════════════════════════════════════ */}
        {activeTab === 'push' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Send Push Notification</h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Notification title"
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={4}
                  placeholder="Notification message body"
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (optional)</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Provide a public image URL to display a rich image in the push notification.
                </p>
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="h-24 rounded-lg border border-gray-200 object-cover"
                      onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                      onLoad={(e) => ((e.target as HTMLImageElement).style.display = 'block')}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                <select
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                >
                  <option value="all">All Users</option>
                  <option value="premium">Premium Users</option>
                  <option value="active">Active Users (last 30 days)</option>
                </select>
              </div>

              {submitMessage && (
                <div
                  className={`p-4 rounded-lg ${
                    submitMessage.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {submitMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 py-2.5 px-6 bg-[#14b8a6] text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#0d9488] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Notification'}
              </button>
            </form>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
           TAB: Notification History
        ════════════════════════════════════════════════════ */}
        {activeTab === 'history' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Sent Notification History</h2>
              <button
                onClick={() => fetchHistory(pagination.page)}
                disabled={historyLoading}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {historyLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {historyLoading && history.length === 0 ? (
              <div className="text-center py-12 text-gray-500">Loading notification history...</div>
            ) : history.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-3">📭</div>
                <p className="font-medium">No notifications sent yet</p>
                <p className="text-sm mt-1">Sent notifications will appear here.</p>
              </div>
            ) : (
              <>
                {/* ── Table ─── */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Title</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Message</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Image</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-600">Recipients</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Sent At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 font-medium text-gray-800 max-w-[200px]">
                            <div className="truncate" title={item.title}>
                              {item.title}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600 max-w-[300px]">
                            <div className="truncate" title={item.message}>
                              {item.message}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt=""
                                className="h-10 w-10 rounded object-cover border border-gray-200"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                              {item.recipientCount} users
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                            {formatDate(item.sentAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ── Pagination ─── */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-500">
                      Page {pagination.page} of {pagination.totalPages} ({pagination.total} total records)
                    </span>
                    <div className="flex gap-2">
                      <button
                        disabled={pagination.page <= 1}
                        onClick={() => fetchHistory(pagination.page - 1)}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      <button
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() => fetchHistory(pagination.page + 1)}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════
           TAB: Stats
        ════════════════════════════════════════════════════ */}
        {activeTab === 'stats' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Notification Stats</h2>
              <button
                onClick={fetchStats}
                disabled={statsLoading}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {statsLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {statsLoading && !stats ? (
              <div className="text-center py-12 text-gray-500">Loading stats...</div>
            ) : stats ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Total Active Users', value: stats.totalUsers, color: 'bg-blue-50 text-blue-700' },
                  { label: 'Total Device Tokens', value: stats.totalDeviceTokens, color: 'bg-purple-50 text-purple-700' },
                  { label: 'Valid Tokens', value: stats.validDeviceTokens, color: 'bg-green-50 text-green-700' },
                  { label: 'Placeholder Tokens', value: stats.placeholderTokens, color: 'bg-yellow-50 text-yellow-700' },
                  { label: 'Mobile Tokens', value: stats.mobileTokens, color: 'bg-indigo-50 text-indigo-700' },
                  { label: 'Web Tokens', value: stats.webTokens, color: 'bg-teal-50 text-teal-700' },
                ].map((s) => (
                  <div key={s.label} className={`rounded-xl p-5 ${s.color}`}>
                    <p className="text-sm font-medium opacity-80">{s.label}</p>
                    <p className="text-3xl font-bold mt-1">{s.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">Failed to load stats.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationManagement;
