/**
 * Portfolio Page
 * Main portfolio gallery with filters
 */

import React, { useState, useEffect, useCallback } from 'react';
import * as imageService from '@services/imageService';
import Container from '@components/layout/Container';
import ImageGrid from '@components/portfolio/ImageGrid';
import ImageFilters from '@components/portfolio/ImageFilters';
import ImageLightbox from '@components/portfolio/ImageLightbox';
import CategoryNav from '@components/category/CategoryNav';
import Pagination from '@components/common/Pagination';
import { SORT_OPTIONS } from '@utils/constants';

const Portfolio = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Filters
  const [sortBy, setSortBy] = useState(`${SORT_OPTIONS.NEWEST.value}-${SORT_OPTIONS.NEWEST.order}`);
  const [featured, setFeatured] = useState('all');

  const fetchImages = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const [sortField, sortOrder] = sortBy.split('-');
      const params = {
        page,
        limit: 24,
        sort: sortField,
        order: sortOrder,
      };

      if (featured !== 'all') {
        params.featured = featured === 'true';
      }

      const response = await imageService.getAll(params);
      setImages(response.images || []);
      setPagination(response.pagination || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sortBy, featured]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleImageClick = (image) => {
    const index = images.findIndex(img => img._id === image._id);
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const handlePrevious = () => {
    setSelectedImageIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) => Math.min(images.length - 1, prev + 1));
  };

  const handleLike = async (imageId, action) => {
    try {
      if (action === 'like') {
        await imageService.like(imageId);
      }
      // Update local state if needed
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleResetFilters = () => {
    setSortBy(`${SORT_OPTIONS.NEWEST.value}-${SORT_OPTIONS.NEWEST.order}`);
    setFeatured('all');
  };

  return (
    <div className="py-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Portfolio
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explore my collection of photography
          </p>
        </div>

        {/* Category Navigation */}
        <div className="mb-6">
          <CategoryNav />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <ImageFilters
            sortBy={sortBy}
            onSortChange={setSortBy}
            featured={featured}
            onFeaturedChange={setFeatured}
            onReset={handleResetFilters}
          />
        </div>

        {/* Image Grid */}
        <ImageGrid
          images={images}
          loading={loading}
          error={error}
          onImageClick={handleImageClick}
          onImageLike={handleLike}
          onRetry={() => fetchImages(pagination.page)}
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={fetchImages}
            />
          </div>
        )}

        {/* Lightbox */}
        <ImageLightbox
          isOpen={lightboxOpen}
          image={images[selectedImageIndex]}
          images={images}
          currentIndex={selectedImageIndex}
          onClose={() => setLightboxOpen(false)}
          onPrevious={selectedImageIndex > 0 ? handlePrevious : null}
          onNext={selectedImageIndex < images.length - 1 ? handleNext : null}
          onLike={handleLike}
        />
      </Container>
    </div>
  );
};

export default Portfolio;
