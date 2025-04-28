import express from 'express';
import { searchRecipes, getPopularSearches } from '../controllers/searchController.js';

const router = express.Router();

router.get('/', searchRecipes);
router.get('/popular', getPopularSearches);

export default router;