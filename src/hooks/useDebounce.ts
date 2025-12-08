/**
 * useDebounce Hook
 * Debounces a value with configurable delay
 */

import { useState, useEffect } from 'react';
import { CONFIG } from '../constants';

/**
 * Debounce a value
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds (default: from CONFIG)
 * @returns Debounced value
 */
export const useDebounce = <T>(value: T, delay = CONFIG.SEARCH_DEBOUNCE_MS): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
