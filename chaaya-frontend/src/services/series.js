// src/services/series.js
import api from './api.js';

export const fetchSeries = async (params = {}) => {
  const { page = 1, limit = 12, status, featured } = params;
  const { data } = await api.get('/series', { params: { page, limit, status, featured } });
  return {
    items: data.data?.series || [],
    pagination: data.pagination || null
  };
};

export const fetchSeriesBySlug = async (slug) => {
  const { data } = await api.get(`/series/${slug}`);
  return data.data.series;
};

// ADMIN
export const createSeriesAdmin = async (payload) => {
  const { data } = await api.post('/series', payload);
  return data.data.series;
};

export const updateSeriesAdmin = async (id, payload) => {
  const { data } = await api.put(`/series/${id}`, payload);
  return data.data.series;
};

export const deleteSeriesAdmin = async (id) => {
  const { data } = await api.delete(`/series/${id}`);
  return data;
};

export const addImageToSeriesAdmin = async (seriesId, imageId) => {
  const { data } = await api.post(`/series/${seriesId}/images/${imageId}`);
  return data;
};

export const removeImageFromSeriesAdmin = async (seriesId, imageId) => {
  const { data } = await api.delete(`/series/${seriesId}/images/${imageId}`);
  return data;
};

export const reorderSeriesImagesAdmin = async (seriesId, imageIds) => {
  const { data } = await api.put(`/series/${seriesId}/reorder`, { imageIds });
  return data;
};
