import Recipe from '../models/recipeModel.js';

// @desc    Search recipes
// @route   GET /api/search
// @access  Public
export const searchRecipes = async (req, res) => {
  try {
    const { q, withIngredients, withoutIngredients, category, cuisine, tags } = req.query;
    const pageSize = Number(req.query.limit) || 6;
    const page = Number(req.query.page) || 1;
    
    let query = { isPublic: true };
    
    // Text search
    if (q) {
      query.$text = { $search: q };
    }
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by cuisine
    if (cuisine) {
      query.cuisine = cuisine;
    }
    
    // Filter by tags
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }
    
    // Filter by ingredients to include
    if (withIngredients) {
      const ingredients = withIngredients.split(',');
      query['ingredients.name'] = { $in: ingredients.map(i => new RegExp(i.trim(), 'i')) };
    }
    
    // Filter by ingredients to exclude
    if (withoutIngredients) {
      const ingredients = withoutIngredients.split(',');
      query['ingredients.name'] = { 
        ...(query['ingredients.name'] || {}),
        $nin: ingredients.map(i => new RegExp(i.trim(), 'i')) 
      };
    }
    
    const count = await Recipe.countDocuments(query);
    const recipes = await Recipe.find(query)
      .populate('createdBy', 'username avatar')
      .sort({ rating: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    
    res.json({
      recipes,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get popular search terms
// @route   GET /api/search/popular
// @access  Public
export const getPopularSearches = async (req, res) => {
  try {
    // In a real app, this would come from analytics
    // For now, return static popular terms
    const popularSearches = [
      { id: 1, title: 'cucumber', imageUrl: 'https://img-global.cpcdn.com/recipes/036400bf6e807ce6/160x120cq50/photo.webp' },
      { id: 2, title: 'chicken thighs', imageUrl: 'https://img-global.cpcdn.com/recipes/953f1d23c28a5dea/160x120cq50/photo.webp' },
      { id: 3, title: 'ramen', imageUrl: 'https://img-global.cpcdn.com/recipes/812e3b5063299b1d/160x120cq50/photo.webp' },
      { id: 4, title: 'prawn', imageUrl: 'https://img-global.cpcdn.com/recipes/0fe8ee571c80fd2b/160x120cq50/photo.webp' }
    ];
    
    res.json(popularSearches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
