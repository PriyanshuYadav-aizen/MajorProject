import axios from 'axios';

// Base URL for the backend API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors (e.g., token expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optional: Redirect to login page
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==========================================
// API Endpoints
// ==========================================

export const authAPI = {
  register: (email, password) => 
    api.post('/auth/register', { email, password }),
    
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
};

export const profileAPI = {
  getProfile: () => 
    api.get('/profile'),
    
  updateProfile: (profileData) => 
    api.put('/profile', profileData),
};

export const chatAPI = {
  sendMessage: (message) => 
    api.post('/chat/message', { message }),
    
  getChatHistory: () => 
    api.get('/chat/history'),
};

export default api;