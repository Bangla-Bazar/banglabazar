import { useState, useEffect, useCallback } from 'react';
import { throttle } from 'lodash';

interface ScrollPosition {
  x: number;
  y: number;
}

interface UseScrollPositionOptions {
  element?: HTMLElement | null;
  throttleMs?: number;
  onScroll?: (position: ScrollPosition) => void;
}

interface UseScrollPositionReturn extends ScrollPosition {
  isScrolling: boolean;
  scrollTo: (position: Partial<ScrollPosition>) => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;
}

export default function useScrollPosition({
  element,
  throttleMs = 100,
  onScroll,
}: UseScrollPositionOptions = {}): UseScrollPositionReturn {
  const [position, setPosition] = useState<ScrollPosition>({ x: 0, y: 0 });
  const [isScrolling, setIsScrolling] = useState(false);

  // Get the scrollable element
  const getScrollElement = useCallback(
    () => element || (typeof window !== 'undefined' ? window : null),
    [element]
  );

  // Get current scroll position
  const getScrollPosition = useCallback((): ScrollPosition => {
    const scrollElement = getScrollElement();

    if (!scrollElement) {
      return { x: 0, y: 0 };
    }

    if (scrollElement === window) {
      return {
        x: window.scrollX || window.pageXOffset,
        y: window.scrollY || window.pageYOffset,
      };
    }

    return {
      x: (scrollElement as HTMLElement).scrollLeft,
      y: (scrollElement as HTMLElement).scrollTop,
    };
  }, [getScrollElement]);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    const newPosition = getScrollPosition();
    setPosition(newPosition);
    onScroll?.(newPosition);
    
    // Set isScrolling to true and clear previous timeout
    setIsScrolling(true);
    if (window._scrollTimeout) {
      window.clearTimeout(window._scrollTimeout);
    }
    
    // Set a timeout to set isScrolling to false after scrolling stops
    window._scrollTimeout = window.setTimeout(() => {
      setIsScrolling(false);
    }, 150) as unknown as number;
  }, [getScrollPosition, onScroll]);

  // Set up scroll listener
  useEffect(() => {
    const scrollElement = getScrollElement();
    if (!scrollElement) return;

    const throttledHandleScroll = throttle(handleScroll, throttleMs);
    
    // Set initial position
    handleScroll();

    // Add scroll listener
    scrollElement.addEventListener('scroll', throttledHandleScroll);

    return () => {
      scrollElement.removeEventListener('scroll', throttledHandleScroll);
      if (window._scrollTimeout) {
        window.clearTimeout(window._scrollTimeout);
      }
    };
  }, [getScrollElement, handleScroll, throttleMs]);

  // Scroll to position
  const scrollTo = useCallback(
    (newPosition: Partial<ScrollPosition>) => {
      const scrollElement = getScrollElement();
      if (!scrollElement) return;

      const { x = position.x, y = position.y } = newPosition;

      if (scrollElement === window) {
        window.scrollTo(x, y);
      } else {
        (scrollElement as HTMLElement).scrollLeft = x;
        (scrollElement as HTMLElement).scrollTop = y;
      }
    },
    [getScrollElement, position]
  );

  // Scroll to top
  const scrollToTop = useCallback(() => {
    scrollTo({ y: 0 });
  }, [scrollTo]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    const scrollElement = getScrollElement();
    if (!scrollElement) return;

    if (scrollElement === window) {
      scrollTo({ y: document.documentElement.scrollHeight });
    } else {
      scrollTo({ y: (scrollElement as HTMLElement).scrollHeight });
    }
  }, [getScrollElement, scrollTo]);

  return {
    x: position.x,
    y: position.y,
    isScrolling,
    scrollTo,
    scrollToTop,
    scrollToBottom,
  };
}

// Extend Window interface to include our custom timeout property
declare global {
  interface Window {
    _scrollTimeout?: number;
  }
} 