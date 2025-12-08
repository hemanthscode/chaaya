/**
 * CategoryNav Component
 * Category navigation/filter bar
 */

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { IoGrid } from 'react-icons/io5';
import { useCategories } from '@hooks/useCategories';
import Loader from '@components/common/Loader';

const CategoryNav = ({ className }) => {
  const { categories, loading, fetchCategories } = useCategories();
  const { category: activeCategory } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader size="sm" />
      </div>
    );
  }

  return (
    <div className={clsx('flex items-center gap-2 overflow-x-auto scrollbar-hide', className)}>
      {/* All categories */}
      <button
        onClick={() => navigate('/portfolio')}
        className={clsx(
          'px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors',
          !activeCategory
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700'
        )}
      >
        <IoGrid className="inline mr-2" />
        All
      </button>

      {/* Category buttons */}
      {categories.map((category) => (
        <button
          key={category._id}
          onClick={() => navigate(`/portfolio/${category.slug}`)}
          className={clsx(
            'px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors',
            activeCategory === category.slug
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700'
          )}
        >
          {category.name}
          {category.imageCount > 0 && (
            <span className="ml-2 text-sm opacity-75">
              ({category.imageCount})
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default CategoryNav;
