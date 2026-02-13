import React, { useState, useEffect } from 'react';
import {
  getAdminCoupons,
  createAdminCoupon,
  updateAdminCoupon,
  deleteAdminCoupon,
  getAdminCouponUsage,
  getAdminSubscriptionPlans,
  type SubscriptionPlan,
} from '../../../services/api/subscription.api';

interface Coupon {
  id: number;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscount: number | null;
  minOrderAmount: number;
  maxUses: number | null;
  maxUsesPerUser: number;
  usedCount: number;
  applicablePlans: string | null;
  validFrom: string | null;
  validUntil: string | null;
  status: 'active' | 'inactive' | 'expired';
  createdAt: string;
}

interface CouponUsage {
  id: number;
  userId: number;
  discountAmount: number;
  createdAt: string;
  user?: { name: string; userCode: string };
}

const defaultForm = {
  code: '',
  description: '',
  discountType: 'percentage' as 'percentage' | 'fixed',
  discountValue: 0,
  maxDiscount: '',
  minOrderAmount: 0,
  maxUses: '',
  maxUsesPerUser: 1,
  applicablePlans: '' as string,
  validFrom: '',
  validUntil: '',
  status: 'active' as 'active' | 'inactive',
};

const CouponManagement: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState(defaultForm);
  const [usageModal, setUsageModal] = useState<{ couponId: number; code: string } | null>(null);
  const [usageData, setUsageData] = useState<CouponUsage[]>([]);
  const [usageLoading, setUsageLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const getToken = () => localStorage.getItem('adminToken') || '';

  useEffect(() => {
    fetchCoupons();
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await getAdminSubscriptionPlans(undefined, getToken());
      if (res.success) setPlans(res.data);
    } catch { /* silent */ }
  };

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminCoupons(getToken());
      if (res.success) {
        setCoupons(res.data || []);
      } else {
        setError(res.message || 'Failed to fetch coupons');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload: any = {
      ...formData,
      discountValue: Number(formData.discountValue),
      minOrderAmount: Number(formData.minOrderAmount),
      maxUsesPerUser: Number(formData.maxUsesPerUser),
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
      maxUses: formData.maxUses ? Number(formData.maxUses) : null,
      validFrom: formData.validFrom || null,
      validUntil: formData.validUntil || null,
      applicablePlans: formData.applicablePlans || null,
    };

    try {
      let res;
      if (editingCoupon) {
        res = await updateAdminCoupon(editingCoupon.id, payload, getToken());
      } else {
        res = await createAdminCoupon(payload, getToken());
      }

      if (res.success) {
        setSuccess(editingCoupon ? 'Coupon updated successfully' : 'Coupon created successfully');
        setShowForm(false);
        setEditingCoupon(null);
        setFormData(defaultForm);
        fetchCoupons();
      } else {
        setError(res.message || 'Operation failed');
      }
    } catch (err: any) {
      setError(err.message || 'Error saving coupon');
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount !== null ? String(coupon.maxDiscount) : '',
      minOrderAmount: coupon.minOrderAmount,
      maxUses: coupon.maxUses !== null ? String(coupon.maxUses) : '',
      maxUsesPerUser: coupon.maxUsesPerUser,
      applicablePlans: coupon.applicablePlans || '',
      validFrom: coupon.validFrom ? coupon.validFrom.split('T')[0] : '',
      validUntil: coupon.validUntil ? coupon.validUntil.split('T')[0] : '',
      status: coupon.status as any,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteAdminCoupon(id, getToken());
      if (res.success) {
        setSuccess('Coupon deleted');
        setDeleteConfirm(null);
        fetchCoupons();
      } else {
        setError(res.message || 'Failed to delete coupon');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openUsage = async (couponId: number, code: string) => {
    setUsageModal({ couponId, code });
    setUsageLoading(true);
    try {
      const res = await getAdminCouponUsage(couponId, getToken());
      if (res.success) setUsageData(res.data || []);
    } catch { /* silent */ }
    setUsageLoading(false);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCoupon(null);
    setFormData(defaultForm);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupon Management</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage discount coupons</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Create Coupon
        </button>
      </div>

      {/* Messages */}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-bold mb-4">{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="e.g. WELCOME20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Get 20% off on premium plans"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount Cap</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    min="0"
                    placeholder="No cap"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Amount</label>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Total Uses</label>
                  <input
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    min="0"
                    placeholder="Unlimited"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Per User Limit</label>
                  <input
                    type="number"
                    value={formData.maxUsesPerUser}
                    onChange={(e) => setFormData({ ...formData, maxUsesPerUser: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Applicable Plan IDs (comma-separated, leave empty for all)</label>
                <input
                  type="text"
                  value={formData.applicablePlans}
                  onChange={(e) => setFormData({ ...formData, applicablePlans: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="e.g. 1,2,3 or leave empty"
                />
                {plans.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    Available plans: {plans.map(p => `${p.id} (${p.planName})`).join(', ')}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm text-white bg-teal-500 rounded-lg hover:bg-teal-600 font-medium">
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Usage Modal */}
      {usageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Usage History: {usageModal.code}</h2>
              <button onClick={() => setUsageModal(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            {usageLoading ? (
              <p className="text-gray-500 text-sm">Loading...</p>
            ) : usageData.length === 0 ? (
              <p className="text-gray-500 text-sm">No usage records found</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-gray-600">User</th>
                    <th className="text-left py-2 text-gray-600">Discount</th>
                    <th className="text-left py-2 text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {usageData.map((u) => (
                    <tr key={u.id} className="border-b">
                      <td className="py-2">{u.user?.name || `User #${u.userId}`}</td>
                      <td className="py-2 font-medium text-green-600">Rs. {u.discountAmount}</td>
                      <td className="py-2 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Delete Coupon?</h3>
            <p className="text-sm text-gray-600 mb-4">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg mb-2">No coupons found</p>
            <p className="text-sm">Click "Create Coupon" to add your first one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Code</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Discount</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Usage</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Validity</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-teal-700">{coupon.code}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{coupon.description}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium">
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `Rs. ${coupon.discountValue}`}
                      </span>
                      {coupon.maxDiscount && <span className="text-xs text-gray-500 ml-1">(max Rs. {coupon.maxDiscount})</span>}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium">{coupon.usedCount}</span>
                      <span className="text-gray-500">/{coupon.maxUses || 'Unlimited'}</span>
                      <button
                        onClick={() => openUsage(coupon.id, coupon.code)}
                        className="ml-2 text-xs text-teal-600 hover:underline"
                      >
                        View
                      </button>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500">
                      {coupon.validFrom ? new Date(coupon.validFrom).toLocaleDateString() : 'Any'} -{' '}
                      {coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString() : 'No expiry'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        coupon.status === 'active' ? 'bg-green-100 text-green-700' :
                        coupon.status === 'expired' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {coupon.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => handleEdit(coupon)} className="text-blue-600 hover:text-blue-800 text-xs mr-3">Edit</button>
                      <button onClick={() => setDeleteConfirm(coupon.id)} className="text-red-600 hover:text-red-800 text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponManagement;
