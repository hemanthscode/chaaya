// src/components/ui/Modal.jsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ title, children, onClose, size = 'md' }) => {
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div
        className={`w-full ${sizeClasses[size]} overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
          <h2 className="text-base font-semibold text-slate-50">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
