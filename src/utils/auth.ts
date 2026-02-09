// Authentication utility functions

export interface AuthData {
  token: string;
  refreshToken: string;
  userId: number;
  accountId: string;
  userInfo?: any;
}

/**
 * Get authentication data from localStorage
 */
export const getAuthData = (): AuthData | null => {
  try {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const userId = localStorage.getItem('userId');
    const accountId = localStorage.getItem('accountId');
    const userInfo = localStorage.getItem('userInfo');

    if (!token) {
      return null;
    }

    return {
      token,
      refreshToken: refreshToken || '',
      userId: userId ? parseInt(userId, 10) : 0,
      accountId: accountId || '',
      userInfo: userInfo ? JSON.parse(userInfo) : null,
    };
  } catch (error) {
    console.error('Error getting auth data:', error);
    return null;
  }
};

/**
 * Set authentication data in localStorage
 */
export const setAuthData = (token: string, userId: number, accountId: string, userInfo?: any, refreshToken?: string): void => {
  try {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId.toString());
    localStorage.setItem('accountId', accountId);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  } catch (error) {
    console.error('Error setting auth data:', error);
  }
};

/**
 * Update only the tokens (used after refresh)
 */
export const updateTokens = (token: string, refreshToken: string): void => {
  try {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  } catch (error) {
    console.error('Error updating tokens:', error);
  }
};

/**
 * Clear authentication data from localStorage
 */
export const clearAuthData = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('accountId');
  localStorage.removeItem('userInfo');
  localStorage.removeItem('basicDetails');
  localStorage.removeItem('personalReligiousDetails');
  localStorage.removeItem('professionalDetails');
  localStorage.removeItem('registrationData');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const authData = getAuthData();
  return authData !== null && !!authData.token;
};

/**
 * Get authorization header for API requests
 */
export const getAuthHeader = (): { Authorization: string } | Record<string, never> => {
  const authData = getAuthData();
  if (authData && authData.token) {
    return { Authorization: `Bearer ${authData.token}` };
  }
  return {};
};


