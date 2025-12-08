/**
 * useImages Hook
 * Fetch and manage images data
 */

import { useState, useEffect, useCallback } from 'react';
import * as imageService from '@services/imageService';
import { IMAGES_PER_PAGE } from '@utils/constants';

export const useImages = (initialParams = {}) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: IMAGES_PER_PAGE,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });
  const [params, setParams] = useState(initialParams);

  /**
   * Fetch images
   */
  const fetchImages = useCallback(async (queryParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await imageService.getAll({
        ...params,
        ...queryParams,
      });

      setImages(response.images || []);
      setPagination(response.pagination || {});
    } catch (err) {
      setError(err.message || 'Failed to fetch images');
      console.error('Fetch images error:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  /**
   * Load more images (for infinite scroll)
   */
  const loadMore = useCallback(async () => {
    if (!pagination.hasMore || loading) return;

    try {
      setLoading(true);
      setError(null);

      const nextPage = pagination.page + 1;
      const response = await imageService.getAll({
        ...params,
        page: nextPage,
      });

      setImages(prev => [...prev, ...(response.images || [])]);
      setPagination(response.pagination || {});
    } catch (err) {
      setError(err.message || 'Failed to load more images');
      console.error('Load more images error:', err);
    } finally {
      setLoading(false);
    }
  }, [params, pagination, loading]);

  /**
   * Refresh images
   */
  const refresh = useCallback(() => {
    fetchImages({ page: 1 });
  }, [fetchImages]);

  /**
   * Update params and refetch
   */
  const updateParams = useCallback((newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
    fetchImages({ ...newParams, page: 1 });
  }, [fetchImages]);

  // Initial fetch
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return {
    images,
    loading,
    error,
    pagination,
    params,
    fetchImages,
    loadMore,
    refresh,
    updateParams,
  };
};

export default useImages;
