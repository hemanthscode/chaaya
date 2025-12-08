/**
 * Loader Component
 * Loading spinner with variants
 */

import React from 'react';
import clsx from 'clsx';

const Loader = ({
  size = 'md',
  fullScreen = false,
  text,
  className,
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const loader = (
    <div className={clsx('flex flex-col items-center justify-center gap-3', className)}>
      <div className={clsx('spinner', sizes[size])} />
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-dark-900 z-50">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader;
