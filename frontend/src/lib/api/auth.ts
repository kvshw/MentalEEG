import api from './index';

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface UserProfile {
    id: string;
    username: string;
    email: string;
}

export const authApi = {
    login: async (credentials: LoginCredentials) => {
        const response = await api.post('/auth/token/', credentials);
        return response.data;
    },

    register: async (data: RegisterData) => {
        const response = await api.post('/auth/register/', data);
        return response.data;
    },

    logout: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            await api.post('/auth/logout/', { refresh_token: refreshToken });
        }
        return { success: true };
    },

    verifyToken: async (token: string) => {
        const response = await api.post('/auth/token/verify/', { token });
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get('/auth/profile/');
        return response.data;
    }
}; 