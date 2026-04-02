import { authApi } from './axiosConfig';

export const authService = {
    login: async (credentials) => {
        try {
            const response = await authApi.post('/api/auth/login', credentials);
            const { token, role, username } = response.data;

            sessionStorage.setItem('token', token);
            sessionStorage.setItem('role', role);
            sessionStorage.setItem('username', username);

            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Authentication failed';
        }
    },

    //register user for admin
    register: async (userData) => {
        try {
            const payload = {
                username: userData.username,
                passwordHash: "P@ssword123", 
                roleName: userData.roleName,
                isActive: true
            };
            const response = await authApi.post('/api/auth/register', payload);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
            throw errorMessage;
        }
    },

    logout: () => {
        sessionStorage.clear();
        window.location.href = '/login';
    },

    getCurrentUser: () => {
        return {
            token: sessionStorage.getItem('token'),
            role: sessionStorage.getItem('role'),
            username: sessionStorage.getItem('username'),
        };
    }
};
