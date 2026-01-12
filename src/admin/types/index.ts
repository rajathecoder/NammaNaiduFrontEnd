// Admin-specific TypeScript types and interfaces

export interface AdminUser {
  id: number;
  accountId: string;
  userCode: string;
  name: string;
  email?: string;
  phone: string;
  gender?: string;
  profileFor?: string;
  isActive: boolean;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  pendingVerifications: number;
  totalRegistrations: number;
}

export interface AdminDashboardData {
  stats: AdminStats;
  recentUsers: AdminUser[];
}

