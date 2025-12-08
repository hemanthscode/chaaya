/**
 * SeriesManager Component
 * Manage series with thumbnails, status dropdown, and image management
 */

import React, { useState, useEffect } from 'react';
import { IoTrash, IoCreate, IoAdd, IoImages, IoCloudUpload, IoCheckmark } from 'react-icons/io5';
import * as seriesService from '@services/seriesService';
import * as imageService from '@services/imageService';
import Button from '@components/common/Button';
import Modal from '@components/common/Modal';
import Input from '@components/common/Input';
import SeriesImageSelector from '@components/admin/SeriesImageSelector';
import { useToast } from '@hooks/useToast';
import { formatDate, formatNumber } from '@utils/formatters';
import { SERIES_STATUS, SUCCESS_MESSAGES } from '@utils/constants';

const SeriesManager = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateWithImages, setShowCreateWithImages] = useState(false);
  const [availableImages, setAvailableImages] = useState([]);
  const [selectedImageIds, setSelectedImageIds] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [selectedSeriesForImages, setSelectedSeriesForImages] = useState(null);
  
  const toast = useToast();

  const fetchSeries = async () => {
    try {
      setLoading(true);
      const response = await seriesService.getAll();
      setSeries(response.series || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableImages = async () => {
    try {
      setLoadingImages(true);
      const response = await imageService.getAll({ limit: 100 });
      setAvailableImages(response.images || []);
      
      if (response.images.length === 0) {
        toast.info('No images available. Please upload images first from the Images page.');
      }
    } catch (error) {
      console.error('Failed to fetch images:', error);
      toast.error('Failed to load images');
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  const handleCreate = () => {
    setSelectedSeries(null);
    setSelectedImageIds([]);
    setShowCreateWithImages(true);
    fetchAvailableImages();
  };

  const handleEdit = (item) => {
    setSelectedSeries(item);
    setSelectedImageIds(item.images?.map(img => img._id || img) || []);
    setShowCreateWithImages(true);
    fetchAvailableImages();
  };

  const handleDelete = (item) => {
    setSelectedSeries(item);
    setShowDeleteModal(true);
  };

  const handleManageImages = (item) => {
    setSelectedSeriesForImages(item);
    setShowImageSelector(true);
  };

  const confirmDelete = async () => {
    try {
      await seriesService.deleteSeries(selectedSeries._id);
      toast.success(SUCCESS_MESSAGES.SERIES_DELETED);
      setShowDeleteModal(false);
      fetchSeries();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleImageSelection = (imageId) => {
    setSelectedImageIds(prev =>
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleSubmitWithImages = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // ✅ FIXED: Convert checkbox + status dropdown
    data.featured = data.featured === 'on';
    data.status = data.status || 'draft'; // ✅ From dropdown
    delete data.published;

    try {
      let seriesId;
      
      if (selectedSeries) {
        await seriesService.update(selectedSeries._id, data);
        seriesId = selectedSeries._id;
        toast.success(SUCCESS_MESSAGES.SERIES_UPDATED);
      } else {
        const response = await seriesService.create(data);
        seriesId = response.series?._id || response._id;
        toast.success(SUCCESS_MESSAGES.SERIES_CREATED);
      }

      if (selectedImageIds.length > 0) {
        await seriesService.addImages(seriesId, selectedImageIds);
        toast.success(`${selectedImageIds.length} images added to series`);
      }

      setShowCreateWithImages(false);
      fetchSeries();
    } catch (error) {
      toast.error(error.message);
      console.error('Submit error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage Series
        </h2>
        <Button variant="primary" leftIcon={<IoAdd />} onClick={handleCreate}>
          Create Series
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-20">
                  Thumbnail
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Images
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
              {series.map((item) => (
                <tr key={item._id}>
                  {/* THUMBNAIL COLUMN */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-700">
                      <img
                        src={item.thumbnailUrl || '/api/placeholder/64/64'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/64/64';
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </div>
                    {item.featured && (
                      <span className="badge badge-primary mt-1">Featured</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatNumber(item.imageCount || 0)}
                      </span>
                      <button
                        onClick={() => handleManageImages(item)}
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                        title="Manage Images"
                      >
                        <IoImages size={18} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {formatNumber(item.views || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`badge ${
                        item.status === SERIES_STATUS.PUBLISHED
                          ? 'badge-success'
                          : 'badge-warning'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleManageImages(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Manage Images"
                      >
                        <IoImages size={20} />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <IoCreate size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <IoTrash size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {series.length === 0 && !loading && (
          <div className="text-center py-12">
            <IoImages className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No series created yet
            </p>
            <Button
              variant="primary"
              leftIcon={<IoAdd />}
              onClick={handleCreate}
            >
              Create Your First Series
            </Button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateWithImages}
        onClose={() => setShowCreateWithImages(false)}
        title={selectedSeries ? 'Edit Series' : 'Create Series'}
        size="xl"
      >
        <form onSubmit={handleSubmitWithImages} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Series Information
            </h3>
            
            <Input
              label="Title"
              name="title"
              defaultValue={selectedSeries?.title}
              placeholder="e.g., Urban Landscapes"
              required
            />

            <Input
              label="Slug"
              name="slug"
              defaultValue={selectedSeries?.slug}
              placeholder="e.g., urban-landscapes"
              required
              helpText="URL-friendly version of the title"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                defaultValue={selectedSeries?.description}
                rows={3}
                className="input"
                placeholder="Describe this series..."
              />
            </div>

            {/* ✅ STATUS DROPDOWN + FEATURED */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={selectedSeries?.status || 'draft'}
                  className="input w-full"
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={selectedSeries?.featured}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Featured Series
                </span>
              </label>
            </div>
          </div>

          {/* Image Selection */}
          <div className="space-y-4 border-t border-gray-200 dark:border-dark-700 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Select Images from Gallery
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Click on images to select/deselect them for this series
                </p>
              </div>
              <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                {selectedImageIds.length} selected
              </p>
            </div>

            {loadingImages ? (
              <div className="text-center py-8">
                <div className="spinner w-8 h-8 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading images...</p>
              </div>
            ) : availableImages.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg">
                <IoCloudUpload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">
                  No images available
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                  You need to upload images first before creating a series
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.location.href = '/admin/images'}
                >
                  Go to Images Page
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 max-h-80 overflow-y-auto p-2 bg-gray-50 dark:bg-dark-900 rounded-lg">
                {availableImages.map((image) => {
                  const isSelected = selectedImageIds.includes(image._id);
                  
                  return (
                    <div
                      key={image._id}
                      onClick={() => toggleImageSelection(image._id)}
                      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${
                        isSelected
                          ? 'ring-4 ring-primary-600 scale-95 shadow-lg'
                          : 'hover:opacity-75 hover:scale-105 hover:shadow-md'
                      }`}
                    >
                      <img
                        src={image.thumbnailUrl || image.cloudinaryUrl}
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary-600/60 flex items-center justify-center backdrop-blur-[1px]">
                          <div className="bg-primary-600 rounded-full p-1.5 shadow-lg">
                            <IoCheckmark className="text-white" size={20} />
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2">
                        <p className="text-white text-xs font-medium truncate">
                          {image.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-dark-700">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowCreateWithImages(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {selectedSeries ? 'Update Series' : 'Create Series'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Series"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete <strong>"{selectedSeries?.title}"</strong>?
          <br />
          <span className="text-sm">
            Images in this series will not be deleted.
          </span>
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete Series
          </Button>
        </div>
      </Modal>

      {/* Image Selector Modal */}
      <Modal
        isOpen={showImageSelector}
        onClose={() => setShowImageSelector(false)}
        title={`Manage Images - ${selectedSeriesForImages?.title}`}
        size="xl"
      >
        <SeriesImageSelector
          seriesId={selectedSeriesForImages?._id}
          existingImages={selectedSeriesForImages?.images || []}
          onComplete={() => {
            setShowImageSelector(false);
            fetchSeries();
          }}
        />
      </Modal>
    </div>
  );
};

export default SeriesManager;
