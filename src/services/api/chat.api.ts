import { getApiUrl, API_ENDPOINTS } from '../../config/api.config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const getAdminAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ==================== USER CHAT APIs ====================

export const reportConversation = async (conversationId: string, reason: string, description?: string) => {
  const res = await fetch(getApiUrl(API_ENDPOINTS.CHAT.REPORT(conversationId)), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason, description }),
  });
  return res.json();
};

export const deleteConversation = async (conversationId: string) => {
  const res = await fetch(getApiUrl(API_ENDPOINTS.CHAT.DELETE(conversationId)), {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
};

export const uploadChatImage = async (image: string, conversationId: string) => {
  const res = await fetch(getApiUrl(API_ENDPOINTS.CHAT.UPLOAD_IMAGE), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ image, conversationId }),
  });
  return res.json();
};

export const sendMessage = async (conversationId: string, text: string, type = 'text', imageUrl?: string) => {
  const res = await fetch(getApiUrl(API_ENDPOINTS.CHAT.MESSAGES), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ conversationId, text, type, imageUrl }),
  });
  return res.json();
};

// ==================== ADMIN CHAT APIs ====================

export const getAdminConversations = async (params?: { limit?: number; startAfter?: string; search?: string }) => {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.startAfter) searchParams.set('startAfter', params.startAfter);
  if (params?.search) searchParams.set('search', params.search);
  
  const url = getApiUrl(API_ENDPOINTS.ADMIN.CHAT_CONVERSATIONS) + (searchParams.toString() ? `?${searchParams}` : '');
  const res = await fetch(url, {
    method: 'GET',
    headers: getAdminAuthHeaders(),
  });
  return res.json();
};

export const getAdminConversationMessages = async (conversationId: string, params?: { limit?: number; startAfter?: string }) => {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.startAfter) searchParams.set('startAfter', params.startAfter);

  const url = getApiUrl(API_ENDPOINTS.ADMIN.CHAT_CONVERSATION_MESSAGES(conversationId)) + (searchParams.toString() ? `?${searchParams}` : '');
  const res = await fetch(url, {
    method: 'GET',
    headers: getAdminAuthHeaders(),
  });
  return res.json();
};

export const getAdminChatReports = async (params?: { page?: number; limit?: number; status?: string; reason?: string }) => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.status) searchParams.set('status', params.status);
  if (params?.reason) searchParams.set('reason', params.reason);

  const url = getApiUrl(API_ENDPOINTS.ADMIN.CHAT_REPORTS) + (searchParams.toString() ? `?${searchParams}` : '');
  const res = await fetch(url, {
    method: 'GET',
    headers: getAdminAuthHeaders(),
  });
  return res.json();
};

export const updateAdminChatReport = async (reportId: number, data: { status?: string; adminNotes?: string }) => {
  const res = await fetch(getApiUrl(API_ENDPOINTS.ADMIN.CHAT_REPORT_BY_ID(reportId)), {
    method: 'PUT',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};
