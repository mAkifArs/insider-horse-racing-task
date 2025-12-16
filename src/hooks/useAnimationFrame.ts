import { useEffect, useRef } from "react";
import {
  requestAnimationFrame,
  cancelAnimationFrame,
} from "../utils/performance";

/**
 * Custom hook for animation frame management
 * Useful for smooth animations and game loops
 *
 * Handles pause/resume properly by resetting timing when animation restarts
 */
export const useAnimationFrame = (
  callback: (deltaTime: number) => void,
  isActive: boolean = true
): void => {
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      // Reset the previous time when inactive so resume doesn't cause a jump
      previousTimeRef.current = null;
      return;
    }

    const animate = (time: number) => {
      if (previousTimeRef.current !== null) {
        const deltaTime = time - previousTimeRef.current;
        // Cap deltaTime to prevent jumps (max 100ms = ~10fps minimum)
        const cappedDeltaTime = Math.min(deltaTime, 100);
        callback(cappedDeltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [callback, isActive]);
};
