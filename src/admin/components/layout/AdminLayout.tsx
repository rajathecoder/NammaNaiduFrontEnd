import React, { useEffect, useState, Suspense } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import SimpleSpinner from '../../../components/common/SimpleSpinner';
import logoImage from '../../../assets/images/logoonly.png';
import { getCurrentAdminRole, hasAccess } from '../../utils/permissions';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['users']);
  const [notificationsCount] = useState(2);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [adminInfo, setAdminInfo] = useState<any>(null);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    const adminToken = localStorage.getItem('adminToken');
    
    if (!isAdmin || !adminToken) {
      navigate('/login');
      return;
    }

    // Get admin role and info
    const role = getCurrentAdminRole();
    setAdminRole(role);
    
    try {
      const info = localStorage.getItem('adminInfo');
      if (info) {
        setAdminInfo(JSON.parse(info));
      }
    } catch (error) {
      console.error('Error parsing admin info:', error);
    }
  }, [navigate]);

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev =>
      prev.includes(menu)
        ? prev.filter(m => m !== menu)
        : [...prev, menu]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminInfo');
    localStorage.removeItem('adminRole');
    navigate('/login');
  };

  const isMenuActive = (path: string) => location.pathname.startsWith(path);

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path.includes('/users/all')) return 'Users > All Users';
    if (path.includes('/users/pending')) return 'Users > Profile Verification';
    if (path.includes('/users/blocked')) return 'Users > Blocked Users';
    if (path.includes('/dashboard')) return 'Dashboard';
    return 'Admin Panel';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col fixed h-screen overflow-y-auto z-[100]">
        <div className="p-6 flex items-center gap-3 border-b border-gray-200">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img src={logoImage} alt="Namma Naidu Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="m-0 text-gray-900 text-lg font-bold">Namma Naidu</h2>
            <p className="mt-0.5 mb-0 text-gray-500 text-xs">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {/* Dashboard - All roles */}
          {hasAccess(adminRole as any, '/admin/dashboard') && (
            <NavLink to="/admin/dashboard" className={({ isActive }) => `flex items-center gap-3 py-3 px-5 text-gray-600 no-underline transition-all duration-200 text-sm relative ${isActive ? 'bg-[#f0fdfa] text-[#14b8a6] font-semibold before:content-[""] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#14b8a6]' : 'hover:bg-gray-50 hover:text-[#14b8a6]'}`}>
              <span className="text-lg w-5 text-center">📊</span>
              <span>Dashboard</span>
            </NavLink>
          )}

          {/* Users - All roles */}
          {hasAccess(adminRole as any, '/admin/users') && (
            <div className="my-1">
              <div
                className={`flex items-center gap-3 py-3 px-5 text-gray-600 cursor-pointer transition-all duration-200 text-sm ${isMenuActive('/admin/users') ? 'bg-[#f0fdfa] text-[#14b8a6] font-semibold' : 'hover:bg-gray-50 hover:text-[#14b8a6]'}`}
                onClick={() => toggleMenu('users')}
              >
                <span className="text-lg w-5 text-center">👥</span>
                <span className="flex-1">Users</span>
                <span className="text-xs">{expandedMenus.includes('users') ? '▲' : '▼'}</span>
              </div>
              {expandedMenus.includes('users') && (
                <div className="ml-4">
                  <NavLink to="/admin/users/all" className={({ isActive }) => `flex items-center gap-2 py-2 px-5 text-gray-600 no-underline transition-all duration-200 text-sm ${isActive ? 'text-[#14b8a6] font-semibold' : 'hover:text-[#14b8a6]'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    All Users
                  </NavLink>
                  <NavLink to="/admin/users/pending" className={({ isActive }) => `flex items-center gap-2 py-2 px-5 text-gray-600 no-underline transition-all duration-200 text-sm ${isActive ? 'text-[#14b8a6] font-semibold' : 'hover:text-[#14b8a6]'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    Profile Verification
                  </NavLink>
                  <NavLink to="/admin/users/blocked" className={({ isActive }) => `flex items-center gap-2 py-2 px-5 text-gray-600 no-underline transition-all duration-200 text-sm ${isActive ? 'text-[#14b8a6] font-semibold' : 'hover:text-[#14b8a6]'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    Blocked Users
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* Proof Verification - All roles */}
          {hasAccess(adminRole as any, '/admin/photo-moderation') && (
            <NavLink to="/admin/photo-moderation" className={({ isActive }) => `flex items-center gap-3 py-3 px-5 text-gray-600 no-underline transition-all duration-200 text-sm relative ${isActive ? 'bg-[#f0fdfa] text-[#14b8a6] font-semibold before:content-[""] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#14b8a6]' : 'hover:bg-gray-50 hover:text-[#14b8a6]'}`}>
              <span className="text-lg w-5 text-center">🖼️</span>
              <span>Proof Verification</span>
            </NavLink>
          )}

          {/* Subscriptions - Super Admin only */}
          {hasAccess(adminRole as any, '/admin/subscriptions') && (
            <div className="my-1">
              <div
                className={`flex items-center gap-3 py-3 px-5 text-gray-600 cursor-pointer transition-all duration-200 text-sm ${isMenuActive('/admin/subscriptions') ? 'bg-[#f0fdfa] text-[#14b8a6] font-semibold' : 'hover:bg-gray-50 hover:text-[#14b8a6]'}`}
                onClick={() => toggleMenu('subscriptions')}
              >
                <span className="text-lg w-5 text-center">💳</span>
                <span className="flex-1">Subscriptions</span>
                <span className="text-xs">{expandedMenus.includes('subscriptions') ? '▲' : '▼'}</span>
              </div>
              {expandedMenus.includes('subscriptions') && (
                <div className="ml-4">
                  <NavLink to="/admin/subscriptions/plans" className={({ isActive }) => `flex items-center gap-2 py-2 px-5 text-gray-600 no-underline transition-all duration-200 text-sm ${isActive ? 'text-[#14b8a6] font-semibold' : 'hover:text-[#14b8a6]'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    Plans
                  </NavLink>
                  <NavLink to="/admin/subscriptions/transactions" className={({ isActive }) => `flex items-center gap-2 py-2 px-5 text-gray-600 no-underline transition-all duration-200 text-sm ${isActive ? 'text-[#14b8a6] font-semibold' : 'hover:text-[#14b8a6]'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    Transactions
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* Matches - Super Admin and Moderator */}
          {hasAccess(adminRole as any, '/admin/matches') && (
            <NavLink to="/admin/matches" className={({ isActive }) => `flex items-center gap-3 py-3 px-5 text-gray-600 no-underline transition-all duration-200 text-sm relative ${isActive ? 'bg-[#f0fdfa] text-[#14b8a6] font-semibold before:content-[""] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#14b8a6]' : 'hover:bg-gray-50 hover:text-[#14b8a6]'}`}>
              <span className="text-lg w-5 text-center">💑</span>
              <span>Matches</span>
            </NavLink>
          )}

          {/* Masters - Super Admin only */}
          {hasAccess(adminRole as any, '/admin/masters') && (
            <div className="my-1">
              <div
                className={`flex items-center gap-3 py-3 px-5 text-gray-600 cursor-pointer transition-all duration-200 text-sm ${isMenuActive('/admin/masters') ? 'bg-[#f0fdfa] text-[#14b8a6] font-semibold' : 'hover:bg-gray-50 hover:text-[#14b8a6]'}`}
                onClick={() => toggleMenu('masters')}
              >
                <span className="text-lg w-5 text-center">📋</span>
                <span className="flex-1">Masters</span>
                <span className="text-xs">{expandedMenus.includes('masters') ? '▲' : '▼'}</span>
              </div>
              {expandedMenus.includes('masters') && (
                <div className="ml-4">
                  <NavLink to="/admin/masters/religion" className={({ isActive }) => `flex items-center gap-2 py-2 px-5 text-gray-600 no-underline transition-all duration-200 text-sm ${isActive ? 'text-[#14b8a6] font-semibold' : 'hover:text-[#14b8a6]'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    Religion
                  </NavLink>
                  <NavLink to="/admin/masters/caste" className={({ isActive }) => `flex items-center gap-2 py-2 px-5 text-gray-600 no-underline transition-all duration-200 text-sm ${isActive ? 'text-[#14b8a6] font-semibold' : 'hover:text-[#14b8a6]'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    Caste
                  </NavLink>
                  <NavLink to="/admin/masters/occupation" className={({ isActive }) => `flex items-center gap-2 py-2 px-5 text-gray-600 no-underline transition-all duration-200 text-sm ${isActive ? 'text-[#14b8a6] font-semibold' : 'hover:text-[#14b8a6]'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    Occupation
                  </NavLink>
                  <NavLink to="/admin/masters/location" className={({ isActive }) => `flex items-center gap-2 py-2 px-5 text-gray-600 no-underline transition-all duration-200 text-sm ${isActive ? 'text-[#14b8a6] font-semibold' : 'hover:text-[#14b8a6]'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    Location
                  </NavLink>
                  <NavLink to="/admin/masters/education" className={({ isActive }) => `flex items-center gap-2 py-2 px-5 text-gray-600 no-underline transition-all duration-200 text-sm ${isActive ? 'text-[#14b8a6] font-semibold' : 'hover:text-[#14b8a6]'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    Education
                  </NavLink>
                  <NavLink to="/admin/masters/employment-type" className={({ isActive }) => `flex items-center gap-2 py-2 px-5 text-gray-600 no-underline transition-all duration-200 text-sm ${isActive ? 'text-[#14b8a6] font-semibold' : 'hover:text-[#14b8a6]'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    Employment Type
                  </NavLink>
                  <NavLink to="/admin/masters/income-currency" className={({ isActive }) => `flex items-center gap-2 py-2 px-5 text-gray-600 no-underline transition-all duration-200 text-sm ${isActive ? 'text-[#14b8a6] font-semibold' : 'hover:text-[#14b8a6]'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    Income Currency
                  </NavLink>
                  <NavLink to="/admin/masters/income-range" className={({ isActive }) => `flex items-center gap-2 py-2 px-5 text-gray-600 no-underline transition-all duration-200 text-sm ${isActive ? 'text-[#14b8a6] font-semibold' : 'hover:text-[#14b8a6]'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    Income Range
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* Reports - All roles */}
          {hasAccess(adminRole as any, '/admin/reports') && (
            <NavLink to="/admin/reports" className={({ isActive }) => `flex items-center gap-3 py-3 px-5 text-gray-600 no-underline transition-all duration-200 text-sm relative ${isActive ? 'bg-[#f0fdfa] text-[#14b8a6] font-semibold before:content-[""] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#14b8a6]' : 'hover:bg-gray-50 hover:text-[#14b8a6]'}`}>
              <span className="text-lg w-5 text-center">🚨</span>
              <span>Reports</span>
            </NavLink>
          )}

          {/* CMS - All roles */}
          {hasAccess(adminRole as any, '/admin/cms') && (
            <NavLink to="/admin/cms" className={({ isActive }) => `flex items-center gap-3 py-3 px-5 text-gray-600 no-underline transition-all duration-200 text-sm relative ${isActive ? 'bg-[#f0fdfa] text-[#14b8a6] font-semibold before:content-[""] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#14b8a6]' : 'hover:bg-gray-50 hover:text-[#14b8a6]'}`}>
              <span className="text-lg w-5 text-center">📝</span>
              <span>CMS</span>
            </NavLink>
          )}

          {/* Notifications - Super Admin and Moderator */}
          {hasAccess(adminRole as any, '/admin/notifications') && (
            <NavLink to="/admin/notifications" className={({ isActive }) => `flex items-center gap-3 py-3 px-5 text-gray-600 no-underline transition-all duration-200 text-sm relative ${isActive ? 'bg-[#f0fdfa] text-[#14b8a6] font-semibold before:content-[""] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#14b8a6]' : 'hover:bg-gray-50 hover:text-[#14b8a6]'}`}>
              <span className="text-lg w-5 text-center">🔔</span>
              <span>Notifications</span>
              {notificationsCount > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-semibold">{notificationsCount}</span>}
            </NavLink>
          )}

          {/* Settings - Super Admin only */}
          {hasAccess(adminRole as any, '/admin/settings') && (
            <NavLink to="/admin/settings" className={({ isActive }) => `flex items-center gap-3 py-3 px-5 text-gray-600 no-underline transition-all duration-200 text-sm relative ${isActive ? 'bg-[#f0fdfa] text-[#14b8a6] font-semibold before:content-[""] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#14b8a6]' : 'hover:bg-gray-50 hover:text-[#14b8a6]'}`}>
              <span className="text-lg w-5 text-center">⚙️</span>
              <span>Settings</span>
            </NavLink>
          )}

          {/* Admin Users - Super Admin only */}
          {hasAccess(adminRole as any, '/admin/admin-users') && (
            <NavLink to="/admin/admin-users" className={({ isActive }) => `flex items-center gap-3 py-3 px-5 text-gray-600 no-underline transition-all duration-200 text-sm relative ${isActive ? 'bg-[#f0fdfa] text-[#14b8a6] font-semibold before:content-[""] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#14b8a6]' : 'hover:bg-gray-50 hover:text-[#14b8a6]'}`}>
              <span className="text-lg w-5 text-center">👤</span>
              <span>Admin Users</span>
            </NavLink>
          )}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 py-3 px-5 text-gray-600 bg-transparent border-none cursor-pointer transition-all duration-200 text-sm hover:bg-gray-50 hover:text-red-600">
            <span className="text-lg w-5 text-center">🚪</span>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 ml-[260px] flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1">
              <div className="text-sm text-gray-600 font-medium">{getBreadcrumbs()}</div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input type="text" placeholder="Search something..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200" title="Settings">
                ⚙️
              </button>
              <button className="relative w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200" title="Notifications">
                🔔
                {notificationsCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-semibold min-w-[18px] text-center">{notificationsCount}</span>}
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">👤</div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{adminInfo?.name || 'Admin User'}</div>
                  <div className="text-xs text-gray-500">{adminInfo?.email || 'admin@nammanaidu.com'}</div>
                  {adminRole && (
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      {adminRole}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            <Suspense fallback={<SimpleSpinner />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
