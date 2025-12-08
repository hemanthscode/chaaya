/**
 * PortfolioCategory Page
 * Portfolio filtered by category
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as imageService from '@services/imageService';
import * as categoryService from '@services/categoryService';
import Container from '@components/layout/Container';
import ImageGrid from '@components/portfolio/ImageGrid';
import CategoryNav from '@components/category/CategoryNav';
import Pagination from '@components/common/Pagination';
import Loader from '@components/common/Loader';
import ErrorMessage from '@components/common/ErrorMessage';

const PortfolioCategory = () => {
  const { category: categorySlug } = useParams();
  const [category, setCategory] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch category details
      const categoryRes = await categoryService.getBySlug(categorySlug);
      setCategory(categoryRes.category);

      // Fetch images in category
      const imagesRes = await imageService.getAll({
        category: categoryRes.category._id,
        page,
        limit: 24,
      });

      setImages(imagesRes.images || []);
      setPagination(imagesRes.pagination || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categorySlug]);

  if (loading && !category) {
    return <Loader fullScreen text="Loading category..." />;
  }

  if (error && !category) {
    return <ErrorMessage message={error} onRetry={() => fetchData()} fullScreen />;
  }

  return (
    <div className="py-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {category?.name}
          </h1>
          {category?.description && (
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {category.description}
            </p>
          )}
        </div>

        {/* Category Navigation */}
        <div className="mb-6">
          <CategoryNav />
        </div>

        {/* Image Grid */}
        <ImageGrid
          images={images}
          loading={loading}
          error={error}
          onRetry={() => fetchData(pagination.page)}
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={fetchData}
            />
          </div>
        )}
      </Container>
    </div>
  );
};

export default PortfolioCategory;
