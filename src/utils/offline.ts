/**
 * Offline support utilities
 */

/**
 * Check if the browser is currently online
 */
export const isOnline = (): boolean => {
  if (typeof navigator !== "undefined" && "onLine" in navigator) {
    return navigator.onLine;
  }
  return true; // Assume online if navigator.onLine is not available
};

/**
 * Subscribe to online/offline status changes
 */
export const subscribeToOnlineStatus = (
  callback: (isOnline: boolean) => void
): (() => void) => {
  const handleOnline = (): void => callback(true);
  const handleOffline = (): void => callback(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  // Return unsubscribe function
  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
};

/**
 * Get current network status information
 */
export const getNetworkStatus = (): {
  online: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
} => {
  const connection =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;

  return {
    online: isOnline(),
    effectiveType: connection?.effectiveType,
    downlink: connection?.downlink,
    rtt: connection?.rtt,
  };
};
