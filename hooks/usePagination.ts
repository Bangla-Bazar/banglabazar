import { useMemo } from 'react';

interface UsePaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
}

export default function usePagination({
  totalItems,
  pageSize,
  currentPage,
}: UsePaginationProps) {
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const page = Math.min(Math.max(currentPage, 1), totalPages);
    
    const from = Math.min(totalItems, (page - 1) * pageSize + 1);
    const to = Math.min(totalItems, page * pageSize);
    
    const canPrevPage = page > 1;
    const canNextPage = page < totalPages;

    const pages = Array.from(
      { length: totalPages },
      (_, i) => i + 1
    );

    return {
      currentPage: page,
      totalPages,
      canPrevPage,
      canNextPage,
      pages,
      from,
      to,
    };
  }, [totalItems, pageSize, currentPage]);

  return paginationData;
} 