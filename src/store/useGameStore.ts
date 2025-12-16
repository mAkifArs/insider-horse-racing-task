/**
 * =============================================================================
 * GAME STORE
 * =============================================================================
 *
 * Central state management for the Horse Racing Game using Zustand.
 *
 * ARCHITECTURE:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                           GAME STATE MACHINE                            │
 * │                                                                         │
 * │   IDLE ──→ HORSES_READY ──→ SCHEDULE_READY ──→ RACING ⇄ PAUSED         │
 * │              │                      ↑              │                    │
 * │              │                      │              ↓                    │
 * │              │                      └────────── COMPLETED               │
 * │              │                                     │                    │
 * │              └─────────────────────────────────────┘                    │
 * │                        (RESET GAME)                                     │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * FILE ORGANIZATION:
 * - Types & Interfaces ......... lines ~30-55
 * - Initial State .............. lines ~60-80
 * - Store Creation ............. lines ~85+
 *   ├── Horse Actions .......... initializeHorses
 *   ├── Schedule Actions ....... generateSchedule
 *   ├── Race Control Actions ... startRacing, pauseRacing, resumeRacing
 *   ├── Race Execution Actions . startNextRace, completeCurrentRace
 *   └── Reset Actions .......... resetGame
 * - Persistence Config ......... bottom of file
 *
 * RELATED FILES:
 * - ./helpers/scheduleHelpers.ts - Schedule generation logic
 * - ./helpers/raceHelpers.ts .... Race execution logic
 * - ./selectors.ts .............. State selectors
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  Horse,
  Race,
  RaceResult,
  RaceResultEntry,
  RaceStatus,
  GameState,
  RaceExecutionState,
} from "../types";
import { generateHorses } from "../utils/horseGenerator";
import { createRaceSchedule, initializeHorsePositions } from "./helpers";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Game store state - What data we track
 */
interface GameStoreState {
  /** Current game phase (IDLE → HORSES_READY → SCHEDULE_READY → RACING → COMPLETED) */
  gameState: GameState;
  /** All 20 horses with names, conditions, and colors */
  horses: Horse[];
  /** Array of 6 races (null before schedule is generated) */
  schedule: Race[] | null;
  /** Current race animation state */
  raceExecution: RaceExecutionState;
  /** Completed race results (grows as races finish) */
  results: RaceResult[];
  /** Which race we're on (0-5) */
  currentRoundIndex: number;
}

/**
 * Game store actions - What we can do
 */
interface GameStoreActions {
  // Horse Management
  initializeHorses: () => void;

  // Schedule Management
  generateSchedule: () => void;

  // Race Control
  startRacing: () => void;
  pauseRacing: () => void;
  resumeRacing: () => void;

  // Race Execution (called by animation hook)
  startNextRace: () => void;
  completeCurrentRace: (results: RaceResultEntry[]) => void;

  // Game Reset
  resetGame: () => void;
}

/** Complete store type */
export type GameStore = GameStoreState & GameStoreActions;

// =============================================================================
// INITIAL STATE
// =============================================================================

/** Empty race execution state */
const initialRaceExecution: RaceExecutionState = {
  currentRace: null,
  horsePositions: [],
  isAnimating: false,
  animationStartTime: undefined,
};

/** Starting state for a new game */
const initialState: GameStoreState = {
  gameState: GameState.IDLE,
  horses: [],
  schedule: null,
  raceExecution: initialRaceExecution,
  results: [],
  currentRoundIndex: 0,
};

// =============================================================================
// CONSTANTS
// =============================================================================

/** localStorage key for persistence */
const STORAGE_KEY = "horse-racing-game";

/** Delay between races (ms) */
const INTER_RACE_DELAY = 1000;

// =============================================================================
// STORE
// =============================================================================

