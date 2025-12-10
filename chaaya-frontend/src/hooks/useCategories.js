import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchCategories,
  fetchCategoryBySlug,
  createCategoryAdmin,
  updateCategoryAdmin,
  deleteCategoryAdmin
} from '../services/categories.js';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
};

export const useCategoryDetail = (slug) => {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => fetchCategoryBySlug(slug),
    enabled: !!slug
  });
};

// Admin
export const useCreateCategoryAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createCategoryAdmin(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const useUpdateCategoryAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateCategoryAdmin(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const useDeleteCategoryAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteCategoryAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};
