import express from 'express';
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRelatedRecipes,
  getPopularRecipes,
  getRecentRecipes
} from '../controllers/recipeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Validation middleware
const validateRecipeInput = [
  body('title')
    .notEmpty().withMessage('Title is required.')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters.'),
  body('ingredients')
    .notEmpty().withMessage('Ingredients are required.'),
  body('instructions')
    .notEmpty().withMessage('Instructions are required.'),
  body('imageUrl')
    .optional()
    .isURL().withMessage('Image URL must be valid.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // Proceed if valid
  }
];
router.get('/', getRecipes);
router.post('/', protect, createRecipe);
router.get('/popular', getPopularRecipes);
router.get('/recent', getRecentRecipes);
router.get('/:id', getRecipeById);
router.put('/:id', protect, updateRecipe);
router.delete('/:id', protect, deleteRecipe);
router.get('/:id/related', getRelatedRecipes);

export default router;
