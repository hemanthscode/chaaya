import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchSeries,
  fetchSeriesBySlug,
  createSeriesAdmin,
  updateSeriesAdmin,
  deleteSeriesAdmin,
  addImageToSeriesAdmin,
  removeImageFromSeriesAdmin,
  reorderSeriesImagesAdmin
} from '../services/series.js';

export const useSeriesList = (params) => {
  return useQuery({
    queryKey: ['series', params],
    queryFn: () => fetchSeries(params),
    keepPreviousData: true
  });
};

export const useSeriesDetail = (slug) => {
  return useQuery({
    queryKey: ['series', 'slug', slug],
    queryFn: () => fetchSeriesBySlug(slug),
    enabled: !!slug
  });
};

// Admin
export const useCreateSeriesAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createSeriesAdmin(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['series'] });
    }
  });
};

export const useUpdateSeriesAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateSeriesAdmin(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['series'] });
    }
  });
};

export const useDeleteSeriesAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteSeriesAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['series'] });
    }
  });
};

export const useSeriesImagesAdmin = () => {
  const queryClient = useQueryClient();

  const addImage = useMutation({
    mutationFn: ({ seriesId, imageId }) => addImageToSeriesAdmin(seriesId, imageId),
    onSuccess: (_, { seriesId }) => {
      queryClient.invalidateQueries({ queryKey: ['series'] });
      queryClient.invalidateQueries({ queryKey: ['series', 'id', seriesId] });
    }
  });

  const removeImage = useMutation({
    mutationFn: ({ seriesId, imageId }) => removeImageFromSeriesAdmin(seriesId, imageId),
    onSuccess: (_, { seriesId }) => {
      queryClient.invalidateQueries({ queryKey: ['series'] });
      queryClient.invalidateQueries({ queryKey: ['series', 'id', seriesId] });
    }
  });

  const reorderImages = useMutation({
    mutationFn: ({ seriesId, imageIds }) => reorderSeriesImagesAdmin(seriesId, imageIds),
    onSuccess: (_, { seriesId }) => {
      queryClient.invalidateQueries({ queryKey: ['series'] });
      queryClient.invalidateQueries({ queryKey: ['series', 'id', seriesId] });
    }
  });

  return { addImage, removeImage, reorderImages };
};
