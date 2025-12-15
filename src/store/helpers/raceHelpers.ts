import { Horse, HorsePosition } from "../../types";

/**
 * =============================================================================
 * RACE HELPERS
 * Pure functions for race execution
 * =============================================================================
 */

/**
 * Calculate horse speed based on condition
 *
 * Formula: 0.5 + (condition / 100) * 0.5
 * - Condition 1   → Speed 0.505 (slowest)
 * - Condition 50  → Speed 0.75  (average)
 * - Condition 100 → Speed 1.0   (fastest)
 *
 * This means best horses are ~2x faster than worst horses
 *
 * @param condition - Horse condition (1-100)
 * @returns Speed multiplier (0.5 - 1.0)
 */
export const calculateHorseSpeed = (condition: number): number => {
  return 0.5 + (condition / 100) * 0.5;
};

/**
 * Initialize horse positions for a race
 * Each horse starts at position 0 with speed based on condition
 *
 * @param horseIds - Array of horse IDs participating in the race
 * @param horses - Array of all horses (to lookup conditions)
 * @returns Array of HorsePosition objects
 */
export const initializeHorsePositions = (
  horseIds: string[],
  horses: Horse[]
): HorsePosition[] => {
  return horseIds.map((horseId, index) => {
    const horse = horses.find((h) => h.id === horseId);
    const condition = horse?.condition ?? 50; // Default to 50 if not found

    return {
      horseId,
      position: 0,
      lane: index + 1,
      speed: calculateHorseSpeed(condition),
    };
  });
};

/**
 * Default speed for horses when condition is unknown
 */
export const DEFAULT_HORSE_SPEED = 0.75;
