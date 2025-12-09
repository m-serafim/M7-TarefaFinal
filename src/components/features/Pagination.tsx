/**
 * Pagination Component
 * Handles pagination with page size selector
 */

import { useRef } from 'react';
import type { PaginationOptions } from '../../types';
import { validatePageSize } from '../../utils';
import './Pagination.css';

interface PaginationProps {
  pagination: PaginationOptions;
  totalItems: number;
  onPaginationChange: (pagination: PaginationOptions) => void;
}

export const Pagination = ({ pagination, totalItems, onPaginationChange }: PaginationProps) => {
  const pageSizeInputRef = useRef<HTMLInputElement>(null);

  const totalPages = Math.ceil(totalItems / pagination.limit);
  const startItem = (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(pagination.page * pagination.limit, totalItems);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPaginationChange({
        ...pagination,
        page: newPage
      });
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    if (pageSizeInputRef.current && validatePageSize(pageSizeInputRef.current, newSize)) {
      onPaginationChange({
        page: 1, // Reset to first page when changing page size
        limit: newSize
      });
    }
  };

  const handleCustomPageSize = (value: string) => {
    const size = parseInt(value, 10);
    if (!isNaN(size)) {
      handlePageSizeChange(size);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (pagination.page > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, pagination.page - 1);
      const end = Math.min(totalPages - 1, pagination.page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (pagination.page < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="pagination">
      <div className="pagination-info">
        <span>
          Showing {startItem} to {endItem} of {totalItems} results
        </span>
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(1)}
          disabled={pagination.page === 1}
          aria-label="First page"
          type="button"
        >
          ⟪
        </button>

        <button
          className="pagination-button"
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          aria-label="Previous page"
          type="button"
        >
          ⟨
        </button>

        {getPageNumbers().map((pageNum, index) => (
          typeof pageNum === 'number' ? (
            <button
              key={index}
              className={`pagination-button ${pageNum === pagination.page ? 'active' : ''}`}
              onClick={() => handlePageChange(pageNum)}
              aria-label={`Page ${pageNum}`}
              aria-current={pageNum === pagination.page ? 'page' : undefined}
              type="button"
            >
              {pageNum}
            </button>
          ) : (
            <span key={index} className="pagination-ellipsis" aria-hidden="true">
              {pageNum}
            </span>
          )
        ))}

        <button
          className="pagination-button"
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === totalPages}
          aria-label="Next page"
          type="button"
        >
          ⟩
        </button>

        <button
          className="pagination-button"
          onClick={() => handlePageChange(totalPages)}
          disabled={pagination.page === totalPages}
          aria-label="Last page"
          type="button"
        >
          ⟫
        </button>
      </div>

      <div className="pagination-size">
        <label htmlFor="page-size" className="pagination-size-label">
          Per page:
        </label>
        <select
          id="page-size"
          className="pagination-size-select"
          value={pagination.limit}
          onChange={(e) => handlePageSizeChange(parseInt(e.target.value, 10))}
          aria-label="Items per page"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>

        <input
          ref={pageSizeInputRef}
          type="number"
          className="pagination-size-input"
          placeholder="Custom"
          min={1}
          max={100}
          onChange={(e) => handleCustomPageSize(e.target.value)}
          aria-label="Custom page size"
        />
      </div>
    </div>
  );
};
