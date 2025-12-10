import React from 'react';
import { twMerge } from 'tailwind-merge';

const Skeleton = ({ className }) => {
  return (
    <div
      className={twMerge(
        'animate-pulse rounded-md bg-slate-800/70',
        className
      )}
    />
  );
};

export default Skeleton;
