import React, { useState, useEffect } from 'react';

interface Report {
  id: number;
  reportedUserId: number;
  reportedUserName: string;
  reportedUserCode: string;
  reportedByUserId: number;
  reportedByName: string;
  reason: 'Chat abuse' | 'Fake profile' | 'Wrong info' | 'Inappropriate content' | 'Other';
  description: string;
  reportedDate: string;
  status: 'Open' | 'In Review' | 'Resolved';
}

const ReportsComplaints: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        setTimeout(() => {
          setReports([
            {
              id: 1,
              reportedUserId: 10,
              reportedUserName: 'John Doe',
              reportedUserCode: 'NN#00010',
              reportedByUserId: 1,
              reportedByName: 'Sundararajan',
              reason: 'Fake profile',
              description: 'User is using fake photos and information',
              reportedDate: '2024-09-23',
              status: 'Open',
            },
            {
              id: 2,
              reportedUserId: 11,
              reportedUserName: 'Jane Smith',
              reportedUserCode: 'NN#00011',
              reportedByUserId: 2,
              reportedByName: 'Kalaivani',
              reason: 'Chat abuse',
              description: 'User sent inappropriate messages',
              reportedDate: '2024-09-22',
              status: 'In Review',
            },
          ]);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleStatusChange = (reportId: number, newStatus: string) => {
    setReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, status: newStatus as Report['status'] } : r))
    );
    // TODO: Implement API call
  };

  const handleBanUser = (userId: number, userName: string) => {
    if (window.confirm(`Are you sure you want to ban ${userName}?`)) {
      // TODO: Implement ban API call
      console.log('Ban user:', userId);
      alert(`${userName} has been banned.`);
    }
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch =
      r.reportedUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reportedUserCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reportedByName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchTerm]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, endIndex);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px] text-lg text-gray-600">Loading reports...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Reports & Complaints</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 py-2 px-4 bg-[#14b8a6] text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#0d9488]">
            <span>📥</span> Export
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by user name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="Open">Open</option>
          <option value="In Review">In Review</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <div className="flex gap-6">
        <div className={`flex-1 ${selectedReport ? 'lg:w-2/3' : 'w-full'}`}>
          {paginatedReports.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
              <p className="text-gray-500 text-lg">No reports found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedReports.map((report) => (
                <div
                  key={report.id}
                  className={`bg-white rounded-xl p-6 shadow-sm border-2 cursor-pointer transition-all duration-200 ${
                    selectedReport?.id === report.id
                      ? 'border-[#14b8a6] shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-800">Report #{report.id}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          report.status === 'Open'
                            ? 'bg-red-100 text-red-700'
                            : report.status === 'In Review'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{report.reportedDate}</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="text-sm">
                      <strong className="text-gray-700">Reported User:</strong>{' '}
                      <span className="text-gray-600">{report.reportedUserName} ({report.reportedUserCode})</span>
                    </div>
                    <div className="text-sm">
                      <strong className="text-gray-700">Reported By:</strong>{' '}
                      <span className="text-gray-600">{report.reportedByName}</span>
                    </div>
                    <div className="text-sm">
                      <strong className="text-gray-700">Reason:</strong>{' '}
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                        {report.reason}
                      </span>
                    </div>
                    <div className="text-sm">
                      <strong className="text-gray-700">Description:</strong>{' '}
                      <span className="text-gray-600">{report.description}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={report.status}
                      onChange={(e) => handleStatusChange(report.id, e.target.value)}
                      className="flex-1 py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                    >
                      <option value="Open">Open</option>
                      <option value="In Review">In Review</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBanUser(report.reportedUserId, report.reportedUserName);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-red-700"
                    >
                      🚫 Ban User
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredReports.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredReports.length)} of {filteredReports.length} reports
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="py-2 px-4 border border-gray-300 bg-white rounded-lg text-sm text-gray-800 cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-9 h-9 border rounded-lg text-sm flex items-center justify-center transition-all duration-200 ${
                            currentPage === pageNum
                              ? 'bg-[#14b8a6] text-white border-[#14b8a6]'
                              : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50 hover:border-gray-400'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return <span key={pageNum} className="px-2 text-gray-500 text-sm">...</span>;
                    }
                    return null;
                  })}
                </div>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="py-2 px-4 border border-gray-300 bg-white rounded-lg text-sm text-gray-800 cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

        {selectedReport && (
          <div className="hidden lg:block w-1/3 bg-white rounded-xl shadow-lg border border-gray-200 p-6 h-fit sticky top-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Report Details</h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                ×
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Report Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong className="text-gray-700">Report ID:</strong> <span className="text-gray-600">#{selectedReport.id}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Status:</strong>{' '}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        selectedReport.status === 'Open'
                          ? 'bg-red-100 text-red-700'
                          : selectedReport.status === 'In Review'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {selectedReport.status}
                    </span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Reported Date:</strong> <span className="text-gray-600">{selectedReport.reportedDate}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Reason:</strong>{' '}
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      {selectedReport.reason}
                    </span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Description:</strong>
                    <p className="text-gray-600 mt-1">{selectedReport.description}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Reported User</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong className="text-gray-700">Name:</strong> <span className="text-gray-600">{selectedReport.reportedUserName}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700">User Code:</strong> <span className="text-gray-600">{selectedReport.reportedUserCode}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Reported By</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong className="text-gray-700">Name:</strong> <span className="text-gray-600">{selectedReport.reportedByName}</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleBanUser(selectedReport.reportedUserId, selectedReport.reportedUserName)}
                  className="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-200 hover:bg-red-700"
                >
                  🚫 Ban Reported User
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

