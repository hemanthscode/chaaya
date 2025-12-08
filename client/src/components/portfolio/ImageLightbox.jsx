/**
 * ImageLightbox Component
 * Full-screen image viewer with navigation
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoClose,
  IoChevronBack,
  IoChevronForward,
  IoHeart,
  IoHeartOutline,
  IoDownload,
  IoShare,
  IoInformationCircle,
} from 'react-icons/io5';
import clsx from 'clsx';
import { formatNumber } from '@utils/formatters';
import ImageMetadata from './ImageMetadata';

const ImageLightbox = ({
  isOpen,
  image,
  images = [],
  currentIndex = 0,
  onClose,
  onPrevious,
  onNext,
  onLike,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (onPrevious) onPrevious();
          break;
        case 'ArrowRight':
          if (onNext) onNext();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrevious, onNext]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset image loaded state when image changes
  useEffect(() => {
    setImageLoaded(false);
  }, [image?._id]);

  if (!image) return null;

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  const lightboxContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center justify-between p-4">
              <div className="flex-1">
                <h2 className="text-white font-semibold text-lg line-clamp-1">
                  {image.title}
                </h2>
                <div className="flex items-center space-x-4 text-white/80 text-sm mt-1">
                  <span className="flex items-center space-x-1">
                    <IoHeart size={16} />
                    <span>{formatNumber(image.likes)}</span>
                  </span>
                  <span>{formatNumber(image.views)} views</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Toggle info"
                >
                  <IoInformationCircle size={24} />
                </button>

                {onLike && (
                  <button
                    onClick={() => onLike(image._id)}
                    className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                    aria-label="Like"
                  >
                    <IoHeartOutline size={24} />
                  </button>
                )}

                <button
                  className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Share"
                >
                  <IoShare size={24} />
                </button>

                <button
                  onClick={onClose}
                  className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <IoClose size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Image container */}
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
            <motion.div
              key={image._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-7xl max-h-full"
            >
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="spinner w-12 h-12 border-white" />
                </div>
              )}
              <img
                src={image.cloudinaryUrl}
                alt={image.title}
                className={clsx(
                  'max-w-full max-h-[calc(100vh-8rem)] object-contain',
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                )}
                onLoad={() => setImageLoaded(true)}
              />
            </motion.div>
          </div>

          {/* Navigation buttons */}
          {hasPrevious && onPrevious && (
            <button
              onClick={onPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm"
              aria-label="Previous image"
            >
              <IoChevronBack size={24} />
            </button>
          )}

          {hasNext && onNext && (
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm"
              aria-label="Next image"
            >
              <IoChevronForward size={24} />
            </button>
          )}

          {/* Info sidebar */}
          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween' }}
                className="absolute top-0 right-0 bottom-0 w-full md:w-96 bg-white dark:bg-dark-900 overflow-y-auto shadow-2xl"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Information
                    </h3>
                    <button
                      onClick={() => setShowInfo(false)}
                      className="text-gray-600 dark:text-gray-400"
                    >
                      <IoClose size={24} />
                    </button>
                  </div>

                  {image.description && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Description
                      </h4>
                      <p className="text-gray-900 dark:text-white">
                        {image.description}
                      </p>
                    </div>
                  )}

                  {image.tags && image.tags.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {image.tags.map((tag) => (
                          <span
                            key={tag}
                            className="badge badge-primary"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <ImageMetadata
                    metadata={image.metadata}
                    dateTaken={image.metadata?.dateTaken}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 text-white rounded-full backdrop-blur-sm text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(lightboxContent, document.body);
};

export default ImageLightbox;
