import api from './api.js';

export const submitContact = async (payload) => {
  const { data } = await api.post('/contact', payload);
  return data;
};

// ADMIN
export const fetchContactsAdmin = async (params = {}) => {
  const { page = 1, limit = 20, isRead } = params;
  const { data } = await api.get('/contact', { params: { page, limit, isRead } });
  return data.data;
};

export const fetchContactByIdAdmin = async (id) => {
  const { data } = await api.get(`/contact/${id}`);
  return data.data.contact;
};

export const markContactReadAdmin = async (id) => {
  const { data } = await api.put(`/contact/${id}/read`);
  return data;
};

export const markContactRepliedAdmin = async (id, notes) => {
  const { data } = await api.put(`/contact/${id}/replied`, { notes });
  return data;
};

export const deleteContactAdmin = async (id) => {
  const { data } = await api.delete(`/contact/${id}`);
  return data;
};
