// API Configuration
// Priority:
// 1. Use VITE_API_BASE_URL environment variable if set
// 2. In production: use the production API URL
// 3. In development: fallback to localhost:5000
const getApiBaseUrl = () => {
  // If environment variable is set, use it (highest priority)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // In production build, use the production API
  if (import.meta.env.PROD) {
    return 'https://api.nammanaidu.cloud';
  }
  
  // Development fallback to localhost
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints (single OTP flow: /api/auth/otp/send, /api/auth/otp/verify)
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    SEND_OTP: '/api/auth/otp/send',
    VERIFY_OTP: '/api/auth/otp/verify',
    FIREBASE_LOGIN: '/api/auth/firebase-login',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    LOGOUT: '/api/auth/logout',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  // User endpoints
  USERS: {
    ME: '/api/users/me',
    PROFILE: '/api/users/profile',
    PROFILE_COMPLETE: '/api/users/profile/complete',
    REGISTRATION_PROGRESS: '/api/users/registration-progress',
    PROFILE_SECTION: (section: string) => `/api/users/profile/sections/${section}`,
    PROFILE_BY_ACCOUNT_ID: (accountId: string) => `/api/users/profile/${accountId}`,
    UPDATE_PROFILE: '/api/users/profile',
    BASIC_DETAILS: '/api/users/basic-details',
    PROFILE_ACTIONS: '/api/users/profile-actions',
    PROFILE_ACTION_BY_TARGET: (targetUserId: string) => `/api/users/profile-actions/${targetUserId}`,
    MY_PROFILE_ACTIONS: '/api/users/my-profile-actions',
    RECEIVED_PROFILE_ACTIONS: '/api/users/received-profile-actions',
    MATCHES: '/api/users/matches',
    OPPOSITE_GENDER_PROFILES: '/api/users/opposite-gender-profiles',
    OPPOSITE_GENDER_PROFILES_BY_ID: (id: number) => `/api/users/opposite-gender-profiles/${id}`,
    UPLOAD_PHOTOS: '/api/users/photos',
    GET_PHOTOS: (personId: string | number) => `/api/users/photos/${personId}`,
    HOROSCOPE: '/api/users/horoscope',
    FAMILY: '/api/users/family',
    HOBBIES: '/api/users/hobbies',
    SEARCH: '/api/users/search',
    VIEW_PROFILE_DETAILS: '/api/users/profile/view-details',
    PARTNER_PREFERENCES: '/api/users/partner-preferences',
    PROFILE_DRAFT: '/api/users/profile/draft',
    PROFILE_VISIBILITY: '/api/users/profile/visibility',
    DELETE_PROFILE: '/api/users/profile',
    RECOMMENDATIONS: '/api/users/recommendations',
    RECOMMENDATION_ACTION: (id: number) => `/api/users/recommendations/${id}/action`,
    COMPATIBILITY: (accountId: string) => `/api/users/compatibility/${accountId}`,
    UNMATCH: (matchId: number) => `/api/users/matches/${matchId}/unmatch`,
    NOTIFICATIONS: {
      GET: '/api/notifications',
      READ: (id: string | number) => `/api/notifications/${id}/read`,
      READ_ALL: '/api/notifications/read-all',
    },
    // Safety & Abuse endpoints
    BLOCK_USER: '/api/users/block',
    BLOCKED_USERS: '/api/users/blocked-users',
    REPORT_USER: '/api/users/report',
    SAFETY_SETTINGS: '/api/users/safety-settings',
  },
  // Subscription (authenticated)
  SUBSCRIPTION: {
    STATUS: '/api/subscription/status',
    PURCHASE: '/api/subscription/purchase',
    CREATE_ORDER: '/api/subscription/create-order',
    VERIFY_PAYMENT: '/api/subscription/verify-payment',
    PAYMENT_FAILED: '/api/subscription/payment-failed',
    APPLY_COUPON: '/api/subscription/apply-coupon',
    TRANSACTIONS: '/api/subscription/transactions',
    REFERRAL: '/api/subscription/referral',
    REFERRAL_APPLY: '/api/subscription/referral/apply',
  },
  // Public settings
  SETTINGS: {
    REFERRAL: '/api/settings/referral',
  },
  // Messages (PostgreSQL - optional)
  MESSAGES: {
    CONVERSATIONS: '/api/messages/conversations',
    CONVERSATION_BY_ID: (id: number | string) => `/api/messages/conversations/${id}`,
    CONVERSATION_MESSAGES: (id: number | string) => `/api/messages/conversations/${id}`,
    SEND_MESSAGE: (conversationId: number | string) => `/api/messages/conversations/${conversationId}/messages`,
    MARK_READ: (conversationId: number | string, messageId: number | string) =>
      `/api/messages/conversations/${conversationId}/messages/${messageId}/read`,
  },
  // Chat (Firestore real-time)
  CHAT: {
    CONVERSATIONS: '/api/chat/conversations',
    CONVERSATION_READ: (id: string) => `/api/chat/conversations/${id}/read`,
    MESSAGES: '/api/chat/messages',
    BLOCK: (id: string) => `/api/chat/conversations/${id}/block`,
    UNBLOCK: (id: string) => `/api/chat/conversations/${id}/unblock`,
    REPORT: (id: string) => `/api/chat/conversations/${id}/report`,
    DELETE: (id: string) => `/api/chat/conversations/${id}`,
    UPLOAD_IMAGE: '/api/chat/upload-image',
  },
  // Device endpoints
  DEVICES: {
    STORE_FCM_TOKEN: '/api/devices/fcm-token',
  },
  // Public master endpoints (no authentication required)
  PUBLIC: {
    MASTER: (type: string) => `/api/masters/${type}`,
  },
  // Public CMS
  CMS: {
    PAGE: (slug: string) => `/api/cms/${slug}`,
    SUCCESS_STORIES: '/api/success-stories',
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
    NOTIFICATION_HISTORY: '/api/admin/notifications/history',
    NOTIFICATION_STATS: '/api/admin/notifications/stats',
    // Coupon endpoints
    COUPONS: '/api/admin/coupons',
    COUPON_BY_ID: (id: number) => `/api/admin/coupons/${id}`,
    COUPON_USAGE: (id: number) => `/api/admin/coupons/${id}/usage`,
    // Referral endpoints
    REFERRALS: '/api/admin/referrals',
    REFERRAL_STATS: '/api/admin/referrals/stats',
    // Settings endpoints
    SETTINGS: '/api/admin/settings',
    // Chat management endpoints
    CHAT_CONVERSATIONS: '/api/admin/chat/conversations',
    CHAT_CONVERSATION_MESSAGES: (id: string) => `/api/admin/chat/conversations/${id}/messages`,
    CHAT_REPORTS: '/api/admin/chat/reports',
    CHAT_REPORT_BY_ID: (id: number) => `/api/admin/chat/reports/${id}`,
    // Safety & Abuse admin endpoints
    REPORTS: '/api/admin/reports',
    REPORT_BY_ID: (id: number) => `/api/admin/reports/${id}`,
    FLAGGED_USERS: '/api/admin/flagged-users',
    FLAGGED_USER: (accountId: string) => `/api/admin/flagged-users/${accountId}`,
    BLOCKS: '/api/admin/blocks',
    ABUSE_STATS: '/api/admin/abuse-stats',
    // CMS admin endpoints
    CMS_PAGES: '/api/admin/cms',
    CMS_PAGE: (slug: string) => `/api/admin/cms/${slug}`,
    SUCCESS_STORIES_ADMIN: '/api/admin/success-stories',
    SUCCESS_STORY_BY_ID: (id: number) => `/api/admin/success-stories/${id}`,
  },
};

// Helper function to get full URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};


