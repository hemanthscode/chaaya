/**
 * useLazyLoad Hook
 * Lazy load images using Intersection Observer
 */

import { useEffect, useRef, useState } from 'react';

export const useLazyLoad = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    if (!targetRef.current) return;
    if (hasLoaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          setHasLoaded(true);
        }
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.01,
        ...options,
      }
    );

    observer.observe(targetRef.current);

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [hasLoaded, options]);

  return { targetRef, isIntersecting, hasLoaded };
};

export default useLazyLoad;