export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // ─────────────────────────────────────────────────────────────────────
        // HORSE MANAGEMENT
        // ─────────────────────────────────────────────────────────────────────

        /**
         * Initialize 20 horses with random conditions
         * Called on app mount when gameState is IDLE
         *
         * State change: IDLE → HORSES_READY
         */
        initializeHorses: () => {
          const horses = generateHorses();
          set(
            { horses, gameState: GameState.HORSES_READY },
            false,
            "initializeHorses"
          );
        },

        // ─────────────────────────────────────────────────────────────────────
        // SCHEDULE MANAGEMENT
        // ─────────────────────────────────────────────────────────────────────

        /**
         * Generate 6 race schedule with random horse selection
         * Each race gets 10 random horses from the pool of 20
         *
         * State change: HORSES_READY → SCHEDULE_READY
         *               COMPLETED → SCHEDULE_READY (replay)
         */
        generateSchedule: () => {
          const { horses, gameState } = get();

          // Guard: Only allow from HORSES_READY or COMPLETED states
          if (
            gameState !== GameState.HORSES_READY &&
            gameState !== GameState.COMPLETED
          ) {
            console.warn(
              `[GameStore] Cannot generate schedule in state: ${gameState}`
            );
            return;
          }

          const schedule = createRaceSchedule(horses);

          set(
            {
              schedule,
              gameState: GameState.SCHEDULE_READY,
              results: [], // Clear previous results
              currentRoundIndex: 0,
              raceExecution: initialRaceExecution,
            },
            false,
            "generateSchedule"
          );
        },

        // ─────────────────────────────────────────────────────────────────────
        // RACE CONTROL
        // ─────────────────────────────────────────────────────────────────────

        /**
         * Start racing - kicks off the first race
         *
         * State change: SCHEDULE_READY → RACING
         */
        startRacing: () => {
          const { gameState } = get();

          if (gameState !== GameState.SCHEDULE_READY) {
            console.warn(
              `[GameStore] Cannot start racing in state: ${gameState}`
            );
            return;
          }

          set({ gameState: GameState.RACING }, false, "startRacing");
          get().startNextRace();
        },

        /**
         * Pause the current race (animation stops, positions preserved)
         *
         * State change: RACING → PAUSED
         */
        pauseRacing: () => {
          const { gameState } = get();

          if (gameState !== GameState.RACING) return;

          set(
            (state) => ({
              gameState: GameState.PAUSED,
              raceExecution: {
                ...state.raceExecution,
                isAnimating: false,
              },
            }),
            false,
            "pauseRacing"
          );
        },

        /**
         * Resume racing from paused state
         *
         * State change: PAUSED → RACING
         */
        resumeRacing: () => {
          const { gameState } = get();

          if (gameState !== GameState.PAUSED) return;

          set(
            (state) => ({
              gameState: GameState.RACING,
              raceExecution: {
                ...state.raceExecution,
                isAnimating: true,
              },
            }),
            false,
            "resumeRacing"
          );
        },

        // ─────────────────────────────────────────────────────────────────────
        // RACE EXECUTION
        // These are called by the RaceTrack component during animation
        // ─────────────────────────────────────────────────────────────────────

        /**
         * Start the next race in the schedule
         * Initializes horse positions and begins animation
         *
         * Called after startRacing() or after a race completes
         */
        startNextRace: () => {
          const { schedule, currentRoundIndex, horses, gameState } = get();

          // Guards
          if (!schedule || gameState !== GameState.RACING) return;

          // Check if all races completed
          if (currentRoundIndex >= schedule.length) {
            set({ gameState: GameState.COMPLETED }, false, "allRacesCompleted");
            return;
          }

          const currentRace = schedule[currentRoundIndex];

          // Initialize positions using helper
          const horsePositions = initializeHorsePositions(
            currentRace.horseIds,
            horses
          );

          // Mark race as running in schedule
          const updatedSchedule = schedule.map((race, index) =>
            index === currentRoundIndex
              ? { ...race, status: RaceStatus.RUNNING, startTime: Date.now() }
              : race
          );

          set(
            {
              schedule: updatedSchedule,
              raceExecution: {
                currentRace: { ...currentRace, status: RaceStatus.RUNNING },
                horsePositions,
                isAnimating: true,
                animationStartTime: Date.now(),
              },
            },
            false,
            "startNextRace"
          );
        },

        /**
         * Complete the current race and record results
         * Called by RaceTrack when all horses cross finish line
         *
         * @param raceResults - Final positions sorted by finish time
         */
        completeCurrentRace: (raceResults: RaceResultEntry[]) => {
          const { schedule, currentRoundIndex, raceExecution } = get();

          if (!schedule || !raceExecution.currentRace) return;

          const currentRace = schedule[currentRoundIndex];

          // Create race result record
          const raceResult: RaceResult = {
            roundNumber: currentRace.roundNumber,
            distance: currentRace.distance,
            results: raceResults.sort((a, b) => a.position - b.position),
            completedAt: Date.now(),
          };

          // Mark race as completed in schedule
          const updatedSchedule = schedule.map((race, index) =>
            index === currentRoundIndex
              ? { ...race, status: RaceStatus.COMPLETED, endTime: Date.now() }
              : race
          );

          const nextRoundIndex = currentRoundIndex + 1;
          const allRacesCompleted = nextRoundIndex >= schedule.length;

          set(
            {
              schedule: updatedSchedule,
              results: [...get().results, raceResult],
              currentRoundIndex: nextRoundIndex,
              raceExecution: initialRaceExecution,
              gameState: allRacesCompleted
                ? GameState.COMPLETED
                : GameState.RACING,
            },
            false,
            "completeCurrentRace"
          );

          // Start next race after delay (if not finished)
          if (!allRacesCompleted) {
            setTimeout(() => {
              get().startNextRace();
            }, INTER_RACE_DELAY);
          }
        },

        // ─────────────────────────────────────────────────────────────────────
        // GAME RESET
        // ─────────────────────────────────────────────────────────────────────

        /**
         * Reset entire game to initial state
         * Clears horses, schedule, results - starts fresh
         *
         * State change: ANY → IDLE
         */
        resetGame: () => {
          set(initialState, false, "resetGame");
        },
      }),

      // ───────────────────────────────────────────────────────────────────────
      // PERSISTENCE CONFIG
      // ───────────────────────────────────────────────────────────────────────
      {
        name: STORAGE_KEY,

        /**
         * What to persist to localStorage
         * We DON'T persist raceExecution because animation state is ephemeral
         */
        partialize: (state) => ({
          gameState: state.gameState,
          horses: state.horses,
          schedule: state.schedule,
          results: state.results,
          currentRoundIndex: state.currentRoundIndex,
        }),

        /**
         * Handle state restoration on page load
         * If user closed during a race, reset to SCHEDULE_READY
         */
        onRehydrateStorage: () => (state) => {
          if (!state) return;

          // Can't resume animation mid-race, so reset to schedule
          if (
            state.gameState === GameState.RACING ||
            state.gameState === GameState.PAUSED
          ) {
            state.gameState = GameState.SCHEDULE_READY;
          }
        },
      }
    ),
    { name: "GameStore" }
  )
);

// =============================================================================
// RE-EXPORT SELECTORS
// =============================================================================
// Selectors are in ./selectors.ts but we re-export for convenience

export {
  selectHorses,
  selectGameState,
  selectSchedule,
  selectResults,
  selectRaceExecution,
  selectCurrentRoundIndex,
  selectCurrentRace,
  selectCanGenerateSchedule,
} from "./selectors";
