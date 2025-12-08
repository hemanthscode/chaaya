/**
 * CategoryManager Component
 * Manage categories in admin panel
 */

import React, { useState, useEffect } from 'react';
import { IoTrash, IoCreate, IoAdd } from 'react-icons/io5';
import * as categoryService from '@services/categoryService';
import Button from '@components/common/Button';
import Modal from '@components/common/Modal';
import Input from '@components/common/Input';
import { useToast } from '@hooks/useToast';
import { formatNumber } from '@utils/formatters';
import { SUCCESS_MESSAGES } from '@utils/constants';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const toast = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      setCategories(response.categories || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = () => {
    setSelectedCategory(null);
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await categoryService.deleteCategory(selectedCategory._id);
      toast.success(SUCCESS_MESSAGES.CATEGORY_DELETED);
      setShowDeleteModal(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      if (selectedCategory) {
        await categoryService.update(selectedCategory._id, data);
        toast.success(SUCCESS_MESSAGES.CATEGORY_UPDATED);
      } else {
        await categoryService.create(data);
        toast.success(SUCCESS_MESSAGES.CATEGORY_CREATED);
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage Categories
        </h2>
        <Button variant="primary" leftIcon={<IoAdd />} onClick={handleCreate}>
          Create Category
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category._id}
            className="card p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {category.slug}
                </p>
              </div>
              <span className="badge badge-primary">
                {formatNumber(category.imageCount)} images
              </span>
            </div>

            {category.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {category.description}
              </p>
            )}

            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => handleEdit(category)}
                className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                title="Edit"
              >
                <IoCreate size={20} />
              </button>
              <button
                onClick={() => handleDelete(category)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete"
              >
                <IoTrash size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedCategory ? 'Edit Category' : 'Create Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            defaultValue={selectedCategory?.name}
            required
          />

          <Input
            label="Slug"
            name="slug"
            defaultValue={selectedCategory?.slug}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={selectedCategory?.description}
              rows={3}
              className="input"
            />
          </div>

          <Input
            type="number"
            label="Order"
            name="order"
            defaultValue={selectedCategory?.order || 0}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {selectedCategory ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Category"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete "{selectedCategory?.name}"? Images in this category will not be deleted.
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

export default CategoryManager;
