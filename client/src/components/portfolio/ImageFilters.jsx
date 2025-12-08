/**
 * ImageFilters Component
 * Filter and sort options for image gallery
 */

import React from 'react';
import { IoFilter, IoClose } from 'react-icons/io5';
import Dropdown from '@components/common/Dropdown';
import Button from '@components/common/Button';
import { SORT_OPTIONS } from '@utils/constants';

const ImageFilters = ({
  sortBy,
  onSortChange,
  status,
  onStatusChange,
  featured,
  onFeaturedChange,
  onReset,
  showAdvanced = false,
}) => {
  const sortOptions = Object.values(SORT_OPTIONS).map(option => ({
    value: `${option.value}-${option.order}`,
    label: option.label,
  }));

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
  ];

  const featuredOptions = [
    { value: 'all', label: 'All Images' },
    { value: 'true', label: 'Featured Only' },
    { value: 'false', label: 'Not Featured' },
  ];

  const hasActiveFilters = status !== 'all' || featured !== 'all' || 
    sortBy !== `${SORT_OPTIONS.NEWEST.value}-${SORT_OPTIONS.NEWEST.order}`;

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <IoFilter className="text-gray-600 dark:text-gray-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filters
          </h3>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<IoClose />}
            onClick={onReset}
          >
            Reset
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sort */}
        <Dropdown
          label="Sort by"
          items={sortOptions}
          value={sortBy}
          onChange={onSortChange}
          placeholder="Select sort option"
        />

        {/* Status (if advanced) */}
        {showAdvanced && (
          <Dropdown
            label="Status"
            items={statusOptions}
            value={status}
            onChange={onStatusChange}
            placeholder="Select status"
          />
        )}

        {/* Featured */}
        <Dropdown
          label="Featured"
          items={featuredOptions}
          value={featured}
          onChange={onFeaturedChange}
          placeholder="Select featured"
        />
      </div>
    </div>
  );
};

export default ImageFilters;
