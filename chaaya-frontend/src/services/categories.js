import api from './api.js';

export const fetchCategories = async () => {
  const { data } = await api.get('/categories');
  return data.data.categories;
};

export const fetchCategoryBySlug = async (slug) => {
  const { data } = await api.get(`/categories/${slug}`);
  return data.data.category;
};

// ADMIN
export const createCategoryAdmin = async (payload) => {
  const { data } = await api.post('/categories', payload);
  return data.data.category;
};

export const updateCategoryAdmin = async (id, payload) => {
  const { data } = await api.put(`/categories/${id}`, payload);
  return data.data.category;
};

export const deleteCategoryAdmin = async (id) => {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
};
