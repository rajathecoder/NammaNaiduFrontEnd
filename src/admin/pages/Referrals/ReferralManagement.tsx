import React, { useState, useEffect } from 'react';
import {
  getAdminReferrals,
  getAdminReferralStats,
  getAdminSettings,
  updateAdminSettings,
} from '../../../services/api/subscription.api';

interface ReferralStats {
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  rewardedReferrals: number;
  totalReferrerRewards: number;
  totalReferredRewards: number;
  topReferrers: Array<{
    id: number;
    name: string;
    userCode: string;
    referralCode: string;
    totalReferrals: number;
    totalRewards: number;
  }>;
}

interface Referral {
  id: number;
  referrerId: number;
  referredId: number;
  status: string;
  referrerReward: number;
  referredReward: number;
  rewardedAt: string | null;
  createdAt: string;
  referrer?: { name: string; userCode: string };
  referred?: { name: string; userCode: string };
}

const ReferralManagement: React.FC = () => {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [referrerReward, setReferrerReward] = useState('3');
  const [referredReward, setReferredReward] = useState('2');
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'all'>('overview');

  const getToken = () => localStorage.getItem('adminToken') || '';

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, referralsRes, settingsRes] = await Promise.all([
        getAdminReferralStats(getToken()),
        getAdminReferrals(getToken()),
        getAdminSettings(getToken()),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (referralsRes.success) setReferrals(referralsRes.data || []);
      if (settingsRes.success && settingsRes.data) {
        if (settingsRes.data.referral_referrer_reward) setReferrerReward(settingsRes.data.referral_referrer_reward);
        if (settingsRes.data.referral_referred_reward) setReferredReward(settingsRes.data.referral_referred_reward);
      }
    } catch (err: any) {
      setError(err.message || 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await updateAdminSettings(
        {
          referral_referrer_reward: referrerReward,
          referral_referred_reward: referredReward,
        },
        getToken()
      );
      if (res.success) {
        setSuccess('Referral reward settings updated successfully');
      } else {
        setError(res.message || 'Failed to update settings');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSettingsSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading referral data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Referral Management</h1>
        <p className="text-gray-500 text-sm mt-1">View referral stats, manage rewards, and track referral activity</p>
      </div>

      {/* Messages */}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>}

      {/* Reward Settings Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Referral Reward Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Referrer Reward (Tokens)</label>
            <p className="text-xs text-gray-500 mb-2">Tokens given to the referrer when referred user makes their first purchase</p>
            <input
              type="number"
              value={referrerReward}
              onChange={(e) => setReferrerReward(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Referred User Reward (Tokens)</label>
            <p className="text-xs text-gray-500 mb-2">Tokens given to new user when they apply a referral code</p>
            <input
              type="number"
              value={referredReward}
              onChange={(e) => setReferredReward(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              min="0"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={settingsSaving}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {settingsSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.totalReferrals}</div>
            <div className="text-sm text-gray-500">Total Referrals</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingReferrals}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-green-600">{stats.rewardedReferrals}</div>
            <div className="text-sm text-gray-500">Rewarded</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-teal-600">{stats.totalReferrerRewards + stats.totalReferredRewards}</div>
            <div className="text-sm text-gray-500">Total Tokens Given</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Top Referrers
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'all' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          All Referrals ({referrals.length})
        </button>
      </div>

      {/* Top Referrers Table */}
      {activeTab === 'overview' && stats?.topReferrers && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold text-gray-900">Top Referrers</h3>
          </div>
          {stats.topReferrers.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No referral data yet</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">#</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">User</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Referral Code</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Total Referrals</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Tokens Earned</th>
                </tr>
              </thead>
              <tbody>
                {stats.topReferrers.map((r, idx) => (
                  <tr key={r.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-500">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{r.name}</div>
                      <div className="text-xs text-gray-500">{r.userCode}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-teal-700">{r.referralCode}</td>
                    <td className="py-3 px-4 font-medium">{r.totalReferrals}</td>
                    <td className="py-3 px-4 font-medium text-green-600">{r.totalRewards}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* All Referrals Table */}
      {activeTab === 'all' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold text-gray-900">All Referrals</h3>
          </div>
          {referrals.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No referrals yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Referrer</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Referred User</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Rewards</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((ref) => (
                    <tr key={ref.id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{ref.referrer?.name || `User #${ref.referrerId}`}</div>
                        <div className="text-xs text-gray-500">{ref.referrer?.userCode}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{ref.referred?.name || `User #${ref.referredId}`}</div>
                        <div className="text-xs text-gray-500">{ref.referred?.userCode}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ref.status === 'rewarded' ? 'bg-green-100 text-green-700' :
                          ref.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {ref.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {ref.referrerReward > 0 && <div className="text-green-600">Referrer: +{ref.referrerReward} tokens</div>}
                        {ref.referredReward > 0 && <div className="text-blue-600">Referred: +{ref.referredReward} tokens</div>}
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs">
                        {new Date(ref.createdAt).toLocaleDateString()}
                        {ref.rewardedAt && (
                          <div className="text-green-600">Rewarded: {new Date(ref.rewardedAt).toLocaleDateString()}</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReferralManagement;
