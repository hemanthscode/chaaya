/**
 * ImageMetadata Component
 * Display image EXIF metadata
 */

import React from 'react';
import { IoCamera, IoAperture, IoTime, IoLocation, IoCalendar } from 'react-icons/io5';
import { formatDate, formatCameraSettings } from '@utils/formatters';
import Card from '@components/common/Card';

const ImageMetadata = ({ metadata, dateTaken, className }) => {
  if (!metadata || Object.keys(metadata).length === 0) {
    return null;
  }

  const metadataItems = [
    {
      icon: IoCamera,
      label: 'Camera',
      value: metadata.camera,
    },
    {
      icon: IoAperture,
      label: 'Lens',
      value: metadata.lens,
    },
    {
      icon: IoTime,
      label: 'Settings',
      value: formatCameraSettings(metadata),
    },
    {
      icon: IoLocation,
      label: 'Location',
      value: metadata.location,
    },
    {
      icon: IoCalendar,
      label: 'Date Taken',
      value: dateTaken ? formatDate(dateTaken) : metadata.dateTaken ? formatDate(metadata.dateTaken) : null,
    },
  ].filter(item => item.value);

  if (metadataItems.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Image Details
      </h3>

      <div className="space-y-3">
        {metadataItems.map((item, index) => (
          <div key={index} className="flex items-start space-x-3">
            <item.icon className="flex-shrink-0 text-primary-600 dark:text-primary-400 mt-0.5" size={20} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {item.label}
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ImageMetadata;
