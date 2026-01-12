import React, { useState, useEffect } from 'react';
import {
  getSubscriptionTransactions,
  exportSubscriptionTransactions,
  type SubscriptionTransaction,
  type TransactionFilters,
} from '../../../services/api/subscription.api';

const SubscriptionTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<SubscriptionTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, filterStatus, searchTerm]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const adminToken = localStorage.getItem('adminToken');

      const filters: TransactionFilters = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (filterStatus !== 'all') {
        filters.status = filterStatus as 'success' | 'pending' | 'failed';
      }

      if (searchTerm) {
        filters.search = searchTerm;
      }

      const response = await getSubscriptionTransactions(filters, adminToken || undefined);

      if (response.success && response.data) {
        setTransactions(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
          setTotalItems(response.pagination.totalItems);
        }
      } else {
        setError(response.message || 'Failed to fetch transactions');
      }
    } catch (err) {
      setError('Error loading subscription transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');

      const filters: TransactionFilters = {};
      if (filterStatus !== 'all') {
        filters.status = filterStatus as 'success' | 'pending' | 'failed';
      }
      if (searchTerm) {
        filters.search = searchTerm;
      }

      const blob = await exportSubscriptionTransactions(filters, adminToken || undefined);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscription-transactions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error exporting transactions:', err);
      alert('Failed to export transactions. Please try again.');
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleStatusChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  if (loading && transactions.length === 0) {
    return <div className="flex items-center justify-center min-h-[400px] text-lg text-gray-600">Loading transactions...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Subscription Transactions</h1>
        <div>
          <button className="py-2 px-4 bg-[#14b8a6] text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#0d9488] disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleExport} disabled={loading}>
            📥 Export
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-800 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by Payment ID, User Name, or User Code..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Payment ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Plan Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Plan Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Payment Method</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-800">{transaction.paymentId}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex flex-col">
                        <div className="font-medium text-gray-800">{transaction.userName}</div>
                        <div className="text-xs text-gray-500">{transaction.userCode}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-800">₹{transaction.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{transaction.planType}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{transaction.planName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : 'N/A'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{transaction.paymentMethod}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${transaction.status === 'success' ? 'bg-green-100 text-green-800' : transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalItems > 0 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} transactions
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="py-2 px-4 border border-gray-300 bg-white rounded-lg text-sm text-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <div className="flex items-center gap-1">
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
                      disabled={loading}
                      className={`w-10 h-10 flex items-center justify-center border rounded-lg text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${currentPage === pageNum ? 'bg-[#14b8a6] text-white border-[#14b8a6]' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return <span key={pageNum} className="px-2 text-gray-500">...</span>;
                }
                return null;
              })}
            </div>
            <button
              disabled={currentPage >= totalPages || loading}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="py-2 px-4 border border-gray-300 bg-white rounded-lg text-sm text-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionTransactions;


