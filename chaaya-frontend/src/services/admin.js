import api from './api.js';

export const fetchAnalyticsDashboard = async () => {
  const { data } = await api.get('/analytics/dashboard');
  return data.data;
};

export const fetchAnalyticsRecent = async (days = 7) => {
  const { data } = await api.get('/analytics/recent', { params: { days } });
  return data.data;
};

export const fetchAnalyticsRange = async (startDate, endDate) => {
  const { data } = await api.get('/analytics/range', { params: { startDate, endDate } });
  return data.data;
};

export const adminBulkDeleteImages = async (imageIds) => {
  const { data } = await api.delete('/admin/images/bulk', { data: { imageIds } });
  return data.data;
};

export const adminGetAuditLogs = async () => {
  const { data } = await api.get('/admin/audit-logs');
  return data.data;
};

export const adminCreateBackup = async () => {
  const { data } = await api.post('/admin/backup');
  return data.data;
};
