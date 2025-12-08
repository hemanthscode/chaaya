/**
 * ManageImages Page
 * Admin page for managing images
 */

import React, { useState } from 'react';
import { IoAdd, IoImages } from 'react-icons/io5';
import Container from '@components/layout/Container';
import ImageManager from '@components/admin/ImageManager';
import ImageUploader from '@components/admin/ImageUploader';
import Button from '@components/common/Button';
import Modal from '@components/common/Modal';

const ManageImages = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadComplete = () => {
    setShowUploadModal(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="py-8">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Manage Images
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Upload, edit, and organize your images
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={<IoAdd />}
            onClick={() => setShowUploadModal(true)}
          >
            Upload Images
          </Button>
        </div>

        {/* Image Manager */}
        <ImageManager key={refreshKey} />

        {/* Upload Modal */}
        <Modal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          title="Upload Images"
          size="xl"
        >
          <ImageUploader onUploadComplete={handleUploadComplete} />
        </Modal>
      </Container>
    </div>
  );
};

export default ManageImages;
