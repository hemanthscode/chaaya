/**
 * SeriesGrid Component
 * Grid layout for series cards
 */

import React from 'react';
import clsx from 'clsx';
import SeriesCard from './SeriesCard';
import Loader from '@components/common/Loader';
import ErrorMessage from '@components/common/ErrorMessage';

const SeriesGrid = ({
  series = [],
  loading = false,
  error = null,
  onSeriesClick,
  onRetry,
  className,
}) => {
  if (loading && series.length === 0) {
    return (
      <div className="py-12">
        <Loader size="lg" text="Loading series..." />
      </div>
    );
  }

  if (error && series.length === 0) {
    return (
      <div className="py-12">
        <ErrorMessage message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (series.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          No series found
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={clsx('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
        {series.map((item) => (
          <SeriesCard
            key={item._id}
            series={item}
            onClick={onSeriesClick}
          />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Loader text="Loading more..." />
        </div>
      )}
    </>
  );
};

export default SeriesGrid;
