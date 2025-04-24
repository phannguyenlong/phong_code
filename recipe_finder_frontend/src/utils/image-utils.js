// src/utils/image-utils.js
import { API_BASE_URL } from '../config';

/**
 * Utility functions for handling images
 */
const imageUtils = {
  /**
   * Get full image URL from relative path
   * @param {string} path - Relative image path
   * @returns {string} - Full image URL
   */
  getFullImageUrl(path) {
    if (!path) return '';
    
    // If it's already a full URL, return as is
    if (path.startsWith('http')) {
      return path;
    }
    
    // Ensure path starts with a slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    return `${API_BASE_URL}${normalizedPath}`;
  },
  
  /**
   * Fallback image URL if the main one fails
   */
  fallbackImage: 'https://via.placeholder.com/400x400?text=No+Image'
};

export default imageUtils;