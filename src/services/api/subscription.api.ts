import { getApiUrl, API_ENDPOINTS } from '../../config/api.config';

// ==================== TYPES ====================

export interface SubscriptionPlan {
  id: number;
  planType: 'months' | 'year';
  planName: string;
  category: 'Male' | 'Female' | 'Both';
  amount: number;
  offerAmount: number;
  maxProfile: number;
  contactNoView: number;
  validMonth: number;
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface SubscriptionTransaction {
  id: number;
  paymentId: string;
  userId: number;
  userName: string;
  userCode: string;
  amount: number;
  planType: string;
  planName: string;
  date: string;
  status: 'success' | 'pending' | 'failed';
  paymentMethod: string;
  paymentGateway?: string;
  transactionId?: string;
}

export interface CreatePlanPayload {
  planType: 'months' | 'year';
  planName: string;
  category: 'Male' | 'Female' | 'Both';
  amount: number;
  offerAmount: number;
  maxProfile: number;
  contactNoView: number;
  validMonth: number;
  status?: 'active' | 'inactive';
}

export interface UpdatePlanPayload extends Partial<CreatePlanPayload> { }

export interface TransactionFilters {
  status?: 'success' | 'pending' | 'failed';
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
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

// ==================== SUBSCRIPTION PLANS API ====================

// Get all subscription plans (Public - no authentication required)
export const getSubscriptionPlans = async (
  filters?: { status?: 'active' | 'inactive'; planType?: 'months' | 'year' },
  token?: string
): Promise<{ success: boolean; data: SubscriptionPlan[]; message: string }> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.planType) params.append('planType', filters.planType);

  // Use public endpoint for user-facing pages
  const url = getApiUrl('/api/plans');
  const queryString = params.toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Token is optional for public endpoint, but can be included if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers,
  });

  return response.json();
};

// Get all subscription plans (Admin - requires admin authentication)
export const getAdminSubscriptionPlans = async (
  filters?: { status?: 'active' | 'inactive'; planType?: 'months' | 'year' },
  token?: string
): Promise<{ success: boolean; data: SubscriptionPlan[]; message: string }> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.planType) params.append('planType', filters.planType);

  const url = getApiUrl(API_ENDPOINTS.ADMIN.SUBSCRIPTION_PLANS);
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

// Get single subscription plan by ID
export const getSubscriptionPlanById = async (
  id: number,
  token?: string
): Promise<{ success: boolean; data: SubscriptionPlan; message: string }> => {
  const url = getApiUrl(API_ENDPOINTS.ADMIN.SUBSCRIPTION_PLAN_BY_ID(id));
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

// Create new subscription plan
export const createSubscriptionPlan = async (
  payload: CreatePlanPayload,
  token?: string
): Promise<{ success: boolean; data: SubscriptionPlan; message: string }> => {
  const url = getApiUrl(API_ENDPOINTS.ADMIN.SUBSCRIPTION_PLANS);
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

// Update subscription plan
export const updateSubscriptionPlan = async (
  id: number,
  payload: UpdatePlanPayload,
  token?: string
): Promise<{ success: boolean; data: SubscriptionPlan; message: string }> => {
  const url = getApiUrl(API_ENDPOINTS.ADMIN.SUBSCRIPTION_PLAN_BY_ID(id));
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

// Delete subscription plan
export const deleteSubscriptionPlan = async (
  id: number,
  token?: string
): Promise<{ success: boolean; message: string }> => {
  const url = getApiUrl(API_ENDPOINTS.ADMIN.SUBSCRIPTION_PLAN_BY_ID(id));
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'DELETE',
    headers,
  });

  return response.json();
};

// ==================== SUBSCRIPTION TRANSACTIONS API ====================

// Get all subscription transactions
export const getSubscriptionTransactions = async (
  filters?: TransactionFilters,
  token?: string
): Promise<{
  success: boolean;
  data: SubscriptionTransaction[];
  pagination: PaginationInfo;
  message: string;
}> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.paymentMethod) params.append('paymentMethod', filters.paymentMethod);
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const url = getApiUrl(API_ENDPOINTS.ADMIN.SUBSCRIPTION_TRANSACTIONS);
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

// Get single transaction by ID
export const getSubscriptionTransactionById = async (
  id: number,
  token?: string
): Promise<{ success: boolean; data: SubscriptionTransaction; message: string }> => {
  const url = getApiUrl(API_ENDPOINTS.ADMIN.SUBSCRIPTION_TRANSACTION_BY_ID(id));
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

// Export transactions (CSV)
export const exportSubscriptionTransactions = async (
  filters?: TransactionFilters,
  token?: string
): Promise<Blob> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.paymentMethod) params.append('paymentMethod', filters.paymentMethod);
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);
  if (filters?.search) params.append('search', filters.search);

  const url = getApiUrl(API_ENDPOINTS.ADMIN.SUBSCRIPTION_TRANSACTIONS_EXPORT);
  const queryString = params.toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;

  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers,
  });

  return response.blob();
};

