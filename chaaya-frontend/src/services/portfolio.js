import api from './api.js';

export const fetchHomepage = async () => {
  const { data } = await api.get('/portfolio/home');
  return data.data;
};

export const fetchAboutPage = async () => {
  const { data } = await api.get('/portfolio/about');
  return data.data;
};

export const fetchRandomImages = async (limit = 12) => {
  const { data } = await api.get('/portfolio/random', { params: { limit } });
  return data.data.images;
};

export const fetchRelatedImages = async (id) => {
  const { data } = await api.get(`/portfolio/related/${id}`);
  return data.data.images;
};
