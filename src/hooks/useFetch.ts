/**
 * useFetch Hook
 * Custom hook for data fetching with AbortController and timeout
 */

import { useState, useEffect, useRef } from 'react';
import type { UIState } from '../types';

interface UseFetchOptions {
  timeout?: number;
  skip?: boolean;
}

interface UseFetchResult<T> {
  data: T | null;
  error: Error | null;
  state: UIState;
  refetch: () => void;
}

/**
 * Custom fetch hook with AbortController and timeout
 * @param fetchFn - Async function to fetch data
 * @param deps - Dependencies array
 * @param options - Fetch options
 * @returns Fetch result
 */
export const useFetch = <T>(
  fetchFn: (signal: AbortSignal) => Promise<T>,
  deps: React.DependencyList,
  options: UseFetchOptions = {}
): UseFetchResult<T> => {
  const { timeout = 8000, skip = false } = options;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [state, setState] = useState<UIState>('idle');
  const abortControllerRef = useRef<AbortController | null>(null);
  const [refetchCounter, setRefetchCounter] = useState(0);

  const refetch = () => {
    setRefetchCounter(prev => prev + 1);
  };

  useEffect(() => {
    if (skip) {
      setState('idle');
      return;
    }

    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Set timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    const fetchData = async () => {
      setState('loading');
      setError(null);

      try {
        const result = await fetchFn(controller.signal);
        
        if (!controller.signal.aborted) {
          setData(result);
          
          // Check if result is empty
          if (Array.isArray(result) && result.length === 0) {
            setState('empty');
          } else if (result === null) {
            setState('empty');
          } else {
            setState('success');
          }
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          const error = err instanceof Error ? err : new Error('An error occurred');
          setError(error);
          setState('error');
        }
      } finally {
        clearTimeout(timeoutId);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, refetchCounter, skip, timeout]);

  return { data, error, state, refetch };
};
