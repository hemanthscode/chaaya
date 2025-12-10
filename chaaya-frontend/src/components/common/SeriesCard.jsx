// src/components/common/SeriesCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, Star, ArrowUpRight } from 'lucide-react';

const SeriesCard = ({ series }) => {
  const cover =
    series.coverImage?.thumbnailUrl ||
    series.coverImage?.cloudinaryUrl ||
    series.coverImage?.url;

  const imageCount = series.images?.length || series.imageCount || 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl bg-slate-900 shadow-lg"
    >
      <Link to={`/series/${series.slug}`} className="block">
        {/* Image container with overlay */}
        <div className="relative aspect-[3/4] overflow-hidden bg-slate-800">
          {cover ? (
            <>
              <motion.img
                src={cover}
                alt={series.title}
                className="h-full w-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                loading="lazy"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
              <ImageIcon className="h-12 w-12 text-slate-600" />
            </div>
          )}

          {/* Featured star - top left */}
          {series.featured && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-amber-500/90 px-3 py-1.5 backdrop-blur-sm"
            >
              <Star className="h-3 w-3 fill-white text-white" />
              <span className="text-xs font-medium text-white">Featured</span>
            </motion.div>
          )}

          {/* Image count badge - top right */}
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-slate-950/80 px-3 py-1.5 backdrop-blur-md">
            <ImageIcon className="h-3 w-3 text-slate-300" />
            <span className="text-xs font-medium text-slate-200">{imageCount}</span>
          </div>

          {/* Content overlay - bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="space-y-2">
              {/* Category */}
              {series.category?.name && (
                <span className="inline-block rounded-md bg-brand-500/20 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-brand-300">
                  {series.category.name}
                </span>
              )}

              {/* Title */}
              <h3 className="text-lg font-semibold text-slate-50 transition-colors group-hover:text-brand-300">
                {series.title}
              </h3>

              {/* Description */}
              {series.description && (
                <p className="line-clamp-2 text-xs leading-relaxed text-slate-300">
                  {series.description}
                </p>
              )}

              {/* View link with arrow */}
              <div className="flex items-center gap-1 pt-1 text-xs font-medium text-brand-400 opacity-0 transition-opacity group-hover:opacity-100">
                <span>View Series</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>

          {/* Hover border effect */}
          <div className="absolute inset-0 rounded-2xl border-2 border-brand-500/0 transition-colors group-hover:border-brand-500/50" />
        </div>
      </Link>
    </motion.article>
  );
};

export default SeriesCard;
