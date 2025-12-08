/**
 * SeriesDetail Component
 * Detailed series view with images
 */

import React from 'react';
import { IoImages, IoEye, IoCalendar } from 'react-icons/io5';
import { formatNumber, formatDate } from '@utils/formatters';
import ImageGrid from '@components/portfolio/ImageGrid';
import Card from '@components/common/Card';

const SeriesDetail = ({ series, onImageClick, onImageLike }) => {
  if (!series) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Cover image */}
          {series.coverImage && (
            <div className="w-full md:w-64 aspect-[3/2] rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={series.coverImage.thumbnailUrl || series.coverImage.cloudinaryUrl}
                alt={series.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {series.title}
                </h1>
                {series.category && (
                  <span className="badge badge-primary">
                    {series.category.name}
                  </span>
                )}
              </div>
              {series.featured && (
                <span className="badge bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  Featured
                </span>
              )}
            </div>

            {series.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {series.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <IoImages className="text-primary-600" />
                <span>
                  {formatNumber(series.imageCount || series.images?.length || 0)} Images
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <IoEye className="text-primary-600" />
                <span>{formatNumber(series.views)} Views</span>
              </div>
              <div className="flex items-center space-x-2">
                <IoCalendar className="text-primary-600" />
                <span>Created {formatDate(series.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Images */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Images in this series
        </h2>
        <ImageGrid
          images={series.images || []}
          onImageClick={onImageClick}
          onImageLike={onImageLike}
        />
      </div>
    </div>
  );
};

export default SeriesDetail;
