import { GameState } from "../types";
import type { GameStore } from "./useGameStore";

/**
 * =============================================================================
 * SELECTORS
 * Optimized selectors to prevent unnecessary re-renders
 *
 * Usage: const horses = useGameStore(selectHorses)
 * =============================================================================
 */

// ─────────────────────────────────────────────────────────────────────────────
// BASIC SELECTORS - Direct state access
// ─────────────────────────────────────────────────────────────────────────────

/** Get all 20 horses */
export const selectHorses = (state: GameStore) => state.horses;

/** Get current game state (IDLE, HORSES_READY, SCHEDULE_READY, RACING, PAUSED, COMPLETED) */
export const selectGameState = (state: GameStore) => state.gameState;

/** Get race schedule (6 races) */
export const selectSchedule = (state: GameStore) => state.schedule;

/** Get completed race results */
export const selectResults = (state: GameStore) => state.results;

/** Get current race execution state (animation, positions) */
export const selectRaceExecution = (state: GameStore) => state.raceExecution;

/** Get current round index (0-5) */
export const selectCurrentRoundIndex = (state: GameStore) =>
  state.currentRoundIndex;

// ─────────────────────────────────────────────────────────────────────────────
// COMPUTED SELECTORS - Derived state
// ─────────────────────────────────────────────────────────────────────────────

/** Get current race from schedule (null if no race active) */
export const selectCurrentRace = (state: GameStore) =>
  state.schedule?.[state.currentRoundIndex] ?? null;

/** Check if game is currently racing */
export const selectIsRacing = (state: GameStore) =>
  state.gameState === GameState.RACING;

/** Check if game is paused */
export const selectIsPaused = (state: GameStore) =>
  state.gameState === GameState.PAUSED;

/** Check if user can generate a new schedule */
export const selectCanGenerateSchedule = (state: GameStore) =>
  state.gameState === GameState.HORSES_READY ||
  state.gameState === GameState.COMPLETED;

/** Check if user can start racing */
export const selectCanStartRace = (state: GameStore) =>
  state.gameState === GameState.SCHEDULE_READY;
