// src/services/images.js
import api from './api.js';

export const fetchImages = async (params = {}) => {
  const { page = 1, limit = 12, category, series, status, q } = params;

  const { data } = await api.get('/images', {
    params: { page, limit, category, series, status, q }
  });

  // API: { success, message, data: { images: [...] }, pagination: {...} }
  const images = data.data?.images || [];
  const pagination = data.pagination || null;

  return { items: images, pagination };
};

export const fetchImagesBySeries = async (slug) => {
  const { data } = await api.get(`/images/series/${slug}`);
  // Backend: { data: { images: [...], series: {...} } }
  return data.data?.images || [];
};

export const fetchFeaturedImages = async (limit = 8) => {
  const { data } = await api.get('/images/featured', { params: { limit } });
  // API: { data: { images: [...] } }
  return data.data?.images || [];
};

export const searchImages = async ({ q, page = 1, limit = 12 }) => {
  const { data } = await api.get('/images/search', { params: { q, page, limit } });
  // API: { data: { images, query }, pagination }
  return {
    items: data.data?.images || [],
    query: data.data?.query || '',
    pagination: data.pagination || null
  };
};

export const fetchImageById = async (id) => {
  const { data } = await api.get(`/images/${id}`);
  return data.data.image;
};

export const toggleLikeImage = async (id) => {
  const { data } = await api.post(`/images/${id}/like`);
  return data.data;
};

// ADMIN
export const updateImageAdmin = async (id, payload) => {
  const { data } = await api.put(`/images/${id}`, payload);
  return data.data.image;
};

export const deleteImageAdmin = async (id) => {
  const { data } = await api.delete(`/images/${id}`);
  return data;
};
