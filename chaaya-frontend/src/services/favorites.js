import api from './api.js';

export const fetchFavorites = async () => {
  const { data } = await api.get('/favorites');
  return data.data.images;
};

export const toggleFavorite = async (imageId) => {
  const { data } = await api.post(`/favorites/images/${imageId}`);
  return data.data;
};
