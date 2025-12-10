import React from 'react';
import { twMerge } from 'tailwind-merge';

const Progress = ({ value, className }) => {
  const safe = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <div className={twMerge('h-2 w-full overflow-hidden rounded-full bg-slate-800', className)}>
      <div
        className="h-full bg-gradient-to-r from-brand-500 to-emerald-400"
        style={{ width: `${safe}%` }}
      />
    </div>
  );
};

export default Progress;
