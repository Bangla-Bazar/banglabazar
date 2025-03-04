import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';

interface UseSearchOptions<T> {
  initialQuery?: string;
  debounceMs?: number;
  minQueryLength?: number;
  searchFn: (query: string) => Promise<T[]>;
  onError?: (error: Error) => void;
}

interface UseSearchReturn<T> {
  query: string;
  results: T[];
  isLoading: boolean;
  error: Error | null;
  setQuery: (query: string) => void;
  clearSearch: () => void;
  refreshSearch: () => Promise<void>;
}

export default function useSearch<T>({
  initialQuery = '',
  debounceMs = 300,
  minQueryLength = 2,
  searchFn,
  onError,
}: UseSearchOptions<T>): UseSearchReturn<T> {
  const [query, setQueryInternal] = useState(initialQuery);
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Keep track of the latest query to prevent race conditions
  const latestQuery = useRef(query);

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < minQueryLength) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Only update results if this is still the latest query
        if (searchQuery === latestQuery.current) {
          const searchResults = await searchFn(searchQuery);
          setResults(searchResults);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Search failed');
        setError(error);
        onError?.(error);
        setResults([]);
      } finally {
        if (searchQuery === latestQuery.current) {
          setIsLoading(false);
        }
      }
    },
    [searchFn, minQueryLength, onError]
  );

  // Create a debounced version of performSearch
  const debouncedSearch = useCallback(
    debounce(performSearch, debounceMs),
    [performSearch, debounceMs]
  );

  // Cancel debounced search on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Perform search when query changes
  useEffect(() => {
    latestQuery.current = query;

    if (query.length < minQueryLength) {
      setResults([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    debouncedSearch(query);
  }, [query, minQueryLength, debouncedSearch]);

  const setQuery = useCallback((newQuery: string) => {
    setQueryInternal(newQuery);
  }, []);

  const clearSearch = useCallback(() => {
    setQueryInternal('');
    setResults([]);
    setError(null);
    setIsLoading(false);
  }, []);

  const refreshSearch = useCallback(async () => {
    if (query.length >= minQueryLength) {
      await performSearch(query);
    }
  }, [query, minQueryLength, performSearch]);

  return {
    query,
    results,
    isLoading,
    error,
    setQuery,
    clearSearch,
    refreshSearch,
  };
} 