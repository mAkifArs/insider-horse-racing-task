import { Horse } from "./horse";
import { Race, RaceResult } from "./race";
import { HorsePosition } from "./horse";

/**
 * Game state enum
 */
export enum GameState {
  /** Initial state - no horses generated */
  IDLE = "idle",
  /** Horses generated, ready to create schedule */
  HORSES_READY = "horses_ready",
  /** Schedule created, ready to start races */
  SCHEDULE_READY = "schedule_ready",
  /** Races are running */
  RACING = "racing",
  /** Races are paused */
  PAUSED = "paused",
  /** All races completed */
  COMPLETED = "completed",
}

/**
 * Current race execution state
 * Used for Race Track visualization and animation
 */
export interface RaceExecutionState {
  /** Current race being executed */
  currentRace: Race | null;
  /** Horse positions during the race (for animation) */
  horsePositions: HorsePosition[];
  /** Whether the race animation is active */
  isAnimating: boolean;
  /** Animation start time */
  animationStartTime?: number;
}

/**
 * Complete game state
 * Main state structure for the entire game
 */
export interface GameStateData {
  /** Current game state */
  state: GameState;
  /** Array of all 20 horses */
  horses: Horse[];
  /** Race schedule (6 rounds) */
  schedule: Race[] | null;
  /** Current race execution state */
  raceExecution: RaceExecutionState;
  /** Completed race results */
  results: RaceResult[];
}
