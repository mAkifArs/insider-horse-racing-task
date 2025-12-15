import { Horse, Race, RaceStatus, ROUND_DISTANCES } from "../../types";

/**
 * =============================================================================
 * SCHEDULE HELPERS
 * Pure functions for race schedule generation
 * =============================================================================
 */

/**
 * Shuffle array using Fisher-Yates algorithm
 * Time complexity: O(n)
 *
 * @param array - Array to shuffle
 * @returns New shuffled array (original not mutated)
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Select 10 random horses from the pool of 20
 *
 * @param horses - Array of all horses (20)
 * @returns Array of 10 horse IDs
 */
export const selectRandomHorses = (horses: Horse[]): string[] => {
  const shuffled = shuffleArray(horses);
  return shuffled.slice(0, 10).map((horse) => horse.id);
};

/**
 * Generate race schedule with 6 rounds
 * Each round has a different distance and random horse selection
 *
 * Distances: 1200m, 1400m, 1600m, 1800m, 2000m, 2200m
 *
 * @param horses - Array of all horses
 * @returns Array of 6 Race objects
 */
export const createRaceSchedule = (horses: Horse[]): Race[] => {
  return ROUND_DISTANCES.map((distance, index) => ({
    roundNumber: index + 1,
    distance,
    horseIds: selectRandomHorses(horses),
    status: RaceStatus.PENDING,
  }));
};
