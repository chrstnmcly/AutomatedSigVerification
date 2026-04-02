import { authApi } from './axiosConfig';

export const signatureService = {
    uploadSignatures: async (username, base64Array) => {
        try {
            const response = await authApi.post(`/api/users/${username}/signatures`, base64Array);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to link signatures";
        }
    },

    //resgiter customers
    registerAccount: async (accountData) => {
        const response = await authApi.post('/api/account-holders', accountData);
        return response.data;
    },

}
