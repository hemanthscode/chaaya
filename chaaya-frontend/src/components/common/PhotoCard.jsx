// src/components/common/PhotoCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToggleFavorite } from '../../hooks/useFavorites.js';

const PhotoCard = ({ image }) => {
  const toggleFavoriteMutation = useToggleFavorite();

  const onFavoriteClick = (e) => {
    e.preventDefault();
    if (!image?._id) return;
    toggleFavoriteMutation.mutate(image._id);
  };

  return (
    <motion.article
      layout
      whileHover={{ scale: 1.02 }}
      className="group relative overflow-hidden rounded-xl bg-slate-900 shadow-soft"
    >
      <Link to={`/image/${image._id || image.id}`}>
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={
              image.thumbnailUrl ||
              image.cloudinaryUrl ||
              image.url ||
              image.secureUrl ||
              image.src
            }
            alt={image.title || 'Photo'}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="flex items-center justify-between px-3 py-2 text-xs">
          <div>
            <p className="truncate font-medium text-slate-100">
              {image.title || 'Untitled'}
            </p>
            {image.category?.name && (
              <p className="text-[11px] text-slate-400">
                {image.category.name}
              </p>
            )}
          </div>
          <button
            onClick={onFavoriteClick}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-pink-400"
            aria-label="Toggle favorite"
          >
            <Heart
              className={`h-4 w-4 ${
                image.isFavorite ? 'fill-pink-500 text-pink-500' : ''
              }`}
            />
          </button>
        </div>
      </Link>
    </motion.article>
  );
};

export default PhotoCard;
