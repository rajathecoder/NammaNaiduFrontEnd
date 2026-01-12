import { getApiUrl, API_ENDPOINTS } from '../../config/api.config';

// ==================== TYPES ====================

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'Super Admin' | 'Moderator' | 'Customer Support';
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

export interface CreateAdminUserPayload {
  name: string;
  email: string;
  password: string;
  role?: 'Super Admin' | 'Moderator' | 'Customer Support';
  status?: 'active' | 'inactive';
}

export interface UpdateAdminUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: 'Super Admin' | 'Moderator' | 'Customer Support';
  status?: 'active' | 'inactive';
}

export interface AdminUserFilters {
  status?: 'active' | 'inactive';
  role?: 'Super Admin' | 'Moderator' | 'Customer Support';
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// ==================== ADMIN USER API ====================

// Get all admin users
export const getAdminUsers = async (
  filters?: AdminUserFilters,
  token?: string
): Promise<{
  success: boolean;
  data: AdminUser[];
  pagination: PaginationInfo;
  message: string;
}> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.role) params.append('role', filters.role);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const url = getApiUrl(API_ENDPOINTS.ADMIN.ADMIN_USERS);
  const queryString = params.toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers,
  });

  return response.json();
};

// Get single admin user by ID
export const getAdminUserById = async (
  id: number,
  token?: string
): Promise<{ success: boolean; data: AdminUser; message: string }> => {
  const url = getApiUrl(API_ENDPOINTS.ADMIN.ADMIN_USER_BY_ID(id));
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  return response.json();
};

// Create new admin user
export const createAdminUser = async (
  payload: CreateAdminUserPayload,
  token?: string
): Promise<{ success: boolean; data: AdminUser; message: string }> => {
  const url = getApiUrl(API_ENDPOINTS.ADMIN.ADMIN_USERS);
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  return response.json();
};

// Update admin user
export const updateAdminUser = async (
  id: number,
  payload: UpdateAdminUserPayload,
  token?: string
): Promise<{ success: boolean; data: AdminUser; message: string }> => {
  const url = getApiUrl(API_ENDPOINTS.ADMIN.ADMIN_USER_BY_ID(id));
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
  });

  return response.json();
};

// Delete admin user
export const deleteAdminUser = async (
  id: number,
  token?: string
): Promise<{ success: boolean; message: string }> => {
  const url = getApiUrl(API_ENDPOINTS.ADMIN.ADMIN_USER_BY_ID(id));
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'DELETE',
    headers,
  });

  return response.json();
};

// Toggle admin status
export const toggleAdminStatus = async (
  id: number,
  status: 'active' | 'inactive',
  token?: string
): Promise<{ success: boolean; data: AdminUser; message: string }> => {
  const url = getApiUrl(API_ENDPOINTS.ADMIN.ADMIN_USER_STATUS(id));
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status }),
  });

  return response.json();
};

