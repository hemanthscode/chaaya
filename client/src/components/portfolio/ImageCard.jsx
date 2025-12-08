/**
 * ImageCard Component
 * Individual image card for gallery
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { IoHeart, IoHeartOutline, IoEye } from 'react-icons/io5';
import { useLazyLoad } from '@hooks/useLazyLoad';
import { generateThumbnail } from '@utils/imageHelpers';
import { formatNumber } from '@utils/formatters';
import { isImageLiked, addLikedImage, removeLikedImage } from '@utils/storage';

const ImageCard = ({ image, onLike, onClick }) => {
  const navigate = useNavigate();
  const { targetRef, isIntersecting } = useLazyLoad();
  const [isLiked, setIsLiked] = useState(isImageLiked(image._id));
  const [likes, setLikes] = useState(image.likes || 0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const thumbnailUrl = image.thumbnailUrl || generateThumbnail(image.cloudinaryUrl);

  const handleLike = async (e) => {
    e.stopPropagation();
    
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikes(prev => newLikedState ? prev + 1 : prev - 1);

    if (newLikedState) {
      addLikedImage(image._id);
    } else {
      removeLikedImage(image._id);
    }

    if (onLike) {
      await onLike(image._id, newLikedState ? 'like' : 'unlike');
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(image);
    } else {
      navigate(`/image/${image._id}`);
    }
  };

  return (
    <motion.div
      ref={targetRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden rounded-lg bg-gray-100 dark:bg-dark-800 cursor-pointer"
      onClick={handleClick}
    >
      {/* Image */}
      <div className="relative aspect-auto">
        {isIntersecting && (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 skeleton" />
            )}
            <img
              src={thumbnailUrl}
              alt={image.title}
              className={clsx(
                'w-full h-full object-cover transition-all duration-300',
                'group-hover:scale-110',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          </>
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Title */}
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
            {image.title}
          </h3>

          {/* Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-white/80 text-sm">
              <div className="flex items-center space-x-1">
                <IoEye size={16} />
                <span>{formatNumber(image.views)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <IoHeart size={16} />
                <span>{formatNumber(likes)}</span>
              </div>
            </div>

            {/* Like button */}
            <button
              onClick={handleLike}
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
              aria-label={isLiked ? 'Unlike' : 'Like'}
            >
              {isLiked ? (
                <IoHeart size={20} className="text-red-500" />
              ) : (
                <IoHeartOutline size={20} className="text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Featured badge */}
      {image.featured && (
        <div className="absolute top-3 right-3">
          <span className="badge badge-primary">Featured</span>
        </div>
      )}

      {/* Category badge */}
      {image.category && (
        <div className="absolute top-3 left-3">
          <span className="badge bg-black/50 text-white backdrop-blur-sm">
            {image.category.name}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default ImageCard;
