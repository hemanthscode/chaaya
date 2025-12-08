/**
 * SeriesList Page
 * List all photography series
 */

import React, { useState, useEffect } from 'react';
import * as seriesService from '@services/seriesService';
import Container from '@components/layout/Container';
import SeriesGrid from '@components/series/SeriesGrid';
import Pagination from '@components/common/Pagination';

const SeriesList = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const fetchSeries = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await seriesService.getAll({
        page,
        limit: 12,
        status: 'published',
      });

      setSeries(response.series || []);
      setPagination(response.pagination || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  return (
    <div className="py-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Photography Series
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explore curated collections of themed photography
          </p>
        </div>

        {/* Series Grid */}
        <SeriesGrid
          series={series}
          loading={loading}
          error={error}
          onRetry={() => fetchSeries(pagination.page)}
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={fetchSeries}
            />
          </div>
        )}
      </Container>
    </div>
  );
};

export default SeriesList;
