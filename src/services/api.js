import axios from 'axios';
import { logoutGlobally } from '../utils/AuthContext';
import { storage } from '../utils/storage';

/**
 * MediCare API Service
 * 
 * Features:
 * - Dynamic Base URL via Expo Environment Variables
 * - JWT Authorization Interceptor
 * - Global 401 Unauthorized Handling (Auto-logout)
 * - Standardized Error Reporting
 */

// Priority: EXPO_PUBLIC_API_URL > Hardcoded fallback for local dev
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
    async (config) => {
        const token = await storage.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Auto-logout on 401 Unauthorized (Expired or invalid token)
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.warn('[API] Unauthorized detected. Clearing session.');
            await logoutGlobally();
        }

        return Promise.reject(error);
    }
);


/**
 * Centralized API Methods
 * No direct axios calls in UI components anymore.
 */
export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    signup: (userData) => api.post('/auth/signup', userData),
    getProfile: () => api.get('/auth/profile'),
};

export const appointmentService = {
    getAll: () => api.get('/appointments'),
    getUpcoming: () => api.get('/appointments/upcoming'),
    getHistory: () => api.get('/appointments/history'),
    book: (data) => api.post('/appointments/book', data),
    reschedule: (id, data) => api.put(`/appointments/reschedule/${id}`, data),
};

export const medicationService = {
    getAll: () => api.get('/medications'),
    add: (data) => api.post('/medications/add', data),
    updateAdherence: (id, data) => api.patch(`/medications/adherence/${id}`, data),
    toggleStatus: (id) => api.patch(`/medications/toggle/${id}`),
};

export const recordService = {
    getAll: () => api.get('/records'),
    add: (data) => api.post('/records/add', data),
};

export const insightService = {
    getDashboard: () => api.get('/insights'),
};

export const adminService = {
    getStats: () => api.get('/admin/stats'),
    getUsers: () => api.get('/admin/users'),
};

export default api;

