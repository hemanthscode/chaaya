/**
 * CategoryCard Component
 * Individual category card
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoImages } from 'react-icons/io5';
import { formatNumber } from '@utils/formatters';

const CategoryCard = ({ category, onClick }) => {
  const navigate = useNavigate();

  const coverImageUrl = category.coverImage || '/placeholder.jpg';

  const handleClick = () => {
    if (onClick) {
      onClick(category);
    } else {
      navigate(`/portfolio/${category.slug}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="card card-hover cursor-pointer group"
      onClick={handleClick}
    >
      {/* Cover image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={coverImageUrl}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h3 className="text-2xl font-bold text-white mb-2">
            {category.name}
          </h3>

          {category.description && (
            <p className="text-white/90 text-sm mb-3 line-clamp-2">
              {category.description}
            </p>
          )}

          <div className="flex items-center space-x-2 text-white/80 text-sm">
            <IoImages size={16} />
            <span>
              {formatNumber(category.imageCount)} {category.imageCount === 1 ? 'Image' : 'Images'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
