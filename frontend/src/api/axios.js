import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dispatch_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global 401 handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear expired token if 401 occurs on protected endpoints
      const isAuthEndpoint = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthEndpoint) {
        localStorage.removeItem('dispatch_token');
        localStorage.removeItem('dispatch_user');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
