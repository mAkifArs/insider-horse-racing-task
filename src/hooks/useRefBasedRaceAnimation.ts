import { useRef, useEffect, useCallback, useMemo } from "react";
import { useAnimationFrame } from "./useAnimationFrame";
import { useGameStore, selectRaceExecution, selectHorses } from "../store";
import { Horse, HorsePosition, GameState } from "../types";
import {
  calculateNewPosition,
  generateSpeedVariation,
  calculateDistanceMultiplier,
  checkAllFinished,
  compileRaceResults,
} from "./raceAnimationUtils";

/**
 * =============================================================================
 * REF-BASED RACE ANIMATION HOOK
 * =============================================================================
 *
 * Performance-optimized animation hook that bypasses React state during animation.
 *
 * KEY DIFFERENCE FROM useRaceAnimation:
 * - Old: Updates Zustand store every frame → React re-renders → DOM updates
 * - New: Updates DOM directly via refs → NO React re-renders during animation
 *
 * FLOW:
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │   Animation Frame (~60fps)                                                  │
 * │         │                                                                   │
 * │         ▼                                                                   │
 * │   Calculate new positions (in JS, stored in positionsRef)                   │
 * │         │                                                                   │
 * │         ▼                                                                   │
 * │   Update DOM directly via horseRefs (transform: translateX)                 │
 * │         │                                                                   │
 * │         ▼ (when all finished)                                               │
 * │   Call store.completeCurrentRace() - single React update                    │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * This eliminates ~600 React re-renders per race!
 */

export interface RaceHorseData {
  horse: Horse;
  initialPosition: number;
  lane: number;
  speed: number;
}

interface UseRefBasedRaceAnimationReturn {
  /** Initial race horses data for rendering (stable, doesn't change during animation) */
  raceHorses: RaceHorseData[];
  /** Register a DOM element ref for a horse */
  registerHorseRef: (horseId: string, element: HTMLDivElement | null) => void;
  /** Whether animation is currently active */
  isActive: boolean;
}

/**
 * Hook that manages race animation using refs instead of state
 * Updates DOM directly for smooth, re-render-free animation
 */
export const useRefBasedRaceAnimation = (): UseRefBasedRaceAnimationReturn => {
  // ═══════════════════════════════════════════════════════════════════════════
  // STORE STATE (read-only during animation)
  // ═══════════════════════════════════════════════════════════════════════════
  const raceExecution = useGameStore(selectRaceExecution);
  const horses = useGameStore(selectHorses);
  const gameState = useGameStore((state) => state.gameState);

  // Store actions (only called when race completes)
  const completeCurrentRace = useGameStore(
    (state) => state.completeCurrentRace
  );

  // Derived state
  const currentRace = raceExecution.currentRace;
  const isAnimating = raceExecution.isAnimating;
  const shouldAnimate = isAnimating && gameState === GameState.RACING;

  // ═══════════════════════════════════════════════════════════════════════════
  // REFS (mutable state that doesn't trigger re-renders)
  // ═══════════════════════════════════════════════════════════════════════════

  // Map of horseId -> DOM element for direct manipulation
  const horseRefsMap = useRef<Map<string, HTMLDivElement>>(new Map());

  // Current positions (mutated during animation, never triggers re-render)
  const positionsRef = useRef<HorsePosition[]>([]);

  // Animation start time ref
  const animationStartTimeRef = useRef<number>(0);

  // ═══════════════════════════════════════════════════════════════════════════
  // HORSE LOOKUP MAP
  // ═══════════════════════════════════════════════════════════════════════════
  const horseMap = useMemo(() => {
    const map = new Map<string, Horse>();
    horses.forEach((horse) => map.set(horse.id, horse));
    return map;
  }, [horses]);

  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZE POSITIONS WHEN RACE STARTS
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (raceExecution.horsePositions.length > 0 && isAnimating) {
      // Copy initial positions to our ref
      positionsRef.current = raceExecution.horsePositions.map((hp) => ({
        ...hp,
      }));
      animationStartTimeRef.current = raceExecution.animationStartTime || Date.now();
    }
  }, [raceExecution.horsePositions, raceExecution.animationStartTime, isAnimating]);

  // ═══════════════════════════════════════════════════════════════════════════
  // REGISTER HORSE REFS (called by RaceLane components)
  // ═══════════════════════════════════════════════════════════════════════════
  const registerHorseRef = useCallback(
    (horseId: string, element: HTMLDivElement | null) => {
      if (element) {
        horseRefsMap.current.set(horseId, element);
      } else {
        horseRefsMap.current.delete(horseId);
      }
    },
    []
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // ANIMATION CALLBACK - UPDATES DOM DIRECTLY
  // ═══════════════════════════════════════════════════════════════════════════
  const animate = useCallback(
    (deltaTime: number) => {
      if (!shouldAnimate || !currentRace || positionsRef.current.length === 0) {
        return;
      }

      const now = Date.now();
      const distanceMultiplier = calculateDistanceMultiplier(currentRace.distance);

      // Calculate new positions (mutate ref, not state)
      for (let i = 0; i < positionsRef.current.length; i++) {
        const hp = positionsRef.current[i];
        const speedVariation = generateSpeedVariation();

        // Calculate and update position in-place
        const newHp = calculateNewPosition(
          hp,
          deltaTime,
          distanceMultiplier,
          speedVariation,
          now
        );

        // Mutate the ref directly (no React re-render)
        positionsRef.current[i] = newHp;

        // ═══════════════════════════════════════════════════════════════════
        // DIRECT DOM UPDATE - THE KEY OPTIMIZATION
        // ═══════════════════════════════════════════════════════════════════
        const element = horseRefsMap.current.get(hp.horseId);
        if (element) {
          // Calculate display position (0-90% of track width)
          const displayPosition = Math.min(newHp.position * 0.9, 90);
          element.style.left = `${displayPosition}%`;
        }
      }

      // Check if all horses have finished
      if (checkAllFinished(positionsRef.current)) {
        const results = compileRaceResults(
          positionsRef.current,
          horses,
          animationStartTimeRef.current,
          now
        );

        // This is the ONLY store update during the race
        completeCurrentRace(results);
      }
    },
    [shouldAnimate, currentRace, horses, completeCurrentRace]
  );

  // Run animation frame loop
  useAnimationFrame(animate, shouldAnimate);

  // ═══════════════════════════════════════════════════════════════════════════
  // STABLE RACE HORSES DATA (for initial render only)
  // ═══════════════════════════════════════════════════════════════════════════
  const raceHorses = useMemo((): RaceHorseData[] => {
    const result: RaceHorseData[] = [];
    for (const hp of raceExecution.horsePositions) {
      const horse = horseMap.get(hp.horseId);
      if (horse) {
        result.push({
          horse,
          initialPosition: hp.position,
          lane: hp.lane,
          speed: hp.speed,
        });
      }
    }
    return result;
  }, [raceExecution.horsePositions, horseMap]);

  return {
    raceHorses,
    registerHorseRef,
    isActive: shouldAnimate,
  };
};

