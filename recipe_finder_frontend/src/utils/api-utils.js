// src/utils/api-utils.js
import authService from '../services/auth-service';
import { API_BASE_URL } from '../config';

/**
 * Make authenticated API requests
 */
export const api = {
  /**
   * GET request with auth token
   * @param {string} endpoint - API endpoint (without base URL)
   * @returns {Promise} - Response data
   */
  async get(endpoint) {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  },

  /**
   * POST request with auth token
   * @param {string} endpoint - API endpoint (without base URL)
   * @param {object} body - Request body
   * @returns {Promise} - Response data
   */
  async post(endpoint, body) {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  },

  /**
   * PUT request with auth token
   * @param {string} endpoint - API endpoint (without base URL)
   * @param {object} body - Request body
   * @returns {Promise} - Response data
   */
  async put(endpoint, body) {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  },

  /**
   * DELETE request with auth token
   * @param {string} endpoint - API endpoint (without base URL)
   * @returns {Promise} - Response data
   */
  async delete(endpoint) {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  },
};