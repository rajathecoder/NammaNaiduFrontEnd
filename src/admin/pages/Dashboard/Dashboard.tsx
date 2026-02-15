import React, { useEffect, useState } from 'react';
import { getApiUrl, API_ENDPOINTS } from '../../../config/api.config';

interface DashboardStats {
  totalUsers: number;
  newRegistrationsToday: number;
  newRegistrationsThisWeek: number;
  menCount: number;
  womenCount: number;
  verifiedProfiles: number;
  pendingApprovals: number;
  premiumUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalRevenue: number;
  reportedProfiles: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    newRegistrationsToday: 0,
    newRegistrationsThisWeek: 0,
    menCount: 0,
    womenCount: 0,
    verifiedProfiles: 0,
    pendingApprovals: 0,
    premiumUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalRevenue: 0,
    reportedProfiles: 0,
  });
  const [loading, setLoading] = useState(true);
  const [abuseStats, setAbuseStats] = useState({ totalReports: 0, pendingReports: 0, flaggedUsers: 0, blocksToday: 0, reportsToday: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(getApiUrl(API_ENDPOINTS.ADMIN.DASHBOARD), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
          setStats({
              totalUsers: data.data.totalUsers || 0,
              newRegistrationsToday: data.data.newRegistrationsToday || 0,
              newRegistrationsThisWeek: data.data.newRegistrationsThisWeek || 0,
              menCount: data.data.menCount || 0,
              womenCount: data.data.womenCount || 0,
              verifiedProfiles: data.data.verifiedProfiles || 0,
              pendingApprovals: data.data.pendingApprovals || 0,
              premiumUsers: data.data.premiumUsers || 0,
              activeUsers: data.data.activeUsers || 0,
              inactiveUsers: data.data.inactiveUsers || 0,
              totalRevenue: data.data.totalRevenue || 0,
              reportedProfiles: data.data.reportedProfiles || 0,
          });
          }
        } else {
          console.error('Failed to fetch dashboard stats');
        }

        // Fetch abuse stats
        try {
          const abuseRes = await fetch(getApiUrl(API_ENDPOINTS.ADMIN.ABUSE_STATS), {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          });
          if (abuseRes.ok) {
            const abuseData = await abuseRes.json();
            if (abuseData.success && abuseData.data) {
              setAbuseStats(abuseData.data);
            }
          }
        } catch (abuseErr) {
          console.warn('Could not fetch abuse stats:', abuseErr);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px] text-lg text-gray-600">Loading dashboard...</div>;
  }

  const menPercentage = stats.totalUsers > 0 
    ? ((stats.menCount / stats.totalUsers) * 100).toFixed(1) 
    : '0.0';
  const womenPercentage = stats.totalUsers > 0 
    ? ((stats.womenCount / stats.totalUsers) * 100).toFixed(1) 
    : '0.0';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div>
          <button className="flex items-center gap-2 py-2 px-4 bg-[#14b8a6] text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#0d9488]">
            <span>📥</span> Export Report
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
          <div className="text-4xl mb-4">👥</div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-gray-800 mb-1">{stats.totalUsers.toLocaleString()}</p>
            <p className="text-xs text-gray-500">All registered users</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
          <div className="text-4xl mb-4">📅</div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">New Registrations (Today)</h3>
            <p className="text-3xl font-bold text-gray-800 mb-1">{stats.newRegistrationsToday}</p>
            <p className="text-xs text-gray-500">Registered today</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-cyan-500">
          <div className="text-4xl mb-4">📊</div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">New Registrations (This Week)</h3>
            <p className="text-3xl font-bold text-gray-800 mb-1">{stats.newRegistrationsThisWeek}</p>
            <p className="text-xs text-gray-500">Last 7 days</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-yellow-500">
          <div className="text-4xl mb-4">⏳</div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Pending Approvals</h3>
            <p className="text-3xl font-bold text-gray-800 mb-1">{stats.pendingApprovals}</p>
            <p className="text-xs text-gray-500">Requires review</p>
          </div>
        </div>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-4xl mb-4">👨</div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Men Users</h3>
            <p className="text-3xl font-bold text-gray-800 mb-1">{stats.menCount.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{menPercentage}% of total</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-4xl mb-4">👩</div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Women Users</h3>
            <p className="text-3xl font-bold text-gray-800 mb-1">{stats.womenCount.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{womenPercentage}% of total</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-4xl mb-4">✅</div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Verified Profiles</h3>
            <p className="text-3xl font-bold text-gray-800 mb-1">{stats.verifiedProfiles.toLocaleString()}</p>
            <p className="text-xs text-gray-500">KYC verified</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-4xl mb-4">⭐</div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Premium Users</h3>
            <p className="text-3xl font-bold text-gray-800 mb-1">{stats.premiumUsers.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Active subscriptions</p>
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-4xl mb-4">🟢</div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Active Users</h3>
            <p className="text-3xl font-bold text-gray-800 mb-1">{stats.activeUsers.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Last 30 days</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-4xl mb-4">⚫</div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Inactive Users</h3>
            <p className="text-3xl font-bold text-gray-800 mb-1">{stats.inactiveUsers.toLocaleString()}</p>
            <p className="text-xs text-gray-500">No activity</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-600">
          <div className="text-4xl mb-4">💰</div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-800 mb-1">₹{stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500">All time</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-red-500">
          <div className="text-4xl mb-4">🚨</div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Reported Profiles</h3>
            <p className="text-3xl font-bold text-gray-800 mb-1">{stats.reportedProfiles}</p>
            <p className="text-xs text-gray-500">Needs attention</p>
          </div>
        </div>
      </div>

      {/* Safety & Abuse Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-orange-400">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Reports</div>
          <div className="text-2xl font-bold text-orange-600 mt-1">{abuseStats.pendingReports}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-400">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Reports</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{abuseStats.totalReports}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-yellow-400">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Flagged Users</div>
          <div className="text-2xl font-bold text-yellow-600 mt-1">{abuseStats.flaggedUsers}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-400">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Blocks Today</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">{abuseStats.blocksToday}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-400">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Reports Today</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{abuseStats.reportsToday}</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Monthly Registrations</h3>
            <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
              <option>This year</option>
            </select>
          </div>
          <div className="h-[200px]">
            <div className="h-full flex items-end justify-between gap-2">
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-t flex-1 flex items-end" style={{ height: '55%' }}>
                  <div className="w-full bg-[#14b8a6] rounded-t"></div>
                </div>
                <span className="text-xs text-gray-600 mt-2">Jan</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-t flex-1 flex items-end" style={{ height: '65%' }}>
                  <div className="w-full bg-[#14b8a6] rounded-t"></div>
                </div>
                <span className="text-xs text-gray-600 mt-2">Feb</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-t flex-1 flex items-end" style={{ height: '80%' }}>
                  <div className="w-full bg-[#14b8a6] rounded-t"></div>
                </div>
                <span className="text-xs text-gray-600 mt-2">Mar</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-t flex-1 flex items-end" style={{ height: '50%' }}>
                  <div className="w-full bg-[#14b8a6] rounded-t"></div>
                </div>
                <span className="text-xs text-gray-600 mt-2">Apr</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-t flex-1 flex items-end" style={{ height: '40%' }}>
                  <div className="w-full bg-[#14b8a6] rounded-t"></div>
                </div>
                <span className="text-xs text-gray-600 mt-2">May</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-t flex-1 flex items-end" style={{ height: '60%' }}>
                  <div className="w-full bg-[#14b8a6] rounded-t"></div>
                </div>
                <span className="text-xs text-gray-600 mt-2">Jun</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Premium Membership Sales</h3>
            <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
            </select>
          </div>
          <div className="h-[200px]">
            <div className="h-full flex items-center justify-center">
              <svg viewBox="0 0 300 150" className="w-full h-full">
                <polyline
                  points="0,120 50,100 100,80 150,60 200,70 250,50 300,40"
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="3"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Active Users by Age Groups</h3>
            <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]">
              <option>Current month</option>
              <option>Last month</option>
            </select>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-12">18-25</span>
              <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#14b8a6] rounded-full" style={{ width: '25%' }}></div>
              </div>
              <span className="text-sm font-semibold text-gray-800 w-10 text-right">25%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-12">26-30</span>
              <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#14b8a6] rounded-full" style={{ width: '35%' }}></div>
              </div>
              <span className="text-sm font-semibold text-gray-800 w-10 text-right">35%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-12">31-35</span>
              <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#14b8a6] rounded-full" style={{ width: '28%' }}></div>
              </div>
              <span className="text-sm font-semibold text-gray-800 w-10 text-right">28%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-12">36-40</span>
              <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#14b8a6] rounded-full" style={{ width: '12%' }}></div>
              </div>
              <span className="text-sm font-semibold text-gray-800 w-10 text-right">12%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

