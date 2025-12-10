import React from 'react';
import { twMerge } from 'tailwind-merge';

export const Card = ({ className, ...props }) => (
  <div
    className={twMerge('rounded-xl border border-slate-800 bg-slate-900 p-4', className)}
    {...props}
  />
);

export const CardHeader = ({ className, ...props }) => (
  <div className={twMerge('mb-3 flex items-center justify-between', className)} {...props} />
);

export const CardTitle = ({ className, ...props }) => (
  <h2 className={twMerge('text-sm font-semibold text-slate-100', className)} {...props} />
);

export const CardContent = ({ className, ...props }) => (
  <div className={twMerge('text-sm text-slate-200', className)} {...props} />
);
