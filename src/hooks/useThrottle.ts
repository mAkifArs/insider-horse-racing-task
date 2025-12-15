import { useRef, useCallback } from "react";
import { throttle } from "../utils/performance";

/**
 * Custom hook for throttling function calls
 */
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  const throttledCallback = useRef(
    throttle(callback, delay)
  ).current;

  return useCallback(
    (...args: Parameters<T>) => {
      throttledCallback(...args);
    },
    [throttledCallback]
  );
};

