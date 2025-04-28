// src/services/category-service.js
import { api } from '../utils/api-utils';

/**
 * Service for category-related API calls
 */
class CategoryService {
  /**
   * Get all categories
   * @returns {Promise} - Promise with categories data
   */
  async getCategories() {
    return api.get('/api/categories');
  }

  /**
   * Get recipes by category
   * @param {string} categoryId - Category ID
   * @returns {Promise} - Promise with recipes in the category
   */
  async getCategoryRecipes(categoryId) {
    return api.get(`/api/categories/${categoryId}/recipes`);
  }

  /**
   * Create a new category (admin only)
   * @param {Object} categoryData - Category data
   * @param {string} categoryData.name - Category name
   * @param {string} categoryData.description - Category description
   * @param {string} categoryData.image - Category image URL
   * @returns {Promise} - Promise with created category
   */
  async createCategory(categoryData) {
    return api.post('/api/categories', categoryData);
  }
}

export default new CategoryService();