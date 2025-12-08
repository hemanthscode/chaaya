/**
 * Card Component
 * Reusable card container
 */

import React from 'react';
import clsx from 'clsx';

const Card = ({
  children,
  hover = false,
  padding = true,
  className,
  onClick,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'card',
        hover && 'card-hover cursor-pointer',
        padding && 'p-6',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
