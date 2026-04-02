import axios from 'axios';

// Instance for IdentityService (Auth/Roles) - Port 7068
export const authApi = axios.create({
    baseURL: 'https://localhost:7068',
    headers: { 'Content-Type': 'application/json' }
});

// Instance for SignatureService (Verification) - Port 7025
export const signatureApi = axios.create({
    baseURL: 'https://localhost:7025',
    headers: { 'Content-Type': 'application/json' }
});

// Interceptor to automatically add JWT Token to requests
const addTokenToRequest = (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

authApi.interceptors.request.use(addTokenToRequest);
signatureApi.interceptors.request.use(addTokenToRequest);
