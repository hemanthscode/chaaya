/**
 * Pagination Component
 * Page navigation component
 */

import React from 'react';
import clsx from 'clsx';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  const maxVisiblePages = 5;

  const getPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftSiblingIndex = Math.max(currentPage - 1, 1);
      const rightSiblingIndex = Math.min(currentPage + 1, totalPages);

      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

      if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftRange = Array.from({ length: 3 }, (_, i) => i + 1);
        pages.push(...leftRange, '...', totalPages);
      } else if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightRange = Array.from({ length: 3 }, (_, i) => totalPages - 2 + i);
        pages.push(1, '...', ...rightRange);
      } else {
        pages.push(
          1,
          '...',
          leftSiblingIndex,
          currentPage,
          rightSiblingIndex,
          '...',
          totalPages
        );
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={clsx('flex items-center justify-center gap-2', className)}>
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={clsx(
          'p-2 rounded-lg transition-colors',
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
        )}
        aria-label="Previous page"
      >
        <IoChevronBack size={20} />
      </button>

      {/* Page numbers */}
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={clsx(
            'min-w-[40px] h-10 rounded-lg font-medium transition-colors',
            page === currentPage
              ? 'bg-primary-600 text-white'
              : page === '...'
              ? 'text-gray-400 cursor-default'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
          )}
        >
          {page}
        </button>
      ))}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={clsx(
          'p-2 rounded-lg transition-colors',
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
        )}
        aria-label="Next page"
      >
        <IoChevronForward size={20} />
      </button>
    </div>
  );
};

export default Pagination;
