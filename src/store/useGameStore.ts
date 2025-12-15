import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  Horse,
  HorsePosition,
  Race,
  RaceResult,
  RaceResultEntry,
  RaceStatus,
  ROUND_DISTANCES,
  GameState,
  RaceExecutionState,
} from "../types";
import { generateHorses } from "../utils/horseGenerator";

/**
 * Game store state interface
 */
interface GameStoreState {
  // State
  gameState: GameState;
  horses: Horse[];
  schedule: Race[] | null;
  raceExecution: RaceExecutionState;
  results: RaceResult[];
  currentRoundIndex: number;
}

/**
 * Game store actions interface
 */
interface GameStoreActions {
  // Horse actions
  initializeHorses: () => void;

  // Schedule actions
  generateSchedule: () => void;

  // Race actions
  startRacing: () => void;
  pauseRacing: () => void;
  resumeRacing: () => void;

  // Race execution actions
  startNextRace: () => void;
  updateHorsePositions: (positions: HorsePosition[]) => void;
  completeCurrentRace: (results: RaceResultEntry[]) => void;

  // Reset
  resetGame: () => void;
}

type GameStore = GameStoreState & GameStoreActions;

/**
 * Initial race execution state
 */
const initialRaceExecution: RaceExecutionState = {
  currentRace: null,
  horsePositions: [],
  isAnimating: false,
  animationStartTime: undefined,
};

/**
 * Initial game state
 */
const initialState: GameStoreState = {
  gameState: GameState.IDLE,
  horses: [],
  schedule: null,
  raceExecution: initialRaceExecution,
  results: [],
  currentRoundIndex: 0,
};

/**
 * Shuffle array using Fisher-Yates algorithm
 */
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Select 10 random horses from 20
 */
const selectRandomHorses = (horses: Horse[]): string[] => {
  const shuffled = shuffleArray(horses);
  return shuffled.slice(0, 10).map((horse) => horse.id);
};

/**
 * Generate race schedule with 6 rounds
 */
const createRaceSchedule = (horses: Horse[]): Race[] => {
  return ROUND_DISTANCES.map((distance, index) => ({
    roundNumber: index + 1,
    distance,
    horseIds: selectRandomHorses(horses),
    status: RaceStatus.PENDING,
  }));
};

/**
 * Storage key for localStorage
 */
const STORAGE_KEY = "horse-racing-game";

/**
 * Main game store
 */
