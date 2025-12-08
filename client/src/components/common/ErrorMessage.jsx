/**
 * ErrorMessage Component
 * Display error messages with retry option
 */

import React from 'react';
import clsx from 'clsx';
import { IoAlertCircle, IoRefresh } from 'react-icons/io5';
import Button from './Button';

const ErrorMessage = ({
  message = 'Something went wrong',
  onRetry,
  fullScreen = false,
  className,
}) => {
  const content = (
    <div className={clsx('text-center', className)}>
      <IoAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="primary"
          leftIcon={<IoRefresh />}
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return (
    <div className="p-8">
      {content}
    </div>
  );
};

export default ErrorMessage;
