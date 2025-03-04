import { useState, useEffect, useCallback } from 'react';
import { throttle } from 'lodash';

interface WindowDimensions {
  width: number;
  height: number;
  scrollX: number;
  scrollY: number;
  isClient: boolean;
}

interface UseWindowDimensionsOptions {
  throttleMs?: number;
  includeScroll?: boolean;
}

function getWindowDimensions(includeScroll: boolean = false): WindowDimensions {
  const isClient = typeof window !== 'undefined';

  if (!isClient) {
    return {
      width: 0,
      height: 0,
      scrollX: 0,
      scrollY: 0,
      isClient: false,
    };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
    scrollX: includeScroll ? window.scrollX : 0,
    scrollY: includeScroll ? window.scrollY : 0,
    isClient: true,
  };
}

export default function useWindowDimensions({
  throttleMs = 200,
  includeScroll = false,
}: UseWindowDimensionsOptions = {}): WindowDimensions {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>(
    getWindowDimensions(includeScroll)
  );

  const handleResize = useCallback(
    throttle(() => {
      setWindowDimensions(getWindowDimensions(includeScroll));
    }, throttleMs),
    [includeScroll, throttleMs]
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Set initial dimensions
    setWindowDimensions(getWindowDimensions(includeScroll));

    // Add event listeners
    window.addEventListener('resize', handleResize);
    if (includeScroll) {
      window.addEventListener('scroll', handleResize);
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (includeScroll) {
        window.removeEventListener('scroll', handleResize);
      }
      handleResize.cancel();
    };
  }, [handleResize, includeScroll]);

  return windowDimensions;
}

// Example usage:
// const { width, height, scrollX, scrollY, isClient } = useWindowDimensions({
//   throttleMs: 500,
//   includeScroll: true,
// });
//
// // Responsive design
// const isMobile = width < 768;
// const isTablet = width >= 768 && width < 1024;
// const isDesktop = width >= 1024;
//
// // Infinite scroll
// const isNearBottom = scrollY + height >= document.body.scrollHeight - 100; 