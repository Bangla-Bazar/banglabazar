import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  isEnabled?: boolean;
}

interface UseInfiniteScrollReturn {
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  containerRef: React.RefObject<HTMLElement>;
  resetScroll: () => void;
}

export default function useInfiniteScroll(
  loadMoreItems: () => Promise<boolean>,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn {
  const { threshold = 100, isEnabled = true } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLElement>(null);

  const handleScroll = useCallback(async () => {
    if (!isEnabled || isLoading || !hasMore) return;

    const container = containerRef.current;
    if (!container) return;

    const {
      scrollTop,
      scrollHeight,
      clientHeight,
    } = container;

    // For window scrolling
    const windowScrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    const isContainerBottom = scrollTop + clientHeight >= scrollHeight - threshold;
    const isWindowBottom = windowScrollTop + windowHeight >= documentHeight - threshold;

    if (isContainerBottom || isWindowBottom) {
      setIsLoading(true);
      try {
        const hasMoreItems = await loadMoreItems();
        setHasMore(hasMoreItems);
      } catch (error) {
        console.error('Error loading more items:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isEnabled, isLoading, hasMore, loadMoreItems, threshold]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isEnabled) return;

    const handleScrollThrottled = throttle(handleScroll, 200);

    container.addEventListener('scroll', handleScrollThrottled);
    window.addEventListener('scroll', handleScrollThrottled);

    return () => {
      container.removeEventListener('scroll', handleScrollThrottled);
      window.removeEventListener('scroll', handleScrollThrottled);
    };
  }, [handleScroll, isEnabled]);

  const loadMore = useCallback(async () => {
    if (!isEnabled || isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const hasMoreItems = await loadMoreItems();
      setHasMore(hasMoreItems);
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isEnabled, isLoading, hasMore, loadMoreItems]);

  const resetScroll = useCallback(() => {
    setHasMore(true);
    setIsLoading(false);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, []);

  return {
    isLoading,
    hasMore,
    loadMore,
    containerRef,
    resetScroll,
  };
}

// Utility function for throttling
function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
} 