import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../config/api.config';

interface ReportUser {
  accountId: string;
  name: string;
  userCode: string;
  phone?: string;
  gender?: string;
  isActive?: boolean;
  isFlagged?: boolean;
  reportCount?: number;
}

interface Report {
  id: number;
  reporterAccountId: string;
  reportedAccountId: string;
  reason: string;
  description: string | null;
  status: string;
  adminNotes: string | null;
  actionTaken: string | null;
  reviewedAt: string | null;
  createdAt: string;
  reporter: ReportUser | null;
  reported: ReportUser | null;
}

const statusMap: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pending', bg: 'bg-red-100', text: 'text-red-700' },
  under_review: { label: 'Under Review', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  action_taken: { label: 'Action Taken', bg: 'bg-green-100', text: 'text-green-700' },
  dismissed: { label: 'Dismissed', bg: 'bg-gray-100', text: 'text-gray-700' },
};

const reasonLabels: Record<string, string> = {
  fake_profile: 'Fake Profile',
  harassment: 'Harassment',
  inappropriate: 'Inappropriate',
  scam: 'Scam / Fraud',
  underage: 'Underage',
  spam: 'Spam',
  other: 'Other',
};

const ReportsComplaints: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const itemsPerPage = 10;

  const token = localStorage.getItem('adminToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(currentPage));
      params.set('limit', String(itemsPerPage));
      if (filterStatus !== 'all') params.set('status', filterStatus);

      const res = await fetch(`${API_BASE_URL}/api/admin/reports?${params.toString()}`, { headers });
      const data = await res.json();
      if (data.success) {
        setReports(data.data || []);
        setTotalReports(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [currentPage, filterStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchTerm]);

  const handleStatusChange = async (reportId: number, newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/reports/${reportId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setReports(prev => prev.map(r => (r.id === reportId ? { ...r, status: newStatus } : r)));
        if (selectedReport?.id === reportId) {
          setSelectedReport(prev => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleBanUser = async (report: Report) => {
    if (!window.confirm(`Are you sure you want to ban ${report.reported?.name || 'this user'}?`)) return;
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/reports/${report.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: 'action_taken', actionTaken: 'blocked', adminNotes: adminNotes || 'Banned by admin' }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`${report.reported?.name || 'User'} has been banned.`);
        fetchReports();
      }
    } catch (err) {
      console.error('Error banning user:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedReport) return;
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/reports/${selectedReport.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ adminNotes }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedReport(prev => prev ? { ...prev, adminNotes } : null);
        setReports(prev => prev.map(r => (r.id === selectedReport.id ? { ...r, adminNotes } : r)));
      }
    } catch (err) {
      console.error('Error saving notes:', err);
    } finally {
      setUpdating(false);
    }
  };

  // Client-side search filter
  const filtered = reports.filter(r => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.reported?.name?.toLowerCase().includes(term) ||
      r.reported?.userCode?.toLowerCase().includes(term) ||
      r.reporter?.name?.toLowerCase().includes(term) ||
      r.reason?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(totalReports / itemsPerPage);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px] text-lg text-gray-600">Loading reports...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Reports & Complaints</h1>
        <div className="text-sm text-gray-500">{totalReports} total reports</div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by user name, code, or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="action_taken">Action Taken</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>

      <div className="flex gap-6">
        <div className={`flex-1 ${selectedReport ? 'lg:w-2/3' : 'w-full'}`}>
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
              <p className="text-gray-500 text-lg">No reports found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((report) => {
                const s = statusMap[report.status] || statusMap.pending;
                return (
                  <div
                    key={report.id}
                    className={`bg-white rounded-xl p-6 shadow-sm border-2 cursor-pointer transition-all duration-200 ${
                      selectedReport?.id === report.id
                        ? 'border-[#1B5E20] shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                    onClick={() => { setSelectedReport(report); setAdminNotes(report.adminNotes || ''); }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-800">Report #{report.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>{s.label}</span>
                        {report.reported?.isFlagged && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">Flagged</span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="text-sm">
                        <strong className="text-gray-700">Reported User:</strong>{' '}
                        <span className="text-gray-600">{report.reported?.name || 'Unknown'} ({report.reported?.userCode || '—'})</span>
                        {report.reported?.reportCount ? (
                          <span className="ml-2 text-xs text-red-500 font-medium">{report.reported.reportCount} total reports</span>
                        ) : null}
                      </div>
                      <div className="text-sm">
                        <strong className="text-gray-700">Reported By:</strong>{' '}
                        <span className="text-gray-600">{report.reporter?.name || 'Unknown'} ({report.reporter?.userCode || '—'})</span>
                      </div>
                      <div className="text-sm">
                        <strong className="text-gray-700">Reason:</strong>{' '}
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                          {reasonLabels[report.reason] || report.reason}
                        </span>
                      </div>
                      {report.description && (
                        <div className="text-sm">
                          <strong className="text-gray-700">Description:</strong>{' '}
                          <span className="text-gray-600">{report.description}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={report.status}
                        onChange={(e) => handleStatusChange(report.id, e.target.value)}
                        disabled={updating}
                        className="flex-1 py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent disabled:opacity-50"
                      >
                        <option value="pending">Pending</option>
                        <option value="under_review">Under Review</option>
                        <option value="action_taken">Action Taken</option>
                        <option value="dismissed">Dismissed</option>
                      </select>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleBanUser(report); }}
                        disabled={updating || report.reported?.isActive === false}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-red-700 disabled:opacity-50"
                      >
                        {report.reported?.isActive === false ? 'Already Banned' : 'Ban User'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages} ({totalReports} reports)
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="py-2 px-4 border border-gray-300 bg-white rounded-lg text-sm text-gray-800 cursor-pointer transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="py-2 px-4 border border-gray-300 bg-white rounded-lg text-sm text-gray-800 cursor-pointer transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {selectedReport && (
          <div className="hidden lg:block w-1/3 bg-white rounded-xl shadow-lg border border-gray-200 p-6 h-fit sticky top-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Report Details</h2>
              <button onClick={() => setSelectedReport(null)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                x
              </button>
            </div>
            <div className="space-y-6">
              <div className="space-y-2 text-sm">
                <div><strong>Report ID:</strong> #{selectedReport.id}</div>
                <div>
                  <strong>Status:</strong>{' '}
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${(statusMap[selectedReport.status] || statusMap.pending).bg} ${(statusMap[selectedReport.status] || statusMap.pending).text}`}>
                    {(statusMap[selectedReport.status] || statusMap.pending).label}
                  </span>
                </div>
                <div><strong>Date:</strong> {new Date(selectedReport.createdAt).toLocaleString()}</div>
                <div><strong>Reason:</strong> {reasonLabels[selectedReport.reason] || selectedReport.reason}</div>
                {selectedReport.description && <div><strong>Description:</strong><p className="mt-1 text-gray-600">{selectedReport.description}</p></div>}
                {selectedReport.actionTaken && <div><strong>Action Taken:</strong> {selectedReport.actionTaken}</div>}
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Reported User</h3>
                <div className="text-sm space-y-1">
                  <div><strong>Name:</strong> {selectedReport.reported?.name}</div>
                  <div><strong>Code:</strong> {selectedReport.reported?.userCode}</div>
                  <div><strong>Gender:</strong> {selectedReport.reported?.gender}</div>
                  <div><strong>Reports:</strong> <span className="text-red-600 font-medium">{selectedReport.reported?.reportCount || 0}</span></div>
                  <div><strong>Active:</strong> {selectedReport.reported?.isActive ? 'Yes' : 'No (Banned)'}</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Reporter</h3>
                <div className="text-sm space-y-1">
                  <div><strong>Name:</strong> {selectedReport.reporter?.name}</div>
                  <div><strong>Code:</strong> {selectedReport.reporter?.userCode}</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Admin Notes</h3>
                <textarea
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent"
                  rows={3}
                  placeholder="Add notes about this report..."
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={updating}
                  className="mt-2 w-full py-2 bg-[#1B5E20] text-white rounded-lg text-sm font-medium hover:bg-[#0D3B13] disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save Notes'}
                </button>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleBanUser(selectedReport)}
                  disabled={updating || selectedReport.reported?.isActive === false}
                  className="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors hover:bg-red-700 disabled:opacity-50"
                >
                  {selectedReport.reported?.isActive === false ? 'Already Banned' : 'Ban Reported User'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsComplaints;
