import crypto from 'crypto';

export const generateRandomString = (length = 32) => 
  crypto.randomBytes(length).toString('hex');

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const cleanObject = (obj) => 
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1E9);
  const ext = originalName.split('.').pop();
  const name = originalName.replace(`.${ext}`, '');
  return `${name}-${timestamp}-${random}.${ext}`;
};

export const truncateText = (text, maxLength) => 
  text.length <= maxLength ? text : text.substring(0, maxLength) + '...';

export const isDevelopment = () => process.env.NODE_ENV === 'development';

export default {
  generateRandomString, delay, cleanObject, formatFileSize,
  generateUniqueFilename, truncateText, isDevelopment
};
