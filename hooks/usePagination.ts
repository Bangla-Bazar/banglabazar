import { useState, useCallback, useEffect } from 'react';

interface UsePaginationProps {
  initialPage?: number;
  initialPageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

interface UsePaginationReturn {
  page: number;
  pageSize: number;
  totalPages: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  canPrevPage: boolean;
  canNextPage: boolean;
  pageRangeDisplayed: number[];
  from: number;
  to: number;
}

export default function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
}: UsePaginationProps = {}): UsePaginationReturn {
  const [page, setPageInternal] = useState(initialPage);
  const [pageSize, setPageSizeInternal] = useState(initialPageSize);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPageInternal(totalPages);
    }
  }, [totalPages, page]);

  const setPage = useCallback(
    (newPage: number) => {
      const clampedPage = Math.max(1, Math.min(newPage, totalPages));
      setPageInternal(clampedPage);
      onPageChange?.(clampedPage);
    },
    [totalPages, onPageChange]
  );

  const setPageSize = useCallback(
    (newPageSize: number) => {
      setPageSizeInternal(newPageSize);
      onPageSizeChange?.(newPageSize);
      // Adjust current page if necessary
      const newTotalPages = Math.ceil(totalItems / newPageSize);
      if (page > newTotalPages) {
        setPage(newTotalPages);
      }
    },
    [totalItems, page, setPage, onPageSizeChange]
  );

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }, [page, totalPages, setPage]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page, setPage]);

  const firstPage = useCallback(() => {
    setPage(1);
  }, [setPage]);

  const lastPage = useCallback(() => {
    setPage(totalPages);
  }, [totalPages, setPage]);

  const canPrevPage = page > 1;
  const canNextPage = page < totalPages;

  // Calculate page range to display
  const getPageRange = useCallback(() => {
    const delta = 2; // Number of pages to show before and after current page
    const range: number[] = [];
    const rangeWithDots: number[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        range.push(i);
      }
    }

    let l: number;
    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push(-1); // Represents dots
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }, [page, totalPages]);

  const from = Math.min(totalItems, (page - 1) * pageSize + 1);
  const to = Math.min(totalItems, page * pageSize);

  return {
    page,
    pageSize,
    totalPages,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    canPrevPage,
    canNextPage,
    pageRangeDisplayed: getPageRange(),
    from,
    to,
  };
} 