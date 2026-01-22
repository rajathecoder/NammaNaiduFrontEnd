// API Configuration
// Priority:
// 1. Use VITE_API_BASE_URL environment variable if set
// 2. In production: use relative URL (same origin) - works if frontend/backend on same server
// 3. In development: fallback to localhost:5000
const getApiBaseUrl = () => {
  // If environment variable is set, use it (highest priority)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // In production build, use relative URL (empty string = same origin)
  // This works when frontend and backend are served from the same domain
  if (import.meta.env.PROD) {
    // Use relative URL - browser will use same protocol/hostname/port as the page
    return '';
  }
  
  // Development fallback to localhost
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    SEND_OTP: '/api/auth/send-otp', // Old endpoint for registration
    SEND_OTP_NEW: '/api/auth/otp/send', // New endpoint with MSG91 integration
    VERIFY_OTP: '/api/auth/verify-otp',
    VERIFY_OTP_NEW: '/api/auth/otp/verify', // New endpoint with MSG91 support
    FIREBASE_LOGIN: '/api/auth/firebase-login',
  },
  // User endpoints
  USERS: {
    PROFILE: '/api/users/profile',
    PROFILE_BY_ACCOUNT_ID: (accountId: string) => `/api/users/profile/${accountId}`,
    UPDATE_PROFILE: '/api/users/profile',
    BASIC_DETAILS: '/api/users/basic-details',
    PROFILE_ACTIONS: '/api/users/profile-actions',
    PROFILE_ACTION_BY_TARGET: (targetUserId: string) => `/api/users/profile-actions/${targetUserId}`,
    MY_PROFILE_ACTIONS: '/api/users/my-profile-actions',
    RECEIVED_PROFILE_ACTIONS: '/api/users/received-profile-actions',
    OPPOSITE_GENDER_PROFILES: '/api/users/opposite-gender-profiles',
    OPPOSITE_GENDER_PROFILES_BY_ID: (id: number) => `/api/users/opposite-gender-profiles/${id}`,
    UPLOAD_PHOTOS: '/api/users/photos',
    GET_PHOTOS: (personId: string | number) => `/api/users/photos/${personId}`,
    HOROSCOPE: '/api/users/horoscope',
    FAMILY: '/api/users/family',
    HOBBIES: '/api/users/hobbies',
    SEARCH: '/api/users/search',
    VIEW_PROFILE_DETAILS: '/api/users/profile/view-details',
    NOTIFICATIONS: {
      GET: '/api/notifications',
      READ: (id: string | number) => `/api/notifications/${id}/read`,
      READ_ALL: '/api/notifications/read-all',
    }
  },
  // Device endpoints
  DEVICES: {
    STORE_FCM_TOKEN: '/api/devices/fcm-token',
  },
  // Public master endpoints (no authentication required)
  PUBLIC: {
    MASTER: (type: string) => `/api/masters/${type}`,
  },
  // Admin endpoints
  ADMIN: {
    DASHBOARD: '/api/admin/dashboard',
    USERS: '/api/admin/users',
    // Master endpoints
    RELIGION: '/api/admin/religion',
    CASTE: '/api/admin/caste',
    OCCUPATION: '/api/admin/occupation',
    LOCATION: '/api/admin/location',
    EDUCATION: '/api/admin/education',
    EMPLOYMENT_TYPE: '/api/admin/employment-type',
    INCOME_CURRENCY: '/api/admin/income-currency',
    INCOME_RANGE: '/api/admin/income-range',
    // Generic master endpoint
    MASTER: (type: string) => `/api/admin/${type}`,
    MASTER_BY_ID: (type: string, id: number) => `/api/admin/${type}/${id}`,
    // Subscription endpoints
    SUBSCRIPTION_PLANS: '/api/admin/plans',
    SUBSCRIPTION_PLAN_BY_ID: (id: number) => `/api/admin/plans/${id}`,
    SUBSCRIPTION_TRANSACTIONS: '/api/admin/transactions',
    SUBSCRIPTION_TRANSACTION_BY_ID: (id: number) => `/api/admin/transactions/${id}`,
    SUBSCRIPTION_TRANSACTIONS_EXPORT: '/api/admin/transactions/export',
    // Admin user endpoints
    ADMIN_USERS: '/api/admin/admin-users',
    ADMIN_USER_BY_ID: (id: number) => `/api/admin/admin-users/${id}`,
    ADMIN_USER_STATUS: (id: number) => `/api/admin/admin-users/${id}/status`,
    // Admin notification endpoints
    SEND_PUSH_NOTIFICATION: '/api/admin/notifications/send-push',
  },
};

// Helper function to get full URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};


