// src/services/auth-service.js
import { API_BASE_URL } from '../config';

/**
 * Service for authentication-related API calls
 */
class AuthService {
  /**
   * Attempt to log in a user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise} - Promise with the user data and token
   */
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token in localStorage for future requests
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          id: data._id,
          username: data.username,
          email: data.email
        }));
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {string} username - User's username
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise} - Promise with the registration result
   */
  async register(username, email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Automatically log in the user after registration
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          id: data._id,
          username: data.username,
          email: data.email
        }));
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Log out the current user
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Get the current authenticated user
   * @returns {Object|null} - User object or null if not logged in
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (e) {
        console.error('Error parsing user data:', e);
      return null;
    }
  }

  /**
   * Check if a user is logged in
   * @returns {boolean} - True if user is logged in
   */
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  /**
   * Get the authentication token
   * @returns {string|null} - The auth token or null
   */
  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();