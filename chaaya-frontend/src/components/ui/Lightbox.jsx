import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Lightbox = ({ isOpen, image, onClose, onPrev, onNext }) => {
  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <button
        className="absolute right-4 top-4 rounded-full p-2 text-slate-200 hover:bg-slate-800"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </button>
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-200 hover:bg-slate-800"
        onClick={onPrev}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-200 hover:bg-slate-800"
        onClick={onNext}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <div className="max-h-[80vh] max-w-5xl">
        <img
          src={image.url || image.secureUrl || image.src}
          alt={image.title || 'Photo'}
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
};

export default Lightbox;
