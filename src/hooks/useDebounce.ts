/**
 * useDebounce Hook
 * Debounces a value with configurable delay
 */

import { useState, useEffect } from 'react';

/**
 * Debounce a value
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds (default: 400)
 * @returns Debounced value
 */
export const useDebounce = <T>(value: T, delay = 400): T => {
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