// Purchase subscription (Mock - legacy)
export const purchaseSubscription = async (
  planId: number,
  token: string
): Promise<{ success: boolean; message: string; data?: any }> => {
  const url = getApiUrl('/api/subscription/purchase');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ planId })
  });

  return response.json();
};

// ==================== RAZORPAY PAYMENT FLOW ====================

export const createRazorpayOrder = async (
  planId: number,
  couponCode?: string,
  token?: string
): Promise<{ success: boolean; data?: any; message?: string }> => {
  const url = getApiUrl(API_ENDPOINTS.SUBSCRIPTION.CREATE_ORDER);
  const body: any = { planId };
  if (couponCode) body.couponCode = couponCode;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  return response.json();
};

export const verifyRazorpayPayment = async (
  payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    transactionId: number;
  },
  token?: string
): Promise<{ success: boolean; message?: string; data?: any }> => {
  const url = getApiUrl(API_ENDPOINTS.SUBSCRIPTION.VERIFY_PAYMENT);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  return response.json();
};

export const reportPaymentFailed = async (
  payload: { razorpay_order_id: string; transactionId: number; error?: any },
  token?: string
): Promise<{ success: boolean; message?: string }> => {
  const url = getApiUrl(API_ENDPOINTS.SUBSCRIPTION.PAYMENT_FAILED);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  return response.json();
};

export const applyCoupon = async (
  couponCode: string,
  planId: number,
  token?: string
): Promise<{ success: boolean; data?: any; message?: string }> => {
  const url = getApiUrl(API_ENDPOINTS.SUBSCRIPTION.APPLY_COUPON);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ couponCode, planId }),
  });
  return response.json();
};

// ==================== REFERRAL API ====================

export const getReferralInfo = async (
  token: string
): Promise<{ success: boolean; data?: any; message?: string }> => {
  const url = getApiUrl(API_ENDPOINTS.SUBSCRIPTION.REFERRAL);
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const applyReferralCode = async (
  referralCode: string,
  token: string
): Promise<{ success: boolean; data?: any; message?: string }> => {
  const url = getApiUrl(API_ENDPOINTS.SUBSCRIPTION.REFERRAL_APPLY);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ referralCode }),
  });
  return response.json();
};

// ==================== ADMIN COUPON API ====================

export const getAdminCoupons = async (
  token: string
): Promise<{ success: boolean; data?: any; message?: string }> => {
  const url = getApiUrl(API_ENDPOINTS.ADMIN.COUPONS);
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const createAdminCoupon = async (
  payload: any,
  token: string
): Promise<{ success: boolean; data?: any; message?: string }> => {
  const url = getApiUrl(API_ENDPOINTS.ADMIN.COUPONS);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return response.json();
};

export const updateAdminCoupon = async (
  id: number,
  payload: any,
  token: string
): Promise<{ success: boolean; data?: any; message?: string }> => {
  const url = getApiUrl(API_ENDPOINTS.ADMIN.COUPON_BY_ID(id));
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return response.json();
};

export const deleteAdminCoupon = async (
  id: number,
  token: string
): Promise<{ success: boolean; message?: string }> => {
  const url = getApiUrl(API_ENDPOINTS.ADMIN.COUPON_BY_ID(id));
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const getAdminCouponUsage = async (
  id: number,
  token: string
): Promise<{ success: boolean; data?: any; message?: string }> => {
  const url = getApiUrl(API_ENDPOINTS.ADMIN.COUPON_USAGE(id));
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// ==================== ADMIN REFERRAL API ====================

export const getAdminReferrals = async (
  token: string
): Promise<{ success: boolean; data?: any; message?: string }> => {
  const url = getApiUrl(API_ENDPOINTS.ADMIN.REFERRALS);
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const getAdminReferralStats = async (
  token: string
): Promise<{ success: boolean; data?: any; message?: string }> => {
  const url = getApiUrl(API_ENDPOINTS.ADMIN.REFERRAL_STATS);
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// ==================== ADMIN SETTINGS API ====================

export const getAdminSettings = async (
  token: string
): Promise<{ success: boolean; data?: any; raw?: any; message?: string }> => {
  const url = getApiUrl(API_ENDPOINTS.ADMIN.SETTINGS);
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const updateAdminSettings = async (
  payload: Record<string, string>,
  token: string
): Promise<{ success: boolean; data?: any; message?: string }> => {
  const url = getApiUrl(API_ENDPOINTS.ADMIN.SETTINGS);
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return response.json();
};


