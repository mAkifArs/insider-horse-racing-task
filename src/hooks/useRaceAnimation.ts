import { useCallback } from "react";
import { useAnimationFrame } from "./useAnimationFrame";
import { useGameStore, selectRaceExecution } from "../store";
import { Horse, HorsePosition, RaceResultEntry, GameState, Race } from "../types";

/**
 * =============================================================================
 * USE RACE ANIMATION HOOK
 * =============================================================================
 *
 * Custom hook that handles all race animation logic:
 * - Horse position calculations
 * - Speed formulas based on horse condition
 * - Finish line detection
 * - Race completion and results compilation
 *
 * This separates business logic from the presentation layer (RaceTrack component)
 *
 * Benefits:
 * - Testable: Can unit test animation logic independently
 * - Reusable: Could be used for replays, previews, simulations
 * - Maintainable: Change logic without touching UI
 */

/**
 * Base distance for race duration calculation
 * Longer races take proportionally more time
 */
const BASE_DISTANCE = 1200;

/**
 * Speed divisor - lower = faster races
 * 50 = ~3-4 second base races
 */
const SPEED_DIVISOR = 50;

interface UseRaceAnimationProps {
  currentRace: Race | null;
  horses: Horse[];
  isAnimating: boolean;
}

interface UseRaceAnimationReturn {
  /** Current positions of all horses in the race */
  horsePositions: HorsePosition[];
  /** Whether animation is currently active */
  isActive: boolean;
}

/**
 * Hook that manages race animation logic
 *
 * @param currentRace - The current race being run (null if no race)
 * @param horses - Array of all horses (for looking up horse data)
 * @param isAnimating - Whether animation should be running
 * @returns Object containing horse positions and animation state
 */
export const useRaceAnimation = ({
  currentRace,
  horses,
  isAnimating,
}: UseRaceAnimationProps): UseRaceAnimationReturn => {
  const raceExecution = useGameStore(selectRaceExecution);
  const gameState = useGameStore((state) => state.gameState);
  const updateHorsePositions = useGameStore(
    (state) => state.updateHorsePositions
  );
  const completeCurrentRace = useGameStore(
    (state) => state.completeCurrentRace
  );

  /**
   * Calculate new position for a single horse
   */
  const calculateNewPosition = useCallback(
    (hp: HorsePosition, deltaTime: number, distanceMultiplier: number): HorsePosition => {
      // If already finished, don't move
      if (hp.finishTime !== undefined) {
        return hp;
      }

      const now = Date.now();

      // Random speed variation (0.8 - 1.2) + base speed from horse condition
      const speedVariation = 0.8 + Math.random() * 0.4;

      // Calculate movement amount based on speed, time, and distance
      const moveAmount =
        hp.speed * speedVariation * (deltaTime / (SPEED_DIVISOR * distanceMultiplier));

      const newPosition = Math.min(hp.position + moveAmount, 100);

      // Track finish time when horse crosses finish line
      const justFinished = hp.position < 100 && newPosition >= 100;

      return {
        ...hp,
        position: newPosition,
        finishTime: justFinished ? now : hp.finishTime,
      };
    },
    []
  );

  /**
   * Compile race results from finished positions
   */
  const compileRaceResults = useCallback(
    (positions: HorsePosition[], animationStartTime: number | undefined): RaceResultEntry[] => {
      const now = Date.now();

      // Sort by finish time (earlier = better position)
      const sortedPositions = [...positions].sort(
        (a, b) => (a.finishTime || 0) - (b.finishTime || 0)
      );

      return sortedPositions.map((hp, index) => {
        const horse = horses.find((h) => h.id === hp.horseId);
        return {
          horseId: hp.horseId,
          position: index + 1,
          time: (hp.finishTime || now) - (animationStartTime || 0),
          horse: horse!,
        };
      });
    },
    [horses]
  );

  /**
   * Main animation callback - updates horse positions each frame
   */
  const animate = useCallback(
    (deltaTime: number) => {
      if (!isAnimating || !currentRace || gameState !== GameState.RACING) {
        return;
      }

      // Calculate distance multiplier (longer races = slower movement)
      const distanceMultiplier = currentRace.distance / BASE_DISTANCE;

      // Calculate new positions for all horses
      const newPositions: HorsePosition[] = raceExecution.horsePositions.map(
        (hp) => calculateNewPosition(hp, deltaTime, distanceMultiplier)
      );

      // Update positions in store
      updateHorsePositions(newPositions);

      // Check if all horses have finished
      const allFinished = newPositions.every(
        (hp) => hp.finishTime !== undefined
      );

      if (allFinished) {
        const results = compileRaceResults(
          newPositions,
          raceExecution.animationStartTime
        );
        completeCurrentRace(results);
      }
    },
    [
      isAnimating,
      currentRace,
      gameState,
      raceExecution.horsePositions,
      raceExecution.animationStartTime,
      calculateNewPosition,
      compileRaceResults,
      updateHorsePositions,
      completeCurrentRace,
    ]
  );

  // Run animation frame loop
  const shouldAnimate = isAnimating && gameState === GameState.RACING;
  useAnimationFrame(animate, shouldAnimate);

  return {
    horsePositions: raceExecution.horsePositions,
    isActive: shouldAnimate,
  };
};

