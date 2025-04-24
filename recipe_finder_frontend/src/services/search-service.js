// src/services/search-service.js
import { api } from '../utils/api-utils';

/**
 * Service for search-related API calls
 */
class SearchService {
  /**
   * Search for recipes
   * @param {Object} params - Search parameters
   * @param {string} params.q - Search query
   * @param {string} params.withIngredients - Comma-separated ingredients to include
   * @param {string} params.withoutIngredients - Comma-separated ingredients to exclude
   * @param {string} params.category - Recipe category
   * @param {string} params.cuisine - Recipe cuisine
   * @param {string} params.tags - Comma-separated tags
   * @returns {Promise} - Promise with search results
   */
  async searchRecipes(params = {}) {
    // Build query string from params
    const queryString = Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    const endpoint = `/api/search${queryString ? '?' + queryString : ''}`;
    return api.get(endpoint);
  }

  /**
   * Get popular search terms
   * @returns {Promise} - Promise with popular search terms
   */
  async getPopularSearches() {
    return api.get('/api/search/popular');
  }
}

export default new SearchService();