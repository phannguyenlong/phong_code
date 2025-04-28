// src/services/recipe-service.js
import { api } from '../utils/api-utils';

/**
 * Service for recipe-related API calls
 */
class RecipeService {
  /**
   * Get all recipes with optional filtering
   * @param {Object} params - Query parameters (page, keyword, category, etc)
   * @returns {Promise} - Promise with recipe data
   */
  async getRecipes(params = {}) {
    // Build query string from params
    const queryString = Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    const endpoint = `/api/recipes${queryString ? '?' + queryString : ''}`;
    return api.get(endpoint);
  }

  /**
   * Get a recipe by ID
   * @param {string} id - Recipe ID
   * @returns {Promise} - Promise with recipe data
   */
  async getRecipeById(id) {
    return api.get(`/api/recipes/${id}`);
  }

  /**
   * Create a new recipe
   * @param {Object} recipeData - Recipe data
   * @returns {Promise} - Promise with created recipe
   */
  async createRecipe(recipeData) {
    return api.post('/api/recipes', recipeData);
  }

  /**
   * Update a recipe
   * @param {string} id - Recipe ID
   * @param {Object} recipeData - Updated recipe data
   * @returns {Promise} - Promise with updated recipe
   */
  async updateRecipe(id, recipeData) {
    return api.put(`/api/recipes/${id}`, recipeData);
  }

  /**
   * Delete a recipe
   * @param {string} id - Recipe ID
   * @returns {Promise} - Promise with delete confirmation
   */
  async deleteRecipe(id) {
    return api.delete(`/api/recipes/${id}`);
  }

  /**
   * Get related recipes
   * @param {string} id - Recipe ID
   * @returns {Promise} - Promise with related recipes
   */
  async getRelatedRecipes(id) {
    return api.get(`/api/recipes/${id}/related`);
  }

  /**
   * Get popular recipes
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} - Promise with popular recipes and pagination info
   */
  async getPopularRecipes(params = {}) {
    const queryString = Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    const endpoint = `/api/recipes/popular${queryString ? '?' + queryString : ''}`;
    return api.get(endpoint);
  }

  /**
   * Get recent recipes
   * @returns {Promise} - Promise with recent recipes
   */
  async getRecentRecipes() {
    return api.get('/api/recipes/recent');
  }
}

export default new RecipeService();