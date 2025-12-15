/**
 * LocalStorage utility functions with error handling
 */

const STORAGE_PREFIX = "horse_racing_game_";

/**
 * Get a namespaced key for localStorage
 */
const getKey = (key: string): string => `${STORAGE_PREFIX}${key}`;

/**
 * Check if localStorage is available
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Save data to localStorage with error handling
 */
export const saveToLocalStorage = <T>(key: string, data: T): boolean => {
  if (!isLocalStorageAvailable()) {
    console.warn("LocalStorage is not available");
    return false;
  }

  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(getKey(key), serialized);
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      console.error("LocalStorage quota exceeded");
    } else {
      console.error("Error saving to localStorage:", error);
    }
    return false;
  }
};

/**
 * Load data from localStorage with error handling
 */
export const loadFromLocalStorage = <T>(key: string): T | null => {
  if (!isLocalStorageAvailable()) {
    console.warn("LocalStorage is not available");
    return null;
  }

  try {
    const item = localStorage.getItem(getKey(key));
    if (item === null) {
      return null;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return null;
  }
};

/**
 * Remove data from localStorage
 */
export const removeFromLocalStorage = (key: string): boolean => {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    localStorage.removeItem(getKey(key));
    return true;
  } catch (error) {
    console.error("Error removing from localStorage:", error);
    return false;
  }
};

/**
 * Clear all game-related data from localStorage
 */
export const clearGameData = (): boolean => {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    return true;
  } catch (error) {
    console.error("Error clearing game data:", error);
    return false;
  }
};

/**
 * Storage keys used in the application
 */
export const STORAGE_KEYS = {
  HORSES: "horses",
  RACE_SCHEDULE: "race_schedule",
  RESULTS: "results",
  GAME_STATE: "game_state",
} as const;
