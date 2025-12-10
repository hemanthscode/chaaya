// src/pages/SeriesDetail.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSeriesDetail } from '../hooks/useSeries.js';
import { useSeriesImages } from '../hooks/useImages.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ImageGrid from '../components/ui/ImageGrid.jsx';
import { ArrowLeft, Eye, Calendar, Image as ImageIcon } from 'lucide-react';

const SeriesDetail = () => {
  const { slug } = useParams();
  const { data: series, isLoading: seriesLoading, isError: seriesError } = useSeriesDetail(slug);
  const { data: images, isLoading: imagesLoading } = useSeriesImages(slug);

  if (seriesLoading || imagesLoading) return <LoadingSpinner fullScreen />;

  if (seriesError || !series) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-8 text-sm">
        <Link
          to="/series"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to series
        </Link>
        <div className="rounded-lg border border-red-800 bg-red-900/20 p-4 text-center">
          <p className="text-sm text-red-400">Series not found</p>
        </div>
      </section>
    );
  }

  const seriesImages = images || [];

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 text-sm">
      {/* Back navigation */}
      <Link
        to="/series"
        className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to series
      </Link>

      {/* Series header */}
      <div className="mb-6">
        <div className="mb-2 flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold text-slate-50">{series.title}</h1>
          {series.featured && (
            <span className="rounded bg-brand-500/10 px-2 py-1 text-xs font-medium text-brand-400">
              Featured
            </span>
          )}
        </div>
        
        {series.description && (
          <p className="mb-4 max-w-3xl text-sm text-slate-300">
            {series.description}
          </p>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <ImageIcon className="h-3.5 w-3.5" />
            {seriesImages.length} {seriesImages.length === 1 ? 'image' : 'images'}
          </span>
          {series.category && (
            <span>• {series.category.name}</span>
          )}
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {series.views || 0} views
          </span>
          {series.createdAt && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(series.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          )}
        </div>
      </div>

      {/* Images grid */}
      {seriesImages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-900/50 py-16">
          <ImageIcon className="mb-3 h-12 w-12 text-slate-600" />
          <p className="text-sm text-slate-400">No images in this series yet</p>
        </div>
      ) : (
        <ImageGrid images={seriesImages} />
      )}
    </section>
  );
};

export default SeriesDetail;
