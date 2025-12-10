import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFavorites, toggleFavorite } from '../services/favorites.js';

export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: fetchFavorites
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId) => toggleFavorite(imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['images'] });
    }
  });
};
