/**
 * ImageGrid Component
 * Masonry grid layout for images
 */

import React from 'react';
import clsx from 'clsx';
import ImageCard from './ImageCard';
import Loader from '@components/common/Loader';
import ErrorMessage from '@components/common/ErrorMessage';

const ImageGrid = ({
  images = [],
  loading = false,
  error = null,
  onImageClick,
  onImageLike,
  onRetry,
  className,
}) => {
  if (loading && images.length === 0) {
    return (
      <div className="py-12">
        <Loader size="lg" text="Loading images..." />
      </div>
    );
  }

  if (error && images.length === 0) {
    return (
      <div className="py-12">
        <ErrorMessage message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          No images found
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={clsx('masonry-grid', className)}>
        {images.map((image) => (
          <ImageCard
            key={image._id}
            image={image}
            onClick={onImageClick}
            onLike={onImageLike}
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

export default ImageGrid;
