import React from 'react';
import { twMerge } from 'tailwind-merge';

const Tooltip = ({ children, content, className }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      {open && (
        <div
          className={twMerge(
            'absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] text-slate-100 shadow-soft',
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
