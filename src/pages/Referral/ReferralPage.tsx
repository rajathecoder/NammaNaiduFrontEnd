import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReferralInfo, applyReferralCode } from '../../services/api/subscription.api';
import { getAuthData } from '../../utils/auth';
import Loading from '../../components/common/Loading';

interface ReferralData {
  referralCode: string;
  referralLink: string;
  stats: {
    totalReferrals: number;
    completedReferrals: number;
    pendingReferrals: number;
    totalTokensEarned: number;
  };
  rewards: {
    referrerTokens: number;
    referredTokens: number;
  };
  recentReferrals: Array<{
    id: number;
    referredUser: { name: string; userCode: string } | null;
    status: string;
    referrerReward: number;
    createdAt: string;
    rewardedAt: string | null;
  }>;
}

const ReferralPage = () => {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyCode, setApplyCode] = useState('');
  const [applyResult, setApplyResult] = useState<{ success: boolean; message: string } | null>(null);
  const [applying, setApplying] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReferralInfo();
  }, []);

  const fetchReferralInfo = async () => {
    try {
      setLoading(true);
      const authData = getAuthData();
      if (!authData?.token) {
        navigate('/login');
        return;
      }
      const res = await getReferralInfo(authData.token);
      if (res.success) {
        setData(res.data);
      } else {
        setError(res.message || 'Failed to load referral info');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!data) return;
    const message = `Join Namma Naidu using my referral code: ${data.referralCode} and get free profile view tokens! ${data.referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleApply = async () => {
    if (!applyCode.trim()) return;
    setApplying(true);
    setApplyResult(null);
    try {
      const authData = getAuthData();
      if (!authData?.token) return;
      const res = await applyReferralCode(applyCode.trim(), authData.token);
      if (res.success) {
        setApplyResult({ success: true, message: res.message || 'Referral code applied successfully!' });
        fetchReferralInfo();
      } else {
        setApplyResult({ success: false, message: res.message || 'Invalid referral code' });
      }
    } catch (err: any) {
      setApplyResult({ success: false, message: err.message || 'Error applying referral code' });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading message="Loading referral info..." size="medium" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Refer & Earn</h1>
            <p className="text-gray-500 text-sm mt-1">Share your code and earn tokens</p>
          </div>
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700 text-sm">
            Back
          </button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

        {data && (
          <>
            {/* Referral Code Card */}
            <div className="bg-gradient-to-br from-[#1B5E20] to-[#0D3B13] rounded-2xl p-6 text-white">
              <h2 className="text-lg font-semibold mb-2">Your Referral Code</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 backdrop-blur rounded-lg px-6 py-3 font-mono text-2xl font-bold tracking-wider flex-1 text-center">
                  {data.referralCode}
                </div>
                <button
                  onClick={() => handleCopy(data.referralCode)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg px-4 py-3 text-sm font-medium transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleCopy(data.referralLink)}
                  className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg py-2.5 text-sm font-medium transition-colors text-center"
                >
                  Copy Link
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] rounded-lg py-2.5 text-sm font-medium transition-colors text-center"
                >
                  Share on WhatsApp
                </button>
              </div>
              <p className="text-white/80 text-xs mt-3 text-center">
                You earn {data.rewards.referrerTokens} tokens when your friend subscribes. They get {data.rewards.referredTokens} tokens on sign-up!
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <div className="text-2xl font-bold text-gray-900">{data.stats.totalReferrals}</div>
                <div className="text-xs text-gray-500 mt-1">Total Referrals</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <div className="text-2xl font-bold text-green-600">{data.stats.completedReferrals}</div>
                <div className="text-xs text-gray-500 mt-1">Completed</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <div className="text-2xl font-bold text-teal-600">{data.stats.totalTokensEarned}</div>
                <div className="text-xs text-gray-500 mt-1">Tokens Earned</div>
              </div>
            </div>

            {/* Apply Referral Code */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Apply a Referral Code</h3>
              <p className="text-sm text-gray-500 mb-3">If someone referred you, enter their code to get free tokens.</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={applyCode}
                  onChange={(e) => { setApplyCode(e.target.value.toUpperCase()); setApplyResult(null); }}
                  placeholder="Enter referral code"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={handleApply}
                  disabled={applying || !applyCode.trim()}
                  className="px-4 py-2 bg-[#1B5E20] text-white rounded-lg text-sm font-medium hover:bg-[#145218] disabled:opacity-50 transition-colors"
                >
                  {applying ? '...' : 'Apply'}
                </button>
              </div>
              {applyResult && (
                <div className={`mt-2 text-sm ${applyResult.success ? 'text-green-600' : 'text-red-500'}`}>
                  {applyResult.message}
                </div>
              )}
            </div>

            {/* Recent Referrals */}
            {data.recentReferrals.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Recent Referrals</h3>
                <div className="space-y-3">
                  {data.recentReferrals.map((ref) => (
                    <div key={ref.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <div className="font-medium text-sm text-gray-800">
                          {ref.referredUser?.name || 'Unknown User'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(ref.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          ref.status === 'rewarded' ? 'bg-green-100 text-green-700' :
                          ref.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {ref.status}
                        </span>
                        {ref.referrerReward > 0 && (
                          <span className="text-green-600 text-xs font-medium">+{ref.referrerReward} tokens</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReferralPage;
