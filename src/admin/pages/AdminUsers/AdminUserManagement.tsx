import React, { useState, useEffect } from 'react';
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  toggleAdminStatus,
  type AdminUser,
  type CreateAdminUserPayload,
  type UpdateAdminUserPayload,
} from '../../../services/api/adminUser.api';

const AdminUserManagement: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const itemsPerPage = 20;

  const [formData, setFormData] = useState<CreateAdminUserPayload>({
    name: '',
    email: '',
    password: '',
    role: 'Moderator',
    status: 'active',
  });

  // Fetch admins on component mount and when filters change
  useEffect(() => {
    fetchAdmins();
  }, [currentPage, filterStatus, filterRole, searchTerm]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const adminToken = localStorage.getItem('adminToken');

      const filters: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (filterStatus !== 'all') {
        filters.status = filterStatus;
      }

      if (filterRole !== 'all') {
        filters.role = filterRole;
      }

      if (searchTerm) {
        filters.search = searchTerm;
      }

      const response = await getAdminUsers(filters, adminToken || undefined);

      if (response.success && response.data) {
        setAdmins(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
          setTotalItems(response.pagination.totalItems);
        }
      } else {
        setError(response.message || 'Failed to fetch admin users');
      }
    } catch (err) {
      setError('Error loading admin users');
      console.error('Error fetching admins:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password
    if (!editingAdmin && formData.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      setError(null);
      const adminToken = localStorage.getItem('adminToken');

      if (editingAdmin) {
        // Update existing admin
        const updatePayload: UpdateAdminUserPayload = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status,
        };

        // Only include password if it's provided
        if (formData.password) {
          updatePayload.password = formData.password;
        }

        const response = await updateAdminUser(editingAdmin.id, updatePayload, adminToken || undefined);

        if (response.success && response.data) {
          await fetchAdmins(); // Refresh list
          setEditingAdmin(null);
          setShowAddForm(false);
          resetForm();
        } else {
          const errorMsg = response.message || 'Failed to update admin user';
          setError(errorMsg);
          alert(errorMsg);
        }
      } else {
        // Create new admin
        const response = await createAdminUser(formData, adminToken || undefined);

        if (response.success && response.data) {
          await fetchAdmins(); // Refresh list
          setShowAddForm(false);
          resetForm();
        } else {
          const errorMsg = response.message || 'Failed to create admin user';
          setError(errorMsg);
          alert(errorMsg);
        }
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Error saving admin user';
      setError(errorMsg);
      console.error('Error saving admin:', err);
      alert(errorMsg);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'Moderator',
      status: 'active',
    });
  };

  const handleEdit = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '', // Don't pre-fill password
      role: admin.role,
      status: admin.status,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this admin user?')) {
      try {
        setError(null);
        const adminToken = localStorage.getItem('adminToken');
        const response = await deleteAdminUser(id, adminToken || undefined);

        if (response.success) {
          await fetchAdmins(); // Refresh list
        } else {
          const errorMsg = response.message || 'Failed to delete admin user';
          setError(errorMsg);
          alert(errorMsg);
        }
      } catch (err) {
        setError('Error deleting admin user');
        console.error('Error deleting admin:', err);
        alert('Failed to delete admin user. Please try again.');
      }
    }
  };

  const handleStatusToggle = async (id: number, currentStatus: 'active' | 'inactive') => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const confirmMessage = `Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} this admin user?`;

    if (window.confirm(confirmMessage)) {
      try {
        setError(null);
        const adminToken = localStorage.getItem('adminToken');
        const response = await toggleAdminStatus(id, newStatus, adminToken || undefined);

        if (response.success) {
          await fetchAdmins(); // Refresh list
        } else {
          const errorMsg = response.message || 'Failed to update admin status';
          setError(errorMsg);
          alert(errorMsg);
        }
      } catch (err) {
        setError('Error updating admin status');
        console.error('Error updating status:', err);
        alert('Failed to update admin status. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingAdmin(null);
    resetForm();
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleStatusFilterChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleRoleFilterChange = (value: string) => {
    setFilterRole(value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  if (loading && admins.length === 0) {
    return <div className="flex items-center justify-center min-h-[400px] text-lg text-gray-600">Loading admin users...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin User Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm}
          className="flex items-center gap-2 py-2 px-4 bg-[#14b8a6] text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#0d9488] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Create Admin
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => handleStatusFilterChange(e.target.value)}
          className="py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={filterRole}
          onChange={(e) => handleRoleFilterChange(e.target.value)}
          className="py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
        >
          <option value="all">All Roles</option>
          <option value="Super Admin">Super Admin</option>
          <option value="Moderator">Moderator</option>
          <option value="Customer Support">Customer Support</option>
        </select>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">{editingAdmin ? 'Edit Admin User' : 'Create New Admin'}</h2>
              <button
                onClick={handleCancel}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password {editingAdmin ? '(leave blank to keep current)' : '*'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  minLength={6}
                  required={!editingAdmin}
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                />
                {editingAdmin && (
                  <small className="block mt-1 text-xs text-gray-500">Leave blank to keep current password</small>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminUser['role'] })}
                  required
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Moderator">Moderator</option>
                  <option value="Customer Support">Customer Support</option>
                </select>
              </div>
              {editingAdmin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    required
                    className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-2.5 px-4 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium cursor-pointer transition-colors duration-200 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-[#14b8a6] text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#0d9488]"
                >
                  {editingAdmin ? 'Update Admin' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No admins found
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{admin.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{admin.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          admin.role === 'Super Admin'
                            ? 'bg-purple-100 text-purple-700'
                            : admin.role === 'Moderator'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusToggle(admin.id, admin.status)}
                        className="cursor-pointer"
                        title={`Click to ${admin.status === 'active' ? 'deactivate' : 'activate'}`}
                      >
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            admin.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {admin.status}
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{admin.lastLogin}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{admin.createdAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(admin)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(admin.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalItems > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} admins
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1 || loading}
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
                      disabled={loading}
                      className={`w-9 h-9 border rounded-lg text-sm flex items-center justify-center transition-all duration-200 ${
                        currentPage === pageNum
                          ? 'bg-[#14b8a6] text-white border-[#14b8a6]'
                          : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50 hover:border-gray-400'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
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
              disabled={currentPage >= totalPages || loading}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="py-2 px-4 border border-gray-300 bg-white rounded-lg text-sm text-gray-800 cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Activity Logs</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0">
            <div className="text-sm text-gray-700">
              <strong>Admin User</strong> edited user profile <strong>NN#00001</strong>
            </div>
            <div className="text-xs text-gray-500">2024-09-23 10:30 AM</div>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0">
            <div className="text-sm text-gray-700">
              <strong>Admin User</strong> deleted photo from <strong>NN#00002</strong>
            </div>
            <div className="text-xs text-gray-500">2024-09-23 09:15 AM</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;

