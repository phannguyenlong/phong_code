// src/utils/httpClient.js
import axios from 'axios';
import { API_BASE_URL } from '../config';
import authService from '../services/auth-service';

// Create axios instance with default config
const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
httpClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
httpClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { response } = error;
    
    // Handle unauthorized errors (401)
    if (response && response.status === 401) {
      // If the token is expired or invalid, log the user out
      if (authService.isLoggedIn()) {
        authService.logout();
        window.location.href = '/login';
      }
    }
    
    // Extract error message for better error handling
    const errorMessage = 
      (response && response.data && response.data.message) || 
      error.message || 
      'Something went wrong';
    
    return Promise.reject(new Error(errorMessage));
  }
);

export default httpClient;