export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

      /**
       * Initialize horses - generates 20 horses
       */
      initializeHorses: () => {
        const horses = generateHorses();
        set(
          {
            horses,
            gameState: GameState.HORSES_READY,
          },
          false,
          "initializeHorses"
        );
      },

      /**
       * Generate race schedule - creates 6 rounds with random horse selection
       */
      generateSchedule: () => {
        const { horses, gameState } = get();

        // Can only generate schedule if horses are ready
        if (
          gameState !== GameState.HORSES_READY &&
          gameState !== GameState.COMPLETED
        ) {
          console.warn("Cannot generate schedule in current state:", gameState);
          return;
        }

        const schedule = createRaceSchedule(horses);
        set(
          {
            schedule,
            gameState: GameState.SCHEDULE_READY,
            results: [],
            currentRoundIndex: 0,
            raceExecution: initialRaceExecution,
          },
          false,
          "generateSchedule"
        );
      },

      /**
       * Start racing - begins the race sequence
       */
      startRacing: () => {
        const { gameState } = get();

        if (gameState !== GameState.SCHEDULE_READY) {
          console.warn("Cannot start racing in current state:", gameState);
          return;
        }

        set({ gameState: GameState.RACING }, false, "startRacing");
        get().startNextRace();
      },

      /**
       * Pause racing
       */
      pauseRacing: () => {
        const { gameState } = get();

        if (gameState !== GameState.RACING) {
          return;
        }

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
       * Resume racing
       */
      resumeRacing: () => {
        const { gameState } = get();

        if (gameState !== GameState.PAUSED) {
          return;
        }

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

      /**
       * Start the next race in the schedule
       */
      startNextRace: () => {
        const { schedule, currentRoundIndex, horses, gameState } = get();

        if (!schedule || gameState !== GameState.RACING) {
          return;
        }

        // Check if all races are completed
        if (currentRoundIndex >= schedule.length) {
          set({ gameState: GameState.COMPLETED }, false, "allRacesCompleted");
          return;
        }

        const currentRace = schedule[currentRoundIndex];

        // Initialize horse positions for the race
        const horsePositions: HorsePosition[] = currentRace.horseIds.map(
          (horseId, index) => {
            const horse = horses.find((h) => h.id === horseId);
            return {
              horseId,
              position: 0,
              lane: index + 1,
              // Speed is influenced by horse condition (1-100)
              speed: horse ? 0.5 + (horse.condition / 100) * 0.5 : 0.75,
            };
          }
        );

        // Update the race status in schedule
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
       * Update horse positions during animation
       */
      updateHorsePositions: (positions: HorsePosition[]) => {
        set(
          (state) => ({
            raceExecution: {
              ...state.raceExecution,
              horsePositions: positions,
            },
          }),
          false,
          "updateHorsePositions"
        );
      },

      /**
       * Complete the current race and record results
       */
      completeCurrentRace: (raceResults: RaceResultEntry[]) => {
        const { schedule, currentRoundIndex, raceExecution } = get();

        if (!schedule || !raceExecution.currentRace) {
          return;
        }

        const currentRace = schedule[currentRoundIndex];

        // Create race result
        const raceResult: RaceResult = {
          roundNumber: currentRace.roundNumber,
          distance: currentRace.distance,
          results: raceResults.sort((a, b) => a.position - b.position),
          completedAt: Date.now(),
        };

        // Update schedule with completed race
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

        // Start next race if not all completed
        if (!allRacesCompleted) {
          // Small delay before starting next race
          setTimeout(() => {
            get().startNextRace();
          }, 1000);
        }
      },

      /**
       * Reset the entire game
       */
      resetGame: () => {
        set(initialState, false, "resetGame");
      },
    }),
    {
      name: STORAGE_KEY,
      // Only persist state that should survive page refresh
      // Don't persist raceExecution (animation state is ephemeral)
      partialize: (state) => ({
        gameState: state.gameState,
        horses: state.horses,
        schedule: state.schedule,
        results: state.results,
        currentRoundIndex: state.currentRoundIndex,
        // Don't include raceExecution - it's reset on load
      }),
      // Handle state restoration
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        // If game was RACING or PAUSED when closed, set to SCHEDULE_READY
        // so user can restart the current round
        if (
          state.gameState === GameState.RACING ||
          state.gameState === GameState.PAUSED
        ) {
          // Reset to schedule ready so they can start fresh
          state.gameState = GameState.SCHEDULE_READY;
        }
      },
    }
  ),
  { name: "GameStore" }
  )
);

/**
 * Selectors for optimized re-renders
 */
export const selectHorses = (state: GameStore) => state.horses;
export const selectGameState = (state: GameStore) => state.gameState;
export const selectSchedule = (state: GameStore) => state.schedule;
export const selectResults = (state: GameStore) => state.results;
export const selectRaceExecution = (state: GameStore) => state.raceExecution;
export const selectCurrentRoundIndex = (state: GameStore) =>
  state.currentRoundIndex;

/**
 * Computed selectors
 */
export const selectCurrentRace = (state: GameStore) =>
  state.schedule?.[state.currentRoundIndex] ?? null;

export const selectIsRacing = (state: GameStore) =>
  state.gameState === GameState.RACING;

export const selectIsPaused = (state: GameStore) =>
  state.gameState === GameState.PAUSED;

export const selectCanGenerateSchedule = (state: GameStore) =>
  state.gameState === GameState.HORSES_READY ||
  state.gameState === GameState.COMPLETED;

export const selectCanStartRace = (state: GameStore) =>
  state.gameState === GameState.SCHEDULE_READY;
