import express from 'express';
import { toggleFavoriteImage, getFavorites } from '../controllers/favoriteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getFavorites);
router.post('/images/:id', toggleFavoriteImage);

export default router;
