/**
 * Memoization utilities for performance optimization
 */

/**
 * Simple memoization function for expensive computations
 */
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

/**
 * Clear memoization cache
 */
export const clearMemoCache = (): void => {
  // This would need to be implemented per memoized function
  // For now, it's a placeholder for future implementation
};
