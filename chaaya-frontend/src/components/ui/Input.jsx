import React from 'react';
import { twMerge } from 'tailwind-merge';

const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={twMerge(
        'flex h-9 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 shadow-sm outline-none ring-offset-slate-950 placeholder:text-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
