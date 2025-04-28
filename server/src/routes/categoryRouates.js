import express from 'express';
import { 
  getCategories, 
  getCategoryRecipes,
  createCategory 
} from '../controllers/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:id/recipes', getCategoryRecipes);
router.post('/', protect, createCategory); // In a real app, would add admin middleware

export default router;
