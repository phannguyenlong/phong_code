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
   * @returns {Promise} - Promise with upload result
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
      
      return data;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
}

export default new UploadService();