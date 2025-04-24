// src/services/comment-service.js
import { api } from '../utils/api-utils';

/**
 * Service for comment-related API calls
 */
class CommentService {
  /**
   * Get comments for a recipe
   * @param {string} recipeId - Recipe ID
   * @returns {Promise} - Promise with comments data
   */
  async getRecipeComments(recipeId) {
    return api.get(`/api/comments/recipe/${recipeId}`);
  }

  /**
   * Create a new comment
   * @param {string} recipeId - Recipe ID
   * @param {string} content - Comment content
   * @param {number} rating - Rating (1-5)
   * @returns {Promise} - Promise with created comment
   */
  async createComment(recipeId, content, rating) {
    return api.post('/api/comments', {
      recipeId,
      content,
      rating
    });
  }

  /**
   * Update a comment
   * @param {string} commentId - Comment ID
   * @param {Object} updateData - Data to update (content, rating)
   * @returns {Promise} - Promise with updated comment
   */
  async updateComment(commentId, updateData) {
    return api.put(`/api/comments/${commentId}`, updateData);
  }

  /**
   * Delete a comment
   * @param {string} commentId - Comment ID
   * @returns {Promise} - Promise with delete confirmation
   */
  async deleteComment(commentId) {
    return api.delete(`/api/comments/${commentId}`);
  }
}

export default new CommentService();