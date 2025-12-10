import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

export const useInfiniteScroll = (onLoadMore, hasMore, isLoading) => {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    if (inView && hasMore && !isLoading) {
      onLoadMore?.();
    }
  }, [inView, hasMore, isLoading, onLoadMore]);

  return ref;
};
