import { useRef, useCallback } from "react";
import { debounce } from "../utils/performance";

/**
 * Custom hook for debouncing function calls
 */
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  const debouncedCallback = useRef(
    debounce(callback, delay)
  ).current;

  return useCallback(
    (...args: Parameters<T>) => {
      debouncedCallback(...args);
    },
    [debouncedCallback]
  );
};

