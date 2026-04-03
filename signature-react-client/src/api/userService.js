import { authApi } from './axiosConfig';

export const userService = {
    getAllUsers: async () => {
        try {
            const response = await authApi.get('/api/users');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch users';
        }
    },

    deleteUser: async (username) => {
        try {
            const response = await authApi.delete(`/api/users/${username}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || `Failed to delete user ${username}`;
        }
    },

    updateUserRole: async (username, newRole) => {
        try {
            const response = await authApi.put(`/api/users/${username}/role`, {
                roleName: newRole
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || `Failed to update role for ${username}`;
        }
    },

    updateUserStatus: async (username, isActive) => {
        try {
            const response = await authApi.put(`/api/users/${username}/status`, {
                isActive: isActive
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || `Failed to update status for ${username}`;
        }
    },

    //get all customer accounts
    getAllAccounts: async () => {
        try {
            const response = await authApi.get('/api/signature/getAllAccounts');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to fetch account holders";
        }
    },

    //search account holders
    searchAccountHolders: async (query) => {
        try {
            const response = await authApi.get(`/api/users/search?query=${query}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Search failed";
        }
    }
};
