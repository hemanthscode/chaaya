// src/components/ui/ImageGrid.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Eye, ZoomIn } from 'lucide-react';

const ImageGrid = ({ images = [] }) => {
  const [hoveredId, setHoveredId] = useState(null);

  if (!images.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 py-16">
        <p className="text-sm text-slate-400">No images to display</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {images.map((img, index) => {
        // Vary heights for masonry effect
        const heightClass = index % 5 === 0 ? 'row-span-2' : '';
        
        return (
          <motion.div
            key={img._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className={`group relative overflow-hidden rounded-xl ${heightClass}`}
            onMouseEnter={() => setHoveredId(img._id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <Link to={`/image/${img._id}`} className="block h-full">
              {/* Image container */}
              <div className="relative h-full min-h-[280px] overflow-hidden bg-slate-900">
                <motion.img
                  src={img.thumbnailUrl || img.cloudinaryUrl}
                  alt={img.title}
                  className="h-full w-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Hover content */}
                <AnimatePresence>
                  {hoveredId === img._id && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 flex flex-col justify-end p-4"
                    >
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-slate-50">
                          {img.title}
                        </h3>
                        {img.category?.name && (
                          <p className="text-xs text-slate-300">
                            {img.category.name}
                          </p>
                        )}
                        
                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          {img.views > 0 && (
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {img.views}
                            </span>
                          )}
                          {img.likes > 0 && (
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {img.likes}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Zoom icon */}
                      <div className="absolute right-4 top-4 rounded-full bg-slate-950/80 p-2 backdrop-blur-sm">
                        <ZoomIn className="h-4 w-4 text-slate-200" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Featured badge */}
                {img.featured && (
                  <div className="absolute left-3 top-3 rounded-full bg-brand-500/90 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                    Featured
                  </div>
                )}

                {/* Category tag (always visible on mobile) */}
                <div className="absolute bottom-3 left-3 lg:hidden">
                  <span className="rounded-md bg-slate-950/80 px-2 py-1 text-xs text-slate-300 backdrop-blur-sm">
                    {img.title}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ImageGrid;
