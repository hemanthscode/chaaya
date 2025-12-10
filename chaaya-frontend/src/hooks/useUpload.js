// src/hooks/useUpload.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadSingleImage, uploadMultipleImages } from '../services/upload.js';

export const useUploadSingleImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, metadata }) => uploadSingleImage(file, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
      queryClient.invalidateQueries({ queryKey: ['series'] });
    }
  });
};

export const useUploadMultipleImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ files, onProgress, metadata }) => 
      uploadMultipleImages(files, onProgress, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
      queryClient.invalidateQueries({ queryKey: ['series'] });
    }
  });
};
