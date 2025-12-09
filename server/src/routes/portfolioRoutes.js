import express from 'express';
import { getHomepage, getAbout, getRandom, getRelated, getSitemap, getRobots } from '../controllers/portfolioController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/home', optionalAuth, getHomepage);
router.get('/about', optionalAuth, getAbout);
router.get('/random', optionalAuth, getRandom);
router.get('/related/:id', optionalAuth, getRelated);
router.get('/sitemap', getSitemap);
router.get('/robots.txt', getRobots);

export default router;
