// src/services/upload.js
import api from './api.js';

export const uploadSingleImage = async (file, metadata = {}) => {
  const formData = new FormData();
  formData.append('image', file);
  
  // Add metadata fields
  Object.keys(metadata).forEach(key => {
    if (metadata[key] !== null && metadata[key] !== undefined) {
      formData.append(key, metadata[key]);
    }
  });

  const { data } = await api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return data.data.image;
};

export const uploadMultipleImages = async (files, onProgress, metadata = {}) => {
  const formData = new FormData();
  
  files.forEach(file => {
    formData.append('images', file);
  });

  // ✅ Add metadata fields for bulk upload
  Object.keys(metadata).forEach(key => {
    if (metadata[key] !== null && metadata[key] !== undefined) {
      formData.append(key, metadata[key]);
    }
  });

  const { data } = await api.post('/upload/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgress?.(percentCompleted);
    }
  });

  return data.data;
};

export const deleteCloudinaryImage = async (publicId) => {
  const { data } = await api.delete(`/upload/${publicId}`);
  return data;
};

export default {
  uploadSingleImage,
  uploadMultipleImages,
  deleteCloudinaryImage
};
