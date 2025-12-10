import React from 'react';

const LoadingSpinner = ({ fullScreen = false }) => {
  const spinner = (
    <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      <span>Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
