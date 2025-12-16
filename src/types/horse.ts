/**
 * Horse data structure
 * Represents a single horse in the racing game
 */
export interface Horse {
  /** Unique identifier for the horse */
  id: string;
  /** Horse name */
  name: string;
  /** Condition score from 1 to 100 */
  condition: number;
  /** Unique color representation (hex color code) */
  color: string;
}

/**
 * Horse position during a race
 * Used internally by the store for tracking race state
 */
export interface HorsePosition {
  /** Horse ID */
  horseId: string;
  /** Current position in the race (0-100% of track) */
  position: number;
  /** Current lane number (1-10) */
  lane: number;
  /** Current speed multiplier */
  speed: number;
  /** Time when horse crossed finish line (undefined if not finished) */
  finishTime?: number;
}
