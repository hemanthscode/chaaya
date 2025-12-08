/**
 * useCategories Hook
 * Fetch and manage categories data
 */

import { useState, useEffect, useCallback } from 'react';
import * as categoryService from '@services/categoryService';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch categories
   */
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await categoryService.getAll();
      setCategories(response.categories || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
      console.error('Fetch categories error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh categories
   */
  const refresh = useCallback(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    refresh,
  };
};

export default useCategories;
