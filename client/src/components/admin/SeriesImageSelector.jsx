/**
 * SeriesImageSelector Component
 * Add/Remove images from series (COMPLETE BIDIRECTIONAL)
 */

import React, { useState, useEffect } from 'react';
import { IoCheckmark, IoClose, IoCloudUpload } from 'react-icons/io5'; // ✅ FIXED: Added IoCloudUpload
import * as imageService from '@services/imageService';
import * as seriesService from '@services/seriesService';
import Button from '@components/common/Button';
import Loader from '@components/common/Loader';
import { useToast } from '@hooks/useToast';

const SeriesImageSelector = ({ seriesId, existingImages = [], onComplete }) => {
  const [images, setImages] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await imageService.getAll({ limit: 200 });
        setImages(response.images || []);
        
        // ✅ Pre-select existing images for this series
        const existingIds = existingImages.map(img => img._id || img).filter(Boolean);
        setSelectedIds(existingIds);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [existingImages]);

  const toggleImage = (imageId) => {
    setSelectedIds((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleSave = async () => {
    if (saving) return;

    try {
      setSaving(true);

      // ✅ FIXED: Calculate ADD and REMOVE
      const currentSeriesImages = existingImages.map(img => img._id || img).filter(Boolean);
      const toAdd = selectedIds.filter(id => !currentSeriesImages.includes(id));
      const toRemove = currentSeriesImages.filter(id => !selectedIds.includes(id));

      let successMsg = 'Series images updated';

      // Add new images
      if (toAdd.length > 0) {
        const addResult = await seriesService.addImages(seriesId, toAdd);
        successMsg += ` (+${addResult.success || toAdd.length})`;
      }

      // Remove deselected images
      if (toRemove.length > 0) {
        for (const imageId of toRemove) {
          await seriesService.removeImage(seriesId, imageId);
        }
        successMsg += ` (-${toRemove.length})`;
      }

      if (toAdd.length === 0 && toRemove.length === 0) {
        successMsg = 'No changes detected';
      }

      toast.success(successMsg);
      if (onComplete) onComplete();
    } catch (error) {
      toast.error(error.message);
      console.error('SeriesImageSelector error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Loading images..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Selected: <span className="text-primary-600">{selectedIds.length}</span> images
          </p>
          {existingImages.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Deselect to remove, select to add
            </p>
          )}
        </div>
        <Button
          variant="primary"
          onClick={handleSave}
          loading={saving}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-96 overflow-y-auto p-4 bg-gray-50 dark:bg-dark-900 rounded-lg">
        {images.map((image) => {
          const isSelected = selectedIds.includes(image._id);

          return (
            <div
              key={image._id}
              onClick={() => toggleImage(image._id)}
              className={`group relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${
                isSelected
                  ? 'border-primary-600 ring-4 ring-primary-600/50 scale-95 shadow-xl'
                  : 'border-transparent hover:border-primary-300 hover:shadow-lg'
              }`}
            >
              <img
                src={image.thumbnailUrl || image.cloudinaryUrl}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
              />
              {isSelected && (
                <div className="absolute inset-0 bg-primary-600/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-primary-600 rounded-full p-2 shadow-lg">
                    <IoCheckmark className="text-white" size={24} />
                  </div>
                </div>
              )}
              <div className="absolute bottom-1 left-1 right-1 bg-gradient-to-t from-black/90 to-transparent p-2 rounded-b-lg">
                <p className="text-white text-xs font-medium truncate leading-tight">
                  {image.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {images.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <IoCloudUpload className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No images available</p>
          <p className="text-sm mb-4">Upload images first from the Images page</p>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/admin/images'}
            className="text-sm"
          >
            Go to Images →
          </Button>
        </div>
      )}
    </div>
  );
};

export default SeriesImageSelector;
