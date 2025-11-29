import axios from 'axios';

// API base URL - change this to your backend URL
const API_BASE_URL = __DEV__
  ? 'http://localhost:8080' // Development
  : 'https://airbnb-sesame-keypad.onrender.com'; // Production

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CheckPinResponse {
  ok: boolean;
  mode?: 'admin' | 'guest';
  message?: string;
  error?: string;
}

export interface Pin {
  id: number;
  code: string;
  type: 'reservation' | 'temporary' | 'permanent';
  reservation_id?: string;
  starts_at?: number;
  ends_at?: number;
  label?: string;
  created_at: number;
}

export interface PinsListResponse {
  ok: boolean;
  pins: Pin[];
  error?: string;
}

export interface CreatePinRequest {
  code?: string;
  type: 'temporary' | 'permanent';
  starts_at?: number;
  ends_at?: number;
  label?: string;
  phone?: string;
}

export interface CreatePinResponse {
  ok: boolean;
  pin?: Pin;
  error?: string;
}

export const apiService = {
  checkPin: async (code: string): Promise<CheckPinResponse> => {
    try {
      const response = await api.post<CheckPinResponse>('/api/check-pin', { code });
      return response.data;
    } catch (error: any) {
      return {
        ok: false,
        error: error.response?.data?.error || 'Network error',
      };
    }
  },

  getPins: async (adminToken: string): Promise<PinsListResponse> => {
    try {
      const response = await api.get<PinsListResponse>('/api/admin/pins', {
        headers: {
          'x-admin-token': adminToken,
        },
      });
      return response.data;
    } catch (error: any) {
      return {
        ok: false,
        pins: [],
        error: error.response?.data?.error || 'Network error',
      };
    }
  },

  createPin: async (
    adminToken: string,
    pinData: CreatePinRequest
  ): Promise<CreatePinResponse> => {
    try {
      const response = await api.post<CreatePinResponse>(
        '/api/admin/pins',
        pinData,
        {
          headers: {
            'x-admin-token': adminToken,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return {
        ok: false,
        error: error.response?.data?.error || 'Network error',
      };
    }
  },

  deletePin: async (adminToken: string, pinId: number): Promise<{ ok: boolean }> => {
    try {
      const response = await api.delete(`/api/admin/pins/${pinId}`, {
        headers: {
          'x-admin-token': adminToken,
        },
      });
      return response.data;
    } catch {
      return { ok: false };
    }
  },
};

export default apiService;

