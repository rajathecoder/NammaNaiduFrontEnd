import { getApiUrl, API_ENDPOINTS } from '../../config/api.config';

export type MasterType =
  | 'religion'
  | 'caste'
  | 'occupation'
  | 'location'
  | 'education'
  | 'employment-type'
  | 'income-currency'
  | 'income-range';

export interface MasterItem {
  id: number;
  type: MasterType;
  name: string;
  code?: string;
  parentId?: number;
  status: 'active' | 'inactive';
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMasterPayload {
  name: string;
  code?: string;
  parentId?: number;
  status?: 'active' | 'inactive';
  order?: number;
}

// Get all masters by type (public endpoint - no auth required)
export const getMastersByType = async (
  type: MasterType,
  status?: 'active' | 'inactive',
  token?: string
): Promise<{ success: boolean; data: MasterItem[]; message: string }> => {
  // Use public endpoint if no token is provided (for registration flow)
  // Otherwise use admin endpoint
  const endpoint = token 
    ? API_ENDPOINTS.ADMIN.MASTER(type)
    : API_ENDPOINTS.PUBLIC.MASTER(type);
  
  const url = getApiUrl(endpoint);
  const queryParams = status ? `?status=${status}` : '';
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${url}${queryParams}`, {
    method: 'GET',
    headers,
  });
  return response.json();
};

// Get single master by ID
export const getMasterById = async (
  type: MasterType,
  id: number
): Promise<{ success: boolean; data: MasterItem; message: string }> => {
  const url = getApiUrl(API_ENDPOINTS.ADMIN.MASTER_BY_ID(type, id));
  const response = await fetch(url);
  return response.json();
};

// Create new master
export const createMaster = async (
  type: MasterType,
  payload: CreateMasterPayload,
  token?: string
): Promise<{ success: boolean; data: MasterItem; message: string }> => {
  const url = getApiUrl(API_ENDPOINTS.ADMIN.MASTER(type));
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

// Update master
export const updateMaster = async (
  type: MasterType,
  id: number,
  payload: Partial<CreateMasterPayload>,
  token?: string
): Promise<{ success: boolean; data: MasterItem; message: string }> => {
  const url = getApiUrl(API_ENDPOINTS.ADMIN.MASTER_BY_ID(type, id));
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

// Delete master
export const deleteMaster = async (
  type: MasterType,
  id: number,
  token?: string
): Promise<{ success: boolean; message: string }> => {
  const url = getApiUrl(API_ENDPOINTS.ADMIN.MASTER_BY_ID(type, id));
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



