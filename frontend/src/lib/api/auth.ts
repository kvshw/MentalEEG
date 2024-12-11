import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  password2: string;
  email: string;
  first_name: string;
  last_name: string;
  employee_id: string;
  department: string;
  role: string;
}

export interface AuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    employee_id: string;
    department: string;
    role: string;
  };
  access: string;
  refresh: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/users/token/`, credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/users/register/`, data);
    return response.data;
  },

  getProfile: async (token: string) => {
    const response = await axios.get(`${API_URL}/users/profile/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  refreshToken: async (refresh: string) => {
    const response = await axios.post(`${API_URL}/users/token/refresh/`, {
      refresh,
    });
    return response.data;
  },
}; 