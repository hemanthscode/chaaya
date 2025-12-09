import express from 'express';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../services/testimonialService.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { ApiError, sendSuccess } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const testimonials = await getTestimonials(parseInt(req.query.limit, 10));
  sendSuccess(res, { testimonials });
}));

router.use(protect, adminOnly);

router.post('/', asyncHandler(async (req, res) => {
  const testimonial = await createTestimonial(req.body);
  sendSuccess(res, { testimonial }, 'Testimonial created', STATUS_CODES.CREATED);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const testimonial = await updateTestimonial(req.params.id, req.body);
  sendSuccess(res, { testimonial }, 'Testimonial updated');
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  await deleteTestimonial(req.params.id);
  sendSuccess(res, null, 'Testimonial deleted');
}));

export default router;
