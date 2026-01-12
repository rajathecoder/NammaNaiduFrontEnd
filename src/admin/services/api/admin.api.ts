// Admin API service
import { getApiUrl } from '../../../config/api.config';

export const adminApi = {
  // Get all users (for admin)
  // Using /api/admin/users endpoint with admin authentication
  getAllUsers: async (token: string) => {
    try {
      const response = await fetch(getApiUrl('/api/admin/users'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch users' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error in getAllUsers:', error);
      throw error;
    }
  },

  // Get user by ID (for admin)
  getUserById: async (userId: number, token: string) => {
    try {
      const response = await fetch(getApiUrl(`/api/admin/users/${userId}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch user' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error in getUserById:', error);
      throw error;
    }
  },

  // Update user status (block/unblock)
  updateUserStatus: async (userId: number, isActive: boolean, token: string) => {
    try {
      const response = await fetch(getApiUrl(`/api/admin/users/${userId}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update user status' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error in updateUserStatus:', error);
      throw error;
    }
  },

  // Get pending approvals
  getPendingApprovals: async (token: string) => {
    try {
      const response = await fetch(getApiUrl('/api/admin/users/pending'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch pending approvals' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error in getPendingApprovals:', error);
      throw error;
    }
  },

  // Get blocked users
  getBlockedUsers: async (token: string) => {
    try {
      const response = await fetch(getApiUrl('/api/admin/users/blocked'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch blocked users' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error in getBlockedUsers:', error);
      throw error;
    }
  },

  // Update user (general update)
  updateUser: async (userId: number, userData: any, token: string) => {
    try {
      const response = await fetch(getApiUrl(`/api/admin/users/${userId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update user' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  },
};

