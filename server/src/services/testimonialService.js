import Testimonial from '../models/Testimonial.js';
import { ApiError } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';

export const getTestimonials = async (limit = 6, featured = true) => {
  const query = featured ? { featured: true, status: 'published' } : { status: 'published' };
  return await Testimonial.find(query)
    .sort({ featured: -1, createdAt: -1 })
    .limit(limit)
    .lean();
};

export const createTestimonial = async (data) => {
  return await Testimonial.create(data);
};

export const updateTestimonial = async (id, data) => {
  const testimonial = await Testimonial.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!testimonial) throw new ApiError(STATUS_CODES.NOT_FOUND, 'Testimonial not found');
  return testimonial;
};

export const deleteTestimonial = async (id) => {
  const testimonial = await Testimonial.findByIdAndDelete(id);
  if (!testimonial) throw new ApiError(STATUS_CODES.NOT_FOUND, 'Testimonial not found');
  return testimonial;
};

export default { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
