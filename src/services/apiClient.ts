import { API_BASE_URL, API_ENDPOINTS, getApiUrl } from '../config/api.config';
import { getAuthData, updateTokens, clearAuthData } from '../utils/auth';

/**
 * Centralized API client with automatic token refresh and 401 handling.
 *
 * Usage:
 *   import { apiClient } from '../services/apiClient';
 *   const data = await apiClient.get('/api/users/me');
 *   const result = await apiClient.post('/api/users/profile', { name: 'Test' });
 */

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Attempt to refresh the access token using the stored refresh token.
 * Returns true on success, false on failure.
 */
const attemptTokenRefresh = async (): Promise<boolean> => {
  const authData = getAuthData();
  if (!authData?.refreshToken) {
    return false;
  }

  try {
    const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH.REFRESH_TOKEN), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: authData.refreshToken }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    if (data.success && data.data?.token && data.data?.refreshToken) {
      updateTokens(data.data.token, data.data.refreshToken);
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

/**
 * Deduplicated token refresh - ensures only one refresh request at a time.
 */
const refreshTokenOnce = async (): Promise<boolean> => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = attemptTokenRefresh().finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });

  return refreshPromise;
};

/**
 * Core fetch wrapper with auth headers and automatic retry on 401.
 */
const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
  retry = true
): Promise<Response> => {
  const authData = getAuthData();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (authData?.token) {
    headers['Authorization'] = `Bearer ${authData.token}`;
  }

  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  // On 401 Unauthorized, try to refresh the token and retry once
  if (response.status === 401 && retry) {
    const refreshed = await refreshTokenOnce();

    if (refreshed) {
      // Retry the request with the new token
      return fetchWithAuth(url, options, false);
    }

    // Refresh failed - clear auth data and redirect to login
    clearAuthData();
    window.location.href = '/login';
  }

  return response;
};

/**
 * Typed API client methods
 */
export const apiClient = {
  /**
   * GET request
   */
  get: async <T = any>(url: string, options?: RequestInit): Promise<T> => {
    const response = await fetchWithAuth(url, { ...options, method: 'GET' });
    return response.json();
  },

  /**
   * POST request
   */
  post: async <T = any>(url: string, body?: any, options?: RequestInit): Promise<T> => {
    const response = await fetchWithAuth(url, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
    return response.json();
  },

  /**
   * PUT request
   */
  put: async <T = any>(url: string, body?: any, options?: RequestInit): Promise<T> => {
    const response = await fetchWithAuth(url, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
    return response.json();
  },

  /**
   * PATCH request
   */
  patch: async <T = any>(url: string, body?: any, options?: RequestInit): Promise<T> => {
    const response = await fetchWithAuth(url, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
    return response.json();
  },

  /**
   * DELETE request
   */
  delete: async <T = any>(url: string, options?: RequestInit): Promise<T> => {
    const response = await fetchWithAuth(url, { ...options, method: 'DELETE' });
    return response.json();
  },

  /**
   * Upload (multipart form data) - does NOT set Content-Type header (let browser set boundary)
   */
  upload: async <T = any>(url: string, formData: FormData, options?: RequestInit): Promise<T> => {
    const authData = getAuthData();
    const headers: Record<string, string> = {};
    if (authData?.token) {
      headers['Authorization'] = `Bearer ${authData.token}`;
    }

    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

    const response = await fetch(fullUrl, {
      ...options,
      method: 'POST',
      headers,
      body: formData,
    });

    if (response.status === 401) {
      const refreshed = await refreshTokenOnce();
      if (refreshed) {
        const newAuthData = getAuthData();
        const retryHeaders: Record<string, string> = {};
        if (newAuthData?.token) {
          retryHeaders['Authorization'] = `Bearer ${newAuthData.token}`;
        }
        const retryResponse = await fetch(fullUrl, {
          ...options,
          method: 'POST',
          headers: retryHeaders,
          body: formData,
        });
        return retryResponse.json();
      }
      clearAuthData();
      window.location.href = '/login';
    }

    return response.json();
  },

  /**
   * Raw fetch with auth - returns Response directly for custom handling
   */
  raw: fetchWithAuth,
};

export default apiClient;
