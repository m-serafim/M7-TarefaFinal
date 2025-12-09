/**
 * SearchBar Component
 * Search input with debounce and Enter key support
 */

import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { useDebounce } from '../../hooks';
import { validateSearchInput } from '../../utils';
import { CONFIG } from '../../constants';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  disabled?: boolean;
}

export const SearchBar = ({
  onSearch,
  initialValue = '',
  disabled = false
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const debouncedQuery = useDebounce(searchQuery, CONFIG.SEARCH_DEBOUNCE_MS);
  const inputRef = useRef<HTMLInputElement>(null);
  const isManualSearch = useRef(false);

  // Trigger search on debounced value change
  useEffect(() => {
    if (!isManualSearch.current) {
      onSearch(debouncedQuery);
    }
    isManualSearch.current = false;
  }, [debouncedQuery, onSearch]);

  // Handle Enter key for immediate search
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (inputRef.current && validateSearchInput(inputRef.current, searchQuery)) {
        isManualSearch.current = true;
        onSearch(searchQuery);
      }
    }
  };

  const handleChange = (value: string) => {
    setSearchQuery(value);

    // Clear custom validity on change
    if (inputRef.current) {
      inputRef.current.setCustomValidity('');
    }
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon-wrapper">
          <svg
            className="search-icon-svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input
          ref={inputRef}
          id="search-input"
          type="text"
          className="search-input"
          placeholder="Search for games, e.g. 'Elden Ring'..."
          value={searchQuery}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Search games"
          maxLength={100}
          disabled={disabled}
        />
        <div className="search-actions">
          <span className="search-shortcut">/</span>
          {searchQuery && (
            <button
              className="search-clear"
              onClick={() => handleChange('')}
              aria-label="Clear search"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
