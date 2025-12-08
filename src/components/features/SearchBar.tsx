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
  placeholder?: string;
}

export const SearchBar = ({ 
  onSearch, 
  initialValue = '', 
  placeholder = 'Pesquisar jogos...' 
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
      <label htmlFor="search-input" className="sr-only">
        Pesquisar jogos
      </label>
      <div className="search-input-wrapper">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          ref={inputRef}
          id="search-input"
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Pesquisar jogos"
          maxLength={100}
        />
        {searchQuery && (
          <button
            className="search-clear"
            onClick={() => handleChange('')}
            aria-label="Limpar pesquisa"
            type="button"
          >
            ✕
          </button>
        )}
      </div>
      <p className="search-hint">
        Pesquisa com debounce de {CONFIG.SEARCH_DEBOUNCE_MS}ms | Pressione Enter para pesquisar imediatamente
      </p>
    </div>
  );
};
