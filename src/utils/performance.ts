/**
 * Performance utilities and helpers
 */

/**
 * Throttle function calls to limit execution frequency
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Debounce function calls to delay execution until after wait time
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
};

/**
 * Request Animation Frame wrapper for smooth animations
 * The callback receives a DOMHighResTimeStamp (time in ms since page load)
 */
export const requestAnimationFrame = (
  callback: (time: number) => void
): number => {
  if (typeof window !== "undefined" && window.requestAnimationFrame) {
    return window.requestAnimationFrame(callback);
  }
  // Fallback: pass performance.now() as timestamp
  return setTimeout(() => callback(performance.now()), 16) as unknown as number;
};

/**
 * Cancel Animation Frame wrapper
 */
export const cancelAnimationFrame = (id: number): void => {
  if (typeof window !== "undefined" && window.cancelAnimationFrame) {
    window.cancelAnimationFrame(id);
  } else {
    clearTimeout(id);
  }
};
