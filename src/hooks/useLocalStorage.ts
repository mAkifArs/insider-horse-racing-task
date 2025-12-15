import { useState, useEffect, useCallback } from "react";
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage,
  isLocalStorageAvailable,
} from "../utils/localStorage";

/**
 * Custom hook for managing localStorage state
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] => {
  // Initialize state with value from localStorage or initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isLocalStorageAvailable()) {
      return initialValue;
    }

    try {
      const item = loadFromLocalStorage<T>(key);
      return item ?? initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  useEffect(() => {
    if (isLocalStorageAvailable()) {
      saveToLocalStorage(key, storedValue);
    }
  }, [key, storedValue]);

  // Setter function that updates both state and localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
      } catch (error) {
        console.error(`Error setting ${key} in localStorage:`, error);
      }
    },
    [key, storedValue]
  );

  // Remove function
  const removeValue = useCallback(() => {
    try {
      removeFromLocalStorage(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};
