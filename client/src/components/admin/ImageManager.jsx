/**
 * ImageManager Component
 * Manage images in admin panel
 */

import React, { useState, useEffect } from 'react';
import { IoTrash, IoCreate, IoEye } from 'react-icons/io5';
import * as imageService from '@services/imageService';
import Button from '@components/common/Button';
import Modal from '@components/common/Modal';
import Input from '@components/common/Input';
import Dropdown from '@components/common/Dropdown';
import Pagination from '@components/common/Pagination';
import Loader from '@components/common/Loader';
import ErrorMessage from '@components/common/ErrorMessage';
import { useToast } from '@hooks/useToast';
import { formatDate, formatNumber } from '@utils/formatters';
import { IMAGE_STATUS, SUCCESS_MESSAGES } from '@utils/constants';

const ImageManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const toast = useToast();

  const fetchImages = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await imageService.getAll({ page, limit: 20 });
      setImages(response.images || []);
      setPagination(response.pagination || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleEdit = (image) => {
    setSelectedImage(image);
    setShowEditModal(true);
  };

  const handleDelete = (image) => {
    setSelectedImage(image);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await imageService.deleteImage(selectedImage._id);
      toast.success(SUCCESS_MESSAGES.IMAGE_DELETED);
      setShowDeleteModal(false);
      fetchImages(pagination.page);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      await imageService.update(selectedImage._id, {
        ...data,
        tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
        featured: data.featured === 'on',
      });
      toast.success(SUCCESS_MESSAGES.IMAGE_UPDATED);
      setShowEditModal(false);
      fetchImages(pagination.page);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading && images.length === 0) {
    return <Loader fullScreen text="Loading images..." />;
  }

  if (error && images.length === 0) {
    return <ErrorMessage message={error} onRetry={() => fetchImages()} fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage Images
        </h2>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
              {images.map((image) => (
                <tr key={image._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={image.thumbnailUrl}
                      alt={image.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {image.title}
                    </div>
                    {image.featured && (
                      <span className="badge badge-primary mt-1">Featured</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {image.category?.name || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <div>{formatNumber(image.views)} views</div>
                      <div>{formatNumber(image.likes)} likes</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`badge ${
                        image.status === IMAGE_STATUS.PUBLISHED
                          ? 'badge-success'
                          : 'badge-warning'
                      }`}
                    >
                      {image.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(image.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => window.open(`/image/${image._id}`, '_blank')}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                        title="View"
                      >
                        <IoEye size={20} />
                      </button>
                      <button
                        onClick={() => handleEdit(image)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                        title="Edit"
                      >
                        <IoCreate size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(image)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400"
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
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={fetchImages}
        />
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Image"
        size="lg"
      >
        {selectedImage && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <Input
              label="Title"
              name="title"
              defaultValue={selectedImage.title}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                defaultValue={selectedImage.description}
                rows={4}
                className="input"
              />
            </div>

            <Input
              label="Tags (comma separated)"
              name="tags"
              defaultValue={selectedImage.tags?.join(', ')}
            />

            <Dropdown
              label="Status"
              items={Object.values(IMAGE_STATUS).map(s => ({
                value: s,
                label: s.charAt(0).toUpperCase() + s.slice(1),
              }))}
              value={selectedImage.status}
              onChange={() => {}}
            />

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={selectedImage.featured}
                className="rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Featured Image
              </span>
            </label>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Image"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete "{selectedImage?.title}"? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ImageManager;
