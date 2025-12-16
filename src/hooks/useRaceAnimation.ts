import { useCallback, useMemo } from "react";
import { useAnimationFrame } from "./useAnimationFrame";
import { useGameStore, selectRaceExecution, selectHorses } from "../store";
import { Horse, HorsePosition, RaceHorseState, GameState } from "../types";
import {
  calculateNewPosition,
  generateSpeedVariation,
  calculateDistanceMultiplier,
  checkAllFinished,
  compileRaceResults,
} from "./raceAnimationUtils";

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
 * Gets all data from store - no props drilling needed.
 *
 * Benefits:
 * - Testable: Pure functions extracted to raceAnimationUtils.ts
 * - Self-contained: Gets own data from store
 * - Performance: Pre-joins horse data to avoid lookups during render
 */

interface UseRaceAnimationReturn {
  /** Race horses with positions - pre-joined for efficient rendering */
  raceHorses: RaceHorseState[];
  /** Whether animation is currently active */
  isActive: boolean;
}

/**
 * Hook that manages race animation logic
 * Gets all needed data from store directly
 */
export const useRaceAnimation = (): UseRaceAnimationReturn => {
  // Store state
  const raceExecution = useGameStore(selectRaceExecution);
  const horses = useGameStore(selectHorses);
  const gameState = useGameStore((state) => state.gameState);

  // Store actions
  const updateHorsePositions = useGameStore(
    (state) => state.updateHorsePositions
  );
  const completeCurrentRace = useGameStore(
    (state) => state.completeCurrentRace
  );

  // Derived state
  const currentRace = raceExecution.currentRace;
  const isAnimating = raceExecution.isAnimating;

  // Create horse lookup map for O(1) access
  const horseMap = useMemo(() => {
    const map = new Map<string, Horse>();
    horses.forEach((horse) => map.set(horse.id, horse));
    return map;
  }, [horses]);

  /**
   * Main animation callback - updates horse positions each frame
   */
  const animate = useCallback(
    (deltaTime: number) => {
      if (!isAnimating || !currentRace || gameState !== GameState.RACING) {
        return;
      }

      const now = Date.now();
      const distanceMultiplier = calculateDistanceMultiplier(
        currentRace.distance
      );

      // Calculate new positions for all horses
      const newPositions: HorsePosition[] = raceExecution.horsePositions.map(
        (hp) =>
          calculateNewPosition(
            hp,
            deltaTime,
            distanceMultiplier,
            generateSpeedVariation(),
            now
          )
      );

      // Update positions in store
      updateHorsePositions(newPositions);

      // Check if all horses have finished
      if (checkAllFinished(newPositions)) {
        const results = compileRaceResults(
          newPositions,
          horses,
          raceExecution.animationStartTime,
          now
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
      horses,
      updateHorsePositions,
      completeCurrentRace,
    ]
  );

  // Run animation frame loop
  const shouldAnimate = isAnimating && gameState === GameState.RACING;
  useAnimationFrame(animate, shouldAnimate);

  // Pre-join horse data with positions for efficient rendering
  const raceHorses = useMemo((): RaceHorseState[] => {
    const result: RaceHorseState[] = [];
    for (const hp of raceExecution.horsePositions) {
      const horse = horseMap.get(hp.horseId);
      if (horse) {
        result.push({
          horse,
          position: hp.position,
          lane: hp.lane,
          speed: hp.speed,
          finishTime: hp.finishTime,
        });
      }
    }
    return result;
  }, [raceExecution.horsePositions, horseMap]);

  return {
    raceHorses,
    isActive: shouldAnimate,
  };
};
