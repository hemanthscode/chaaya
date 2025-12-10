// src/hooks/useImages.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchImages,
  fetchImagesBySeries,
  fetchFeaturedImages,
  fetchImageById,
  toggleLikeImage,
  updateImageAdmin,
  deleteImageAdmin
} from '../services/images.js';
import { adminBulkDeleteImages } from '../services/admin.js';

export const useImages = (params) => {
  return useQuery({
    queryKey: ['images', params],
    queryFn: () => fetchImages(params),
    keepPreviousData: true
  });
};

export const useSeriesImages = (slug) => {
  return useQuery({
    queryKey: ['images', 'series', slug],
    queryFn: () => fetchImagesBySeries(slug),
    enabled: !!slug
  });
};

export const useFeaturedImages = (limit = 8) => {
  return useQuery({
    queryKey: ['images', 'featured', limit],
    queryFn: () => fetchFeaturedImages(limit)
  });
};

export const useImageDetail = (id) => {
  return useQuery({
    queryKey: ['image', id],
    queryFn: () => fetchImageById(id),
    enabled: !!id
  });
};

export const useToggleLikeImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => toggleLikeImage(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['image', id] });
      queryClient.invalidateQueries({ queryKey: ['images'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    }
  });
};

// Admin mutations
export const useUpdateImageAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateImageAdmin(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['image', id] });
      queryClient.invalidateQueries({ queryKey: ['images'] });
    }
  });
};

export const useDeleteImageAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteImageAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    }
  });
};

export const useBulkDeleteImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageIds) => adminBulkDeleteImages(imageIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    }
  });
};
