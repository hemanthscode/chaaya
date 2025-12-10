// src/pages/Series.jsx
import React, { useState } from 'react';
import { useSeriesList } from '../hooks/useSeries.js';
import SeriesCard from '../components/common/SeriesCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { Image as ImageIcon } from 'lucide-react';

const Series = () => {
  const [page] = useState(1);
  const { data, isLoading, isError, error } = useSeriesList({ page, limit: 20, status: 'published' });

  if (isLoading) return <LoadingSpinner fullScreen />;

  if (isError) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-8 text-sm">
        <div className="rounded-lg border border-red-800 bg-red-900/20 p-4 text-center">
          <p className="text-sm text-red-400">
            {error?.response?.data?.message || 'Failed to load series'}
          </p>
        </div>
      </section>
    );
  }

  const series = data?.items || [];

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 text-sm">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-semibold text-slate-50">Series</h1>
        <p className="text-sm text-slate-400">
          Curated collections of images organized by theme, event, or story.
        </p>
      </div>

      {series.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-900/50 py-16">
          <ImageIcon className="mb-3 h-12 w-12 text-slate-600" />
          <p className="text-sm text-slate-400">No series available yet</p>
          <p className="mt-1 text-xs text-slate-500">
            Check back soon for curated collections
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {series.map((s) => (
            <SeriesCard key={s._id} series={s} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Series;
