// Role-based access control utility

export type AdminRole = 'Super Admin' | 'Moderator' | 'Customer Support';

export interface MenuPermission {
  path: string;
  roles: AdminRole[];
}

// Define menu permissions
export const MENU_PERMISSIONS: MenuPermission[] = [
  // Dashboard - All roles can access
  { path: '/admin/dashboard', roles: ['Super Admin', 'Moderator', 'Customer Support'] },
  
  // Users - All roles can access
  { path: '/admin/users', roles: ['Super Admin', 'Moderator', 'Customer Support'] },
  
  // Proof Verification - All roles can access
  { path: '/admin/photo-moderation', roles: ['Super Admin', 'Moderator', 'Customer Support'] },
  
  // Reports - All roles can access
  { path: '/admin/reports', roles: ['Super Admin', 'Moderator', 'Customer Support'] },
  
  // CMS - All roles can access
  { path: '/admin/cms', roles: ['Super Admin', 'Moderator', 'Customer Support'] },
  
  // Matches - Super Admin and Moderator only
  { path: '/admin/matches', roles: ['Super Admin', 'Moderator'] },
  
  // Messaging - Super Admin and Moderator
  { path: '/admin/messaging', roles: ['Super Admin', 'Moderator'] },
  
  // Notifications - Super Admin and Moderator only
  { path: '/admin/notifications', roles: ['Super Admin', 'Moderator'] },
  
  // Subscriptions - Super Admin only
  { path: '/admin/subscriptions', roles: ['Super Admin'] },
  
  // Masters - Super Admin only
  { path: '/admin/masters', roles: ['Super Admin'] },
  
  // Settings - Super Admin only
  { path: '/admin/settings', roles: ['Super Admin'] },
  
  // Admin Users - Super Admin only
  { path: '/admin/admin-users', roles: ['Super Admin'] },
];

/**
 * Check if a role has access to a specific path
 */
export const hasAccess = (role: AdminRole | null, path: string): boolean => {
  if (!role) return false;
  
  // Super Admin has access to everything
  if (role === 'Super Admin') return true;
  
  // Check if path matches any permission
  const permission = MENU_PERMISSIONS.find(p => path.startsWith(p.path));
  if (!permission) return false;
  
  return permission.roles.includes(role);
};

/**
 * Get all accessible paths for a role
 */
export const getAccessiblePaths = (role: AdminRole | null): string[] => {
  if (!role) return [];
  
  if (role === 'Super Admin') {
    return MENU_PERMISSIONS.map(p => p.path);
  }
  
  return MENU_PERMISSIONS
    .filter(p => p.roles.includes(role))
    .map(p => p.path);
};

/**
 * Get current admin role from localStorage
 */
export const getCurrentAdminRole = (): AdminRole | null => {
  try {
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo) {
      const admin = JSON.parse(adminInfo);
      return admin.role || null;
    }
  } catch (error) {
    console.error('Error getting admin role:', error);
  }
  return null;
};

/**
 * Check if current admin has access to a path
 */
export const canAccess = (path: string): boolean => {
  const role = getCurrentAdminRole();
  return hasAccess(role, path);
};


