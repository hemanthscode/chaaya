/**
 * ImageUploader Component
 * Drag & drop image upload with preview
 */

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { IoCloudUpload, IoClose, IoCheckmark } from 'react-icons/io5';
import clsx from 'clsx';
import * as imageService from '@services/imageService';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import { useToast } from '@hooks/useToast';
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES, SUCCESS_MESSAGES } from '@utils/constants';
import { validateImageFile } from '@utils/validators';
import { formatFileSize } from '@utils/formatters';

const ImageUploader = ({ onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const toast = useToast();

  const onDrop = useCallback((acceptedFiles) => {
    const validFiles = acceptedFiles.filter((file) => {
      const validation = validateImageFile(file, MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES);
      if (!validation.isValid) {
        toast.error(`${file.name}: ${validation.error}`);
        return false;
      }
      return true;
    });

    const newFiles = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      title: file.name.replace(/\.[^/.]+$/, ''),
      description: '',
      tags: '',
      featured: false,
      status: 'published',
      uploaded: false,
      error: null,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  });

  const removeFile = (index) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const updateFileData = (index, field, value) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      newFiles[index][field] = value;
      return newFiles;
    });
  };

  const uploadFile = async (fileData, index) => {
    const formData = new FormData();
    formData.append('image', fileData.file);
    formData.append('title', fileData.title);
    formData.append('description', fileData.description);
    formData.append('tags', fileData.tags);
    formData.append('featured', fileData.featured);
    formData.append('status', fileData.status);

    try {
      await imageService.upload(formData, (progress) => {
        setUploadProgress((prev) => ({
          ...prev,
          [index]: progress,
        }));
      });

      setFiles((prev) => {
        const newFiles = [...prev];
        newFiles[index].uploaded = true;
        return newFiles;
      });

      toast.success(`${fileData.title} uploaded successfully`);
    } catch (error) {
      setFiles((prev) => {
        const newFiles = [...prev];
        newFiles[index].error = error.message;
        return newFiles;
      });
      toast.error(`Failed to upload ${fileData.title}`);
    }
  };

  const handleUploadAll = async () => {
    setUploading(true);

    try {
      const unuploadedFiles = files.filter((f) => !f.uploaded && !f.error);

      for (let i = 0; i < files.length; i++) {
        if (!files[i].uploaded && !files[i].error) {
          await uploadFile(files[i], i);
        }
      }

      toast.success(SUCCESS_MESSAGES.IMAGE_UPLOADED);

      if (onUploadComplete) {
        onUploadComplete();
      }

      // Clear uploaded files
      setFiles((prev) => prev.filter((f) => !f.uploaded));
      setUploadProgress({});
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const hasUnuploadedFiles = files.some((f) => !f.uploaded && !f.error);

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={clsx(
          'border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-dark-600 hover:border-primary-500'
        )}
      >
        <input {...getInputProps()} />
        <IoCloudUpload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        {isDragActive ? (
          <p className="text-lg text-primary-600 dark:text-primary-400">
            Drop the images here...
          </p>
        ) : (
          <>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
              Drag & drop images here, or click to select
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supports: JPG, PNG, WEBP (Max {formatFileSize(MAX_FILE_SIZE)})
            </p>
          </>
        )}
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Selected Images ({files.length})
            </h3>
            {hasUnuploadedFiles && (
              <Button
                variant="primary"
                onClick={handleUploadAll}
                loading={uploading}
                disabled={uploading}
              >
                Upload All
              </Button>
            )}
          </div>

          {files.map((fileData, index) => (
            <div
              key={index}
              className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-4"
            >
              <div className="flex gap-4">
                {/* Preview */}
                <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-700">
                  <img
                    src={fileData.preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  {fileData.uploaded && (
                    <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
                      <IoCheckmark className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>

                {/* Form */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Input
                        placeholder="Image title"
                        value={fileData.title}
                        onChange={(e) => updateFileData(index, 'title', e.target.value)}
                        disabled={fileData.uploaded}
                      />
                    </div>
                    {!fileData.uploaded && (
                      <button
                        onClick={() => removeFile(index)}
                        className="ml-2 p-2 text-gray-400 hover:text-red-600 transition-colors"
                        aria-label="Remove"
                      >
                        <IoClose size={20} />
                      </button>
                    )}
                  </div>

                  <Input
                    placeholder="Description (optional)"
                    value={fileData.description}
                    onChange={(e) => updateFileData(index, 'description', e.target.value)}
                    disabled={fileData.uploaded}
                  />

                  <Input
                    placeholder="Tags (comma separated)"
                    value={fileData.tags}
                    onChange={(e) => updateFileData(index, 'tags', e.target.value)}
                    disabled={fileData.uploaded}
                  />

                  <div className="flex items-center gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={fileData.featured}
                        onChange={(e) => updateFileData(index, 'featured', e.target.checked)}
                        disabled={fileData.uploaded}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Featured
                      </span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={fileData.status === 'published'}
                        onChange={(e) =>
                          updateFileData(index, 'status', e.target.checked ? 'published' : 'draft')
                        }
                        disabled={fileData.uploaded}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Published
                      </span>
                    </label>
                  </div>

                  {/* Progress bar */}
                  {uploadProgress[index] !== undefined && !fileData.uploaded && (
                    <div className="w-full h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 transition-all duration-300"
                        style={{ width: `${uploadProgress[index]}%` }}
                      />
                    </div>
                  )}

                  {/* Error message */}
                  {fileData.error && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {fileData.error}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
