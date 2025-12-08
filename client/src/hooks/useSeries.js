/**
 * useSeries Hook
 * Fetch and manage series data
 */

import { useState, useEffect, useCallback } from 'react';
import * as seriesService from '@services/seriesService';
import { SERIES_PER_PAGE } from '@utils/constants';

export const useSeries = (initialParams = {}) => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: SERIES_PER_PAGE,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });
  const [params, setParams] = useState(initialParams);

  /**
   * Fetch series
   */
  const fetchSeries = useCallback(async (queryParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await seriesService.getAll({
        ...params,
        ...queryParams,
      });

      setSeries(response.series || []);
      setPagination(response.pagination || {});
    } catch (err) {
      setError(err.message || 'Failed to fetch series');
      console.error('Fetch series error:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  /**
   * Refresh series
   */
  const refresh = useCallback(() => {
    fetchSeries({ page: 1 });
  }, [fetchSeries]);

  /**
   * Update params and refetch
   */
  const updateParams = useCallback((newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
    fetchSeries({ ...newParams, page: 1 });
  }, [fetchSeries]);

  // Initial fetch
  useEffect(() => {
    fetchSeries();
  }, [fetchSeries]);

  return {
    series,
    loading,
    error,
    pagination,
    params,
    fetchSeries,
    refresh,
    updateParams,
  };
};

export default useSeries;
