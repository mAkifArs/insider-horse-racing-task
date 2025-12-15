import { Horse } from "./horse";

/**
 * Race status enum
 */
export enum RaceStatus {
  /** Race not yet scheduled */
  PENDING = "pending",
  /** Race is currently running */
  RUNNING = "running",
  /** Race has completed */
  COMPLETED = "completed",
}

/**
 * Round distances in meters
 */
export const ROUND_DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200] as const;

/**
 * Race data structure
 * Represents a single race round
 */
export interface Race {
  /** Round number (1-6) */
  roundNumber: number;
  /** Distance in meters */
  distance: number;
  /** Array of horse IDs participating in this race (10 horses) */
  horseIds: string[];
  /** Race status */
  status: RaceStatus;
  /** Start time of the race (timestamp) */
  startTime?: number;
  /** End time of the race (timestamp) */
  endTime?: number;
}

/**
 * Race result entry
 * Represents a single horse's result in a completed race
 */
export interface RaceResultEntry {
  /** Horse ID */
  horseId: string;
  /** Final position (1-10) */
  position: number;
  /** Race completion time in milliseconds */
  time: number;
  /** Horse data snapshot */
  horse: Horse;
}

/**
 * Complete race result
 * Used in Results panel to display race outcomes
 */
export interface RaceResult {
  /** Round number */
  roundNumber: number;
  /** Distance in meters */
  distance: number;
  /** Array of results sorted by position */
  results: RaceResultEntry[];
  /** Completion timestamp */
  completedAt: number;
}

/**
 * Race schedule
 * Contains all 6 rounds for the Program panel
 */
export interface RaceSchedule {
  /** Array of 6 races */
  races: Race[];
  /** When the schedule was created */
  createdAt: number;
}

