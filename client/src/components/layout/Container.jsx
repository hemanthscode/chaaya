/**
 * Container Component
 * Centered container with max width
 */

import React from 'react';
import clsx from 'clsx';

const Container = ({ children, className, size = 'default' }) => {
  const sizes = {
    sm: 'max-w-4xl',
    default: 'max-w-7xl',
    lg: 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  return (
    <div className={clsx('container-custom', sizes[size], className)}>
      {children}
    </div>
  );
};

export default Container;
