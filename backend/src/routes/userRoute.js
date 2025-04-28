import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getUserRecipes,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  getUserBookmarks,
  addToBookmarks,
  removeFromBookmarks,
  getUserReviews
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/recipes', protect, getUserRecipes);

router.get('/favorites', protect, getUserFavorites);
router.post('/favorites', protect, addToFavorites);
router.delete('/favorites/:id', protect, removeFromFavorites);

router.get('/bookmarks', protect, getUserBookmarks);
router.post('/bookmarks', protect, addToBookmarks);
router.delete('/bookmarks/:id', protect, removeFromBookmarks);

router.get('/reviews', protect, getUserReviews);

export default router;