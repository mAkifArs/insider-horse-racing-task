import { useCallback, useMemo } from "react";
import { useAnimationFrame } from "./useAnimationFrame";
import { useGameStore, selectRaceExecution } from "../store";
import {
  Horse,
  HorsePosition,
  RaceHorseState,
  GameState,
  Race,
} from "../types";
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
 * This separates business logic from the presentation layer (RaceTrack component)
 *
 * Benefits:
 * - Testable: Pure functions extracted to raceAnimationUtils.ts
 * - Reusable: Could be used for replays, previews, simulations
 * - Maintainable: Change logic without touching UI
 * - Performance: Pre-joins horse data to avoid lookups during render
 */

interface UseRaceAnimationProps {
  currentRace: Race | null;
  horses: Horse[];
  isAnimating: boolean;
}

interface UseRaceAnimationReturn {
  /** Race horses with positions - pre-joined for efficient rendering */
  raceHorses: RaceHorseState[];
  /** Whether animation is currently active */
  isActive: boolean;
}

/**
 * Hook that manages race animation logic
 *
 * @param currentRace - The current race being run (null if no race)
 * @param horses - Array of all horses (for looking up horse data)
 * @param isAnimating - Whether animation should be running
 * @returns Object containing enriched horse data with positions
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

  // Create horse lookup map for O(1) access (stable reference)
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
  // This eliminates multiple .find() calls in RaceTrack
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
