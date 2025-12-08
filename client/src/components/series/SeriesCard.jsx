/**
 * SeriesCard Component
 * Individual series card
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { IoImages, IoEye } from 'react-icons/io5';
import { generateThumbnail } from '@utils/imageHelpers';
import { formatNumber } from '@utils/formatters';

const SeriesCard = ({ series, onClick }) => {
  const navigate = useNavigate();

  const coverImageUrl = series.coverImage?.cloudinaryUrl 
    ? generateThumbnail(series.coverImage.cloudinaryUrl, 600, 400)
    : series.images?.[0]?.cloudinaryUrl
    ? generateThumbnail(series.images[0].cloudinaryUrl, 600, 400)
    : '/placeholder.jpg';

  const imageCount = series.imageCount || series.images?.length || 0;

  const handleClick = () => {
    if (onClick) {
      onClick(series);
    } else {
      navigate(`/series/${series.slug}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card card-hover cursor-pointer"
      onClick={handleClick}
    >
      {/* Cover image */}
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={coverImageUrl}
          alt={series.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Featured badge */}
        {series.featured && (
          <div className="absolute top-3 right-3">
            <span className="badge badge-primary">Featured</span>
          </div>
        )}

        {/* Image count */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-2 text-white">
          <IoImages size={16} />
          <span className="text-sm font-medium">
            {formatNumber(imageCount)} {imageCount === 1 ? 'Image' : 'Images'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {series.title}
        </h3>

        {series.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {series.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <IoEye size={16} />
            <span>{formatNumber(series.views)} views</span>
          </div>

          {series.category && (
            <span className="badge badge-primary">
              {series.category.name}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SeriesCard;
