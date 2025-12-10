import { useState, useCallback } from 'react';

export const useLightbox = (items = []) => {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const open = useCallback((startIndex = 0) => {
    setIndex(startIndex);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  return {
    isOpen,
    index,
    current: items[index],
    open,
    close,
    next,
    prev
  };
};
