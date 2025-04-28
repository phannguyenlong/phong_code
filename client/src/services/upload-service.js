// src/services/upload-service.js
import { API_BASE_URL } from '../config';
import authService from './auth-service';

/**
 * Service for file upload API calls
 */
class UploadService {
  /**
   * Upload an image file
   * @param {File} imageFile - The image file to upload
   * @returns {Promise} - Promise with upload result including full image URL
   */
  async uploadImage(imageFile) {
    if (!imageFile) {
      throw new Error('No file provided');
    }
    
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('Authentication required for upload');
    }
    
    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }
      
      // Make sure the imageUrl is a full URL by prepending API_BASE_URL if needed
      if (data.imageUrl && data.imageUrl.startsWith('/')) {
        data.imageUrl = `${API_BASE_URL}${data.imageUrl}`;
      }
      
      return data;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  /**
   * Get complete image URL 
   * @param {string} relativePath - The relative image path
   * @returns {string} - Complete image URL
   */
  getImageUrl(relativePath) {
    if (!relativePath) return '';
    
    // If the path is already a full URL, return it as is
    if (relativePath.startsWith('http')) {
      return relativePath;
    }
    
    // Make sure the path starts with a slash
    const normalizedPath = relativePath.startsWith('/') 
      ? relativePath 
      : `/${relativePath}`;
    
    return `${API_BASE_URL}${normalizedPath}`;
  }
}

export default new UploadService();