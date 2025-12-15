import { Horse, HorsePosition, RaceResultEntry } from "../types";

/**
 * =============================================================================
 * RACE ANIMATION UTILITIES
 * Pure functions for race animation calculations - fully testable
 * =============================================================================
 */

/**
 * Base distance for race duration calculation
 * Longer races take proportionally more time
 */
export const BASE_DISTANCE = 1200;

/**
 * Speed divisor - lower = faster races
 * 50 = ~3-4 second base races
 */
export const SPEED_DIVISOR = 50;

/**
 * Calculate new position for a single horse
 *
 * @param hp - Current horse position
 * @param deltaTime - Time since last frame (ms)
 * @param distanceMultiplier - Race distance / BASE_DISTANCE
 * @param speedVariation - Random speed variation (0.8-1.2)
 * @param currentTime - Current timestamp for finish time
 * @returns Updated horse position
 */
export const calculateNewPosition = (
  hp: HorsePosition,
  deltaTime: number,
  distanceMultiplier: number,
  speedVariation: number,
  currentTime: number
): HorsePosition => {
  // If already finished, don't move
  if (hp.finishTime !== undefined) {
    return hp;
  }

  // Calculate movement amount based on speed, time, and distance
  const moveAmount =
    hp.speed *
    speedVariation *
    (deltaTime / (SPEED_DIVISOR * distanceMultiplier));

  const newPosition = Math.min(hp.position + moveAmount, 100);

  // Track finish time when horse crosses finish line
  const justFinished = hp.position < 100 && newPosition >= 100;

  return {
    ...hp,
    position: newPosition,
    finishTime: justFinished ? currentTime : hp.finishTime,
  };
};

/**
 * Generate random speed variation (0.8 - 1.2)
 */
export const generateSpeedVariation = (): number => {
  return 0.8 + Math.random() * 0.4;
};

/**
 * Calculate distance multiplier for a race
 */
export const calculateDistanceMultiplier = (distance: number): number => {
  return distance / BASE_DISTANCE;
};

/**
 * Check if all horses have finished the race
 */
export const checkAllFinished = (positions: HorsePosition[]): boolean => {
  return positions.every((hp) => hp.finishTime !== undefined);
};

/**
 * Sort positions by finish time (earlier = better position)
 */
export const sortByFinishTime = (
  positions: HorsePosition[]
): HorsePosition[] => {
  return [...positions].sort(
    (a, b) => (a.finishTime || 0) - (b.finishTime || 0)
  );
};

/**
 * Compile race results from finished positions
 *
 * @param positions - Array of horse positions (all finished)
 * @param horses - Array of all horses for lookup
 * @param animationStartTime - When the race started
 * @param currentTime - Current timestamp for fallback
 * @returns Array of race result entries sorted by position
 */
export const compileRaceResults = (
  positions: HorsePosition[],
  horses: Horse[],
  animationStartTime: number | undefined,
  currentTime: number
): RaceResultEntry[] => {
  const sortedPositions = sortByFinishTime(positions);

  return sortedPositions.map((hp, index) => {
    const horse = horses.find((h) => h.id === hp.horseId);
    return {
      horseId: hp.horseId,
      position: index + 1,
      time: (hp.finishTime || currentTime) - (animationStartTime || 0),
      horse: horse!,
    };
  });
};
