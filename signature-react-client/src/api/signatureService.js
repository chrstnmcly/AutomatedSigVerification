import { authApi } from './axiosConfig';

export const signatureService = {
    uploadSignatures: async (username, base64Array) => {
        try {
            const response = await authApi.post(`/api/signature/${username}/signatures`, base64Array);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to link signatures";
        }
    },

    registerAccount: async (accountData) => {
        try {
            const response = await authApi.post('/api/signature', accountData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Customer registration failed";
        }
    },

    verifySignature: async (accountNumber, newSignatureBase64) => {
        try {
            const response = await authApi.post('/api/verification/verify', {
                accountNumber,
                newSignatureBase64
            });
            return response.data; 
        } catch (error) {
            throw error.response?.data?.message || "Verification engine error";
        }
    }
};
