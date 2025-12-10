import React from 'react';
import { twMerge } from 'tailwind-merge';

const variants = {
  default: 'bg-slate-800 text-slate-100',
  success: 'bg-emerald-500/10 text-emerald-300',
  warning: 'bg-amber-500/10 text-amber-300',
  danger: 'bg-red-500/10 text-red-300',
  info: 'bg-sky-500/10 text-sky-300'
};

const Badge = ({ children, variant = 'default', className }) => {
  return (
    <span
      className={twMerge(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
