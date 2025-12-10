import api from './api.js';

export const fetchTestimonials = async (limit = 10) => {
  const { data } = await api.get('/testimonials', { params: { limit } });
  return data.data.testimonials;
};

// ADMIN
export const createTestimonialAdmin = async (payload) => {
  const { data } = await api.post('/testimonials', payload);
  return data.data.testimonial;
};

export const updateTestimonialAdmin = async (id, payload) => {
  const { data } = await api.put(`/testimonials/${id}`, payload);
  return data.data.testimonial;
};

export const deleteTestimonialAdmin = async (id) => {
  const { data } = await api.delete(`/testimonials/${id}`);
  return data;
};
