import React, { useState, useEffect } from 'react';
import {
  getAdminSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  type SubscriptionPlan,
  type CreatePlanPayload,
} from '../../../services/api/subscription.api';

const SubscriptionPlans: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState<CreatePlanPayload>({
    planType: 'months',
    planName: '',
    category: 'Both',
    amount: 0,
    offerAmount: 0,
    maxProfile: 0,
    contactNoView: 0,
    validMonth: 1,
    status: 'active',
  });

  // Fetch plans on component mount
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const adminToken = localStorage.getItem('adminToken');
      
      if (!adminToken) {
        setError('No authentication token found. Please login again.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        setLoading(false);
        return;
      }

      const response = await getAdminSubscriptionPlans(undefined, adminToken);

      if (response.message && (response.message.includes('Token is not valid') || response.message.includes('authorization denied') || response.message.includes('No token'))) {
        setError('Your session has expired. Please login again.');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('adminInfo');
        localStorage.removeItem('adminRole');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        setLoading(false);
        return;
      }

      if (response.success && response.data) {
        setPlans(response.data);
      } else {
        setError(response.message || 'Failed to fetch plans');
      }
    } catch (err: any) {
      console.error('Error fetching plans:', err);
      if (err.message && (err.message.includes('Token is not valid') || err.message.includes('authorization denied'))) {
        setError('Your session has expired. Please login again.');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('adminInfo');
        localStorage.removeItem('adminRole');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setError(err.message || 'Error loading subscription plans');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'planType' ? value : name.includes('Amount') || name.includes('Profile') || name.includes('View') || name === 'validMonth' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate offer amount
    if (formData.offerAmount > formData.amount) {
      alert('Offer amount cannot be greater than original amount');
      return;
    }

    try {
      setError(null);
      const adminToken = localStorage.getItem('adminToken');

      if (!adminToken) {
        setError('No authentication token found. Please login again.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      if (editingPlan) {
        // Update existing plan
        const response = await updateSubscriptionPlan(editingPlan.id, formData, adminToken);

        if (response.message && (response.message.includes('Token is not valid') || response.message.includes('authorization denied'))) {
          setError('Your session has expired. Please login again.');
          localStorage.removeItem('adminToken');
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('adminInfo');
          localStorage.removeItem('adminRole');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }

        if (response.success && response.data) {
          await fetchPlans(); // Refresh list
          setEditingPlan(null);
          setShowAddForm(false);
          resetForm();
          alert('Plan updated successfully!');
        } else {
          const errorMsg = response.message || 'Failed to update plan';
          setError(errorMsg);
          alert(errorMsg);
        }
      } else {
        // Create new plan
        const response = await createSubscriptionPlan(formData, adminToken);

        if (response.message && (response.message.includes('Token is not valid') || response.message.includes('authorization denied'))) {
          setError('Your session has expired. Please login again.');
          localStorage.removeItem('adminToken');
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('adminInfo');
          localStorage.removeItem('adminRole');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }

        if (response.success && response.data) {
          await fetchPlans(); // Refresh list
          setShowAddForm(false);
          resetForm();
          alert('Plan created successfully!');
        } else {
          const errorMsg = response.message || 'Failed to create plan';
          setError(errorMsg);
          alert(errorMsg);
        }
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Error saving subscription plan';
      setError(errorMsg);
      console.error('Error saving plan:', err);
      alert(errorMsg);
    }
  };

  const resetForm = () => {
    setFormData({
      planType: 'months',
      planName: '',
      category: 'Both',
      amount: 0,
      offerAmount: 0,
      maxProfile: 0,
      contactNoView: 0,
      validMonth: 1,
      status: 'active',
    });
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      planType: plan.planType,
      planName: plan.planName,
      category: plan.category,
      amount: plan.amount,
      offerAmount: plan.offerAmount,
      maxProfile: plan.maxProfile,
      contactNoView: plan.contactNoView,
      validMonth: plan.validMonth,
      status: plan.status || 'active',
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      try {
        setError(null);
        const adminToken = localStorage.getItem('adminToken');
        
        if (!adminToken) {
          setError('No authentication token found. Please login again.');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }

        const response = await deleteSubscriptionPlan(id, adminToken);

        if (response.message && (response.message.includes('Token is not valid') || response.message.includes('authorization denied'))) {
          setError('Your session has expired. Please login again.');
          localStorage.removeItem('adminToken');
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('adminInfo');
          localStorage.removeItem('adminRole');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }

        if (response.success) {
          await fetchPlans(); // Refresh list
          alert('Plan deleted successfully!');
        } else {
          const errorMsg = response.message || 'Failed to delete plan';
          setError(errorMsg);
          alert(errorMsg);
        }
      } catch (err: any) {
        console.error('Error deleting plan:', err);
        if (err.message && (err.message.includes('Token is not valid') || err.message.includes('authorization denied'))) {
          setError('Your session has expired. Please login again.');
          localStorage.removeItem('adminToken');
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('adminInfo');
          localStorage.removeItem('adminRole');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          setError(err.message || 'Error deleting subscription plan');
          alert(err.message || 'Failed to delete plan. Please try again.');
        }
      }
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingPlan(null);
    resetForm();
  };

  const calculateDiscount = (amount: number, offerAmount: number) => {
    if (amount === 0) return 0;
    return Math.round(((amount - offerAmount) / amount) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading subscription plans...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={showAddForm}
            >
              + Add New Plan
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-700 hover:text-red-900 font-bold text-lg"
              >
                ×
              </button>
            </div>
          )}

          {showAddForm && (
            <div className="mb-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{editingPlan ? 'Edit Plan' : 'Add New Plan'}</h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan Type *
                    </label>
                    <select
                      name="planType"
                      value={formData.planType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="months">Months</option>
                      <option value="year">Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan Name *
                    </label>
                    <input
                      type="text"
                      name="planName"
                      value={formData.planName}
                      onChange={handleInputChange}
                      placeholder="e.g., Basic Plan"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Both">Both</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount (₹) *
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Offer Amount (₹) *
                    </label>
                    <input
                      type="number"
                      name="offerAmount"
                      value={formData.offerAmount}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {formData.amount > 0 && formData.offerAmount > 0 && (
                  <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
                    {calculateDiscount(formData.amount, formData.offerAmount)}% OFF
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Profile *
                    </label>
                    <input
                      type="number"
                      name="maxProfile"
                      value={formData.maxProfile}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact No View *
                    </label>
                    <input
                      type="number"
                      name="contactNoView"
                      value={formData.contactNoView}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valid Month *
                    </label>
                    <input
                      type="number"
                      name="validMonth"
                      value={formData.validMonth}
                      onChange={handleInputChange}
                      placeholder="1"
                      min="1"
                      max={formData.planType === 'year' ? 12 : 12}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="text-xs text-gray-500 mt-1 block">
                      {formData.planType === 'year' ? 'Months in a year (1-12)' : 'Number of months (1-12)'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {editingPlan ? 'Update Plan' : 'Create Plan'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Offer Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max Profile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valid Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {plans.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-12 text-center text-gray-500">
                      No plans found. Click "Add New Plan" to create one.
                    </td>
                  </tr>
                ) : (
                  plans.map(plan => (
                    <tr key={plan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          plan.planType === 'year' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {plan.planType === 'year' ? '📅 Year' : '📆 Months'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{plan.planName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          plan.category === 'Both' ? 'bg-gray-100 text-gray-800' :
                          plan.category === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                        }`}>
                          {plan.category === 'Both' ? '👥 Both' : plan.category === 'Male' ? '👨 Male' : '👩 Female'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 line-through">₹{plan.amount.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">₹{plan.offerAmount.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {calculateDiscount(plan.amount, plan.offerAmount)}% OFF
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {plan.maxProfile}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {plan.contactNoView}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {plan.validMonth} {plan.validMonth === 1 ? 'month' : 'months'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {plan.createdAt ? new Date(plan.createdAt).toISOString().split('T')[0] : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(plan)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(plan.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
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
      </div>
    </div>
  );
};

export default SubscriptionPlans;


