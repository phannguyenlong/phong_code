// src/services/user-service.js
import { api } from '../utils/api-utils';

/**
 * Service for user-related API calls
 */
class UserService {
  /**
   * Get current user profile
   * @returns {Promise} - Promise with user profile data
   */
  async getUserProfile() {
    return api.get('/api/users/profile');
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} - Promise with updated profile
   */
  async updateUserProfile(profileData) {
    return api.put('/api/users/profile', profileData);
  }

  /**
   * Get user's created recipes
   * @returns {Promise} - Promise with user's recipes
   */
  async getUserRecipes() {
    return api.get('/api/users/recipes');
  }

  /**
   * Get user's favorite recipes
   * @returns {Promise} - Promise with favorite recipes
   */
  async getUserFavorites() {
    return api.get('/api/users/favorites');
  }

  /**
   * Add a recipe to favorites
   * @param {string} recipeId - Recipe ID
   * @returns {Promise} - Promise with result
   */
  async addToFavorites(recipeId) {
    return api.post('/api/users/favorites', { recipeId });
  }

  /**
   * Remove a recipe from favorites
   * @param {string} recipeId - Recipe ID
   * @returns {Promise} - Promise with result
   */
  async removeFromFavorites(recipeId) {
    return api.delete(`/api/users/favorites/${recipeId}`);
  }

  /**
   * Get user's bookmarked recipes
   * @returns {Promise} - Promise with bookmarked recipes
   */
  async getUserBookmarks() {
    return api.get('/api/users/bookmarks');
  }

  /**
   * Add a recipe to bookmarks
   * @param {string} recipeId - Recipe ID
   * @returns {Promise} - Promise with result
   */
  async addToBookmarks(recipeId) {
    return api.post('/api/users/bookmarks', { recipeId });
  }

  /**
   * Remove a recipe from bookmarks
   * @param {string} recipeId - Recipe ID
   * @returns {Promise} - Promise with result
   */
  async removeFromBookmarks(recipeId) {
    return api.delete(`/api/users/bookmarks/${recipeId}`);
  }

  /**
   * Get user's reviews/comments
   * @returns {Promise} - Promise with user's reviews
   */
  async getUserReviews() {
    return api.get('/api/users/reviews');
  }

  /**
   * Delete user account
   * @param {string} password - User's password for verification
   * @returns {Promise} - Promise with deletion result
   */
  async deleteAccount(password) {
    try {
      const response = await api.delete('/api/users/profile', { 
        data: { password } 
      });
      return response;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  }
}

export default new UserService();