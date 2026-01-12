// Admin API service

const API_BASE_URL = 'http://localhost:5000';

export const adminApi = {
  // Get all users (for admin)
  // Using /api/admin/users endpoint with admin authentication
  getAllUsers: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return response.json();
  },

  // Get user by ID (for admin)
  getUserById: async (userId: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Update user status (block/unblock)
  updateUserStatus: async (userId: number, isActive: boolean, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ isActive }),
    });
    return response.json();
  },

  // Get pending approvals
  getPendingApprovals: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/pending`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Get blocked users
  getBlockedUsers: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/blocked`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Update user (general update)
  updateUser: async (userId: number, userData: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },
};

