import express from 'express';
import {
  getAllSeries, getSeriesBySlug, createSeries, updateSeries, deleteSeries,
  addImageToSeries, removeImageFromSeries, reorderSeriesImages
} from '../controllers/seriesController.js';
import { validateSeriesCreate, validateSeriesUpdate, validateSeriesReorder } from '../validators/seriesValidator.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { protect, adminOnly, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, getAllSeries);
router.get('/:slug', optionalAuth, getSeriesBySlug);

router.use(protect, adminOnly);
router.post('/', validateRequest(validateSeriesCreate), createSeries);
router.put('/:id', validateRequest(validateSeriesUpdate), updateSeries);
router.delete('/:id', deleteSeries);
router.post('/:id/images/:imageId', addImageToSeries);
router.delete('/:id/images/:imageId', removeImageFromSeries);
router.put('/:id/reorder', validateRequest(validateSeriesReorder), reorderSeriesImages);

export default router;
