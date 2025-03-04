import { useState, useEffect, useCallback } from 'react';

type MediaQueryObject = {
  [key: string]: string | number | boolean;
};

function isClient(): boolean {
  return typeof window !== 'undefined';
}

function constructMediaQuery(query: string | MediaQueryObject): string {
  if (typeof query === 'string') {
    return query;
  }

  return Object.entries(query)
    .map(([feature, value]) => {
      // Convert camelCase to kebab-case
      const kebabFeature = feature.replace(
        /[A-Z]/g,
        letter => `-${letter.toLowerCase()}`
      );

      if (typeof value === 'boolean') {
        return value ? kebabFeature : `not ${kebabFeature}`;
      }

      return `(${kebabFeature}: ${value})`;
    })
    .join(' and ');
}

interface UseMediaQueryOptions {
  defaultValue?: boolean;
  initializeWithValue?: boolean;
}

export default function useMediaQuery(
  query: string | MediaQueryObject,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {}
): boolean {
  const [matches, setMatches] = useState(() => {
    if (!initializeWithValue || !isClient()) {
      return defaultValue;
    }

    const mediaQuery = constructMediaQuery(query);
    return window.matchMedia(mediaQuery).matches;
  });

  const handleChange = useCallback(
    (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    },
    []
  );

  useEffect(() => {
    if (!isClient()) {
      return;
    }

    const mediaQuery = constructMediaQuery(query);
    const mql = window.matchMedia(mediaQuery);

    // Set initial value
    setMatches(mql.matches);

    // Modern browsers
    if (mql.addEventListener) {
      mql.addEventListener('change', handleChange);
      return () => mql.removeEventListener('change', handleChange);
    }
    // Older browsers
    else if (mql.addListener) {
      mql.addListener(handleChange);
      return () => mql.removeListener(handleChange);
    }
  }, [query, handleChange]);

  return matches;
}

// Predefined breakpoints (following Tailwind CSS defaults)
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Predefined media queries
export const mediaQueries = {
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  '2xl': `(min-width: ${breakpoints['2xl']})`,
  dark: '(prefers-color-scheme: dark)',
  light: '(prefers-color-scheme: light)',
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
  retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
  motion: '(prefers-reduced-motion: no-preference)',
  hover: '(hover: hover)',
} as const;

// Example usage:
// const isMobile = useMediaQuery(mediaQueries.sm);
// const isDarkMode = useMediaQuery(mediaQueries.dark);
// const isRetina = useMediaQuery(mediaQueries.retina);
//
// const isTablet = useMediaQuery({
//   minWidth: '768px',
//   maxWidth: '1023px',
//   orientation: 'landscape',
// }); 