import api from './api.js';

export const loginRequest = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data.data; // { user, token }
};

export const registerRequest = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data.data; // { user, token }
};

export const getProfileRequest = async () => {
  const { data } = await api.get('/auth/me');
  return data.data.user;
};

export const updateProfileRequest = async (payload) => {
  const { data } = await api.put('/auth/profile', payload);
  return data.data.user;
};

export const changePasswordRequest = async (payload) => {
  const { data } = await api.put('/auth/password', payload);
  return data;
};

export const refreshTokenRequest = async () => {
  const { data } = await api.post('/auth/refresh');
  return data.data.token;
};
