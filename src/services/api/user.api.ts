import { getApiUrl, API_ENDPOINTS } from '../../config/api.config';

export interface UserProfile {
  id: number;
  accountId: string;
  name: string;
  email?: string;
  phone: string;
  gender?: string;
  userCode: string;
  basicDetail?: BasicDetail;
  [key: string]: any;
}

export interface BasicDetail {
  id: number;
  accountId: string;
  dateOfBirth?: string;
  height?: string;
  physicalStatus?: string;
  maritalStatus?: string;
  religion?: string;
  caste?: string;
  subcaste?: string;
  country?: string;
  state?: string;
  city?: string;
  education?: string;
  occupation?: string;
  annualIncome?: string;
  [key: string]: any;
}

export interface OppositeGenderProfilesResponse {
  success: boolean;
  count: number;
  currentUserGender: string;
  oppositeGender: string;
  data: UserProfile[];
  message?: string;
}

// Get opposite gender profiles
export const getOppositeGenderProfiles = async (
  token: string,
  userId?: number
): Promise<OppositeGenderProfilesResponse> => {
  const endpoint = userId 
    ? API_ENDPOINTS.USERS.OPPOSITE_GENDER_PROFILES_BY_ID(userId)
    : API_ENDPOINTS.USERS.OPPOSITE_GENDER_PROFILES;
  
  const url = getApiUrl(endpoint);
  console.log('Calling API:', url);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  console.log('API Response status:', response.status, response.statusText);

  if (!response.ok) {
    let errorMessage = 'Failed to fetch opposite gender profiles';
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
      console.error('API Error:', error);
    } catch (parseError) {
      console.error('Failed to parse error response:', parseError);
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  console.log('API Response data:', { 
    success: data.success, 
    count: data.count,
    hasData: !!data.data 
  });
  return data;
};

// Get user profile (current user)
export const getUserProfile = async (
  token: string
): Promise<{ success: boolean; data: UserProfile }> => {
  const url = getApiUrl(API_ENDPOINTS.USERS.PROFILE);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch user profile');
  }

  return response.json();
};

// Get user profile by accountId (for viewing other users' profiles)
export const getUserProfileByAccountId = async (
  token: string,
  accountId: string
): Promise<{ success: boolean; data: UserProfile }> => {
  const url = getApiUrl(API_ENDPOINTS.USERS.PROFILE_BY_ACCOUNT_ID(accountId));
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch user profile');
  }

  return response.json();
};

