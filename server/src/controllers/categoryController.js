import Category from '../models/categoryModel.js';
import Recipe from '../models/recipeModel.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recipes by category
// @route   GET /api/categories/:id/recipes
// @access  Public
export const getCategoryRecipes = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const recipes = await Recipe.find({ 
      category: category.name,
      isPublic: true
    })
      .populate('createdBy', 'username avatar')
      .sort({ createdAt: -1 });
    
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a category (admin only)
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    
    const categoryExists = await Category.findOne({ name });
    
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    
    const category = new Category({
      name,
      description,
      image
    });
    
    const createdCategory = await category.save();
    
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};