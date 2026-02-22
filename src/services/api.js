import axios from 'axios';
import { storage } from '../utils/storage';

// Replace with your local IP and port 5000 for physical device testing
export const BASE_URL = 'http://192.168.100.109:5000/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add token
api.interceptors.request.use(
    async (config) => {
        const token = await storage.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

// Response interceptor for logging
api.interceptors.response.use(
    (response) => {
        console.log(`[API Response] ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error(`[API Response Error] ${error.response?.status} ${error.config?.url}`, error.response?.data);
        return Promise.reject(error);
    }
);

export default api;
