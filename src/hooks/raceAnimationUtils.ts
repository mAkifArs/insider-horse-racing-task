import { Horse, HorsePosition, RaceResultEntry } from "../types";

/**
 * =============================================================================
 * RACE ANIMATION UTILITIES
 * =============================================================================
 *
 * THE HEART OF THE HORSE RACING GAME
 *
 * This file contains all the pure mathematical functions that drive the race.
 * Every function here is "pure" - meaning:
 *   - Same inputs → Same outputs (deterministic, except for random variation)
 *   - No side effects (doesn't modify external state)
 *   - Fully testable in isolation
 *
 * WHY PURE FUNCTIONS?
 * ┌────────────────────────────────────────────────────────────────────────────┐
 * │  1. TESTABILITY: We can unit test each calculation independently          │
 * │  2. PREDICTABILITY: No hidden state = no surprises                        │
 * │  3. REUSABILITY: Could be used for replays, simulations, AI predictions   │
 * │  4. DEBUGGING: Easy to trace what went wrong with specific inputs         │
 * └────────────────────────────────────────────────────────────────────────────┘
 *
 * ANIMATION FLOW:
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                                                                             │
 * │   [Animation Frame ~60fps]                                                  │
 * │           │                                                                 │
 * │           ▼                                                                 │
 * │   calculateDistanceMultiplier(1600) → 1.33                                  │
 * │           │                                                                 │
 * │           ▼                                                                 │
 * │   For each horse:                                                           │
 * │     generateSpeedVariation() → 0.95 (random 0.8-1.2)                        │
 * │     calculateNewPosition(hp, 16ms, 1.33, 0.95, now)                         │
 * │           │                                                                 │
 * │           ▼                                                                 │
 * │   checkAllFinished(positions) → false                                       │
 * │           │                                                                 │
 * │           ▼ (when all finished)                                             │
 * │   compileRaceResults(positions, horses, startTime)                          │
 * │           │                                                                 │
 * │           ▼                                                                 │
 * │   [Race Complete - Show Results]                                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * BASE_DISTANCE - Reference distance for race duration scaling
 *
 * All race durations are calculated relative to a 1200m race.
 * This is the shortest distance in our game.
 *
 * Distance Scaling:
 * ┌──────────┬────────────┬──────────────────────────────────┐
 * │ Distance │ Multiplier │ Effect                           │
 * ├──────────┼────────────┼──────────────────────────────────┤
 * │ 1200m    │ 1.00       │ Base duration (fastest race)     │
 * │ 1400m    │ 1.17       │ 17% longer                       │
 * │ 1600m    │ 1.33       │ 33% longer                       │
 * │ 1800m    │ 1.50       │ 50% longer                       │
 * │ 2000m    │ 1.67       │ 67% longer                       │
 * │ 2200m    │ 1.83       │ 83% longer (slowest race)        │
 * └──────────┴────────────┴──────────────────────────────────┘
 */
export const BASE_DISTANCE = 1200;

/**
 * SPEED_DIVISOR - Controls overall race speed
 *
 * This magic number determines how fast races complete.
 * Lower = faster races, Higher = slower races.
 *
 * The formula: moveAmount = speed × variation × (deltaTime / (DIVISOR × distanceMultiplier))
 *
 * With SPEED_DIVISOR = 50:
 * - Average horse (speed 0.75) at 60fps completes in ~4-5 seconds (1200m)
 * - Fast horse (speed 1.0) completes in ~3-4 seconds
 * - Slow horse (speed 0.5) completes in ~6-8 seconds
 *
 * TUNING GUIDE:
 * ┌─────────────────┬────────────────────────────────────┐
 * │ SPEED_DIVISOR   │ Result                             │
 * ├─────────────────┼────────────────────────────────────┤
 * │ 25              │ Very fast (~2 second races)        │
 * │ 50              │ Current (~4 second races)          │
 * │ 100             │ Slow (~8 second races)             │
 * │ 200             │ Very slow (~16 second races)       │
 * └─────────────────┴────────────────────────────────────┘
 */
export const SPEED_DIVISOR = 50;

// =============================================================================
// CORE CALCULATION: POSITION UPDATE
// =============================================================================

/**
 * calculateNewPosition - THE MAIN PHYSICS ENGINE
 *
 * This is called 60 times per second for each horse during a race.
 * It determines how far a horse moves in one animation frame.
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                         THE MOVEMENT FORMULA                                │
 * │                                                                             │
 * │   moveAmount = speed × speedVariation × (deltaTime / (DIVISOR × distMult)) │
 * │                                                                             │
 * │   Where:                                                                    │
 * │   • speed (0.5-1.0): Based on horse condition (1-100)                       │
 * │   • speedVariation (0.8-1.2): Random "luck" factor each frame               │
 * │   • deltaTime: Milliseconds since last frame (~16ms at 60fps)               │
 * │   • DIVISOR (50): Controls overall race duration                            │
 * │   • distMult (1.0-1.83): Makes longer races take proportionally more time   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * EXAMPLE CALCULATION:
 * ───────────────────
 * Horse: Condition 80 → speed = 0.9
 * Race: 1600m → distanceMultiplier = 1.33
 * Frame: 16ms, speedVariation = 1.0
 *
 * moveAmount = 0.9 × 1.0 × (16 / (50 × 1.33))
 *            = 0.9 × 1.0 × (16 / 66.5)
 *            = 0.9 × 0.24
 *            = 0.216% per frame
 *
 * At 60fps: 0.216 × 60 = 12.96% per second
 * Time to finish: 100 / 12.96 ≈ 7.7 seconds
 *
 * WHY DELTATIME?
 * ──────────────
 * Without deltaTime, speed would depend on frame rate!
 * - 60fps PC: Horse moves every 16ms
 * - 30fps phone: Horse moves every 33ms
 *
 * With deltaTime, both take the same real-world time to finish.
 *
 * @param hp - Current horse position state
 * @param deltaTime - Milliseconds since last animation frame
 * @param distanceMultiplier - Race distance / 1200 (longer = slower)
 * @param speedVariation - Random 0.8-1.2 "luck" factor
 * @param currentTime - Current timestamp (for recording finish time)
 * @returns New HorsePosition with updated position (and finishTime if crossed line)
 */
export const calculateNewPosition = (
  hp: HorsePosition,
  deltaTime: number,
  distanceMultiplier: number,
  speedVariation: number,
  currentTime: number
): HorsePosition => {
  // ═══════════════════════════════════════════════════════════════════════════
  // GUARD: If horse already finished, return unchanged
  // ═══════════════════════════════════════════════════════════════════════════
  // Once a horse crosses the finish line, they stay at position 100.
  // We track their finishTime so we can rank them later.
  if (hp.finishTime !== undefined) {
    return hp;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CALCULATE MOVEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  //
  // Breaking down the formula:
  //
  // hp.speed (0.5-1.0):
  //   - Comes from horse condition: speed = 0.5 + (condition/100) × 0.5
  //   - Condition 1 → 0.505, Condition 100 → 1.0
  //   - Best horses are 2x faster than worst horses
  //
  // speedVariation (0.8-1.2):
  //   - Random "luck" factor applied each frame
  //   - Creates exciting randomness - trailing horse might suddenly surge!
  //   - Even slow horses can have lucky bursts
  //
  // deltaTime / (SPEED_DIVISOR × distanceMultiplier):
  //   - Normalizes movement to real time
  //   - Higher divisor = slower movement
  //   - Higher distance multiplier = slower movement (longer races)
  //
  const moveAmount =
    hp.speed *
    speedVariation *
    (deltaTime / (SPEED_DIVISOR * distanceMultiplier));

  // ═══════════════════════════════════════════════════════════════════════════
  // UPDATE POSITION (capped at 100 = finish line)
  // ═══════════════════════════════════════════════════════════════════════════
  const newPosition = Math.min(hp.position + moveAmount, 100);

  // ═══════════════════════════════════════════════════════════════════════════
  // DETECT FINISH LINE CROSSING
  // ═══════════════════════════════════════════════════════════════════════════
  // We record the exact timestamp when a horse crosses 100%.
  // This is critical for determining race positions!
  //
  // Example scenario:
  //   Frame N:   Horse A at 99.5%, Horse B at 99.8%
  //   Frame N+1: Horse A at 100%, Horse B at 100%
  //
  // Both finish in the same frame, but Horse B gets the earlier timestamp
  // because they were closer to the finish line when the frame started.
  // (In practice, we use the same timestamp, so the one processed first wins)
  //
  const justFinished = hp.position < 100 && newPosition >= 100;

  return {
    ...hp,
    position: newPosition,
    finishTime: justFinished ? currentTime : hp.finishTime,
  };
};

// =============================================================================
// RANDOMNESS: SPEED VARIATION
// =============================================================================

/**
 * generateSpeedVariation - THE "LUCK" FACTOR
 *
 * Adds randomness to each frame's movement calculation.
 * This creates exciting, unpredictable races!
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                      SPEED VARIATION DISTRIBUTION                           │
 * │                                                                             │
 * │   0.8 ─────────────────────────────────────────────────────────── 1.2      │
 * │   │         ↑                   ↑                   ↑             │        │
 * │   │     Unlucky              Average             Lucky            │        │
 * │   │    (-20% speed)          (normal)         (+20% speed)        │        │
 * │                                                                             │
 * │   Result: Even a slow horse can have lucky frames and catch up!            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * WHY 0.8-1.2?
 * ────────────
 * • ±20% variation creates noticeable but not game-breaking randomness
 * • A condition-100 horse (speed 1.0) can temporarily match a condition-60 horse
 * • But over a full race, better horses still usually win
 *
 * DRAMA POTENTIAL:
 * ────────────────
 * • Leading horse gets unlucky streak (0.8, 0.82, 0.85) → slows down
 * • Trailing horse gets lucky streak (1.15, 1.2, 1.18) → surges forward
 * • Creates exciting photo finishes!
 *
 * @returns Random number between 0.8 and 1.2
 */
export const generateSpeedVariation = (): number => {
  // Math.random() gives 0.0-0.999...
  // × 0.4 gives 0.0-0.4
  // + 0.8 gives 0.8-1.2
  return 0.8 + Math.random() * 0.4;
};

// =============================================================================
// DISTANCE SCALING
// =============================================================================

/**
 * calculateDistanceMultiplier - MAKES LONGER RACES TAKE MORE TIME
 *
 * Without this, all races would take the same time regardless of distance!
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                         DISTANCE vs DURATION                                │
 * │                                                                             │
 * │   1200m ████████████████                        (~4 seconds)                │
 * │   1400m ███████████████████                     (~5 seconds)                │
 * │   1600m ██████████████████████                  (~5.5 seconds)              │
 * │   1800m █████████████████████████               (~6 seconds)                │
 * │   2000m ████████████████████████████            (~7 seconds)                │
 * │   2200m ███████████████████████████████         (~7.5 seconds)              │
 * │                                                                             │
 * │   Formula: multiplier = distance / 1200                                    │
 * │   Effect: Divides horse speed by multiplier                                │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * @param distance - Race distance in meters (1200, 1400, 1600, 1800, 2000, 2200)
 * @returns Multiplier to apply to race duration (1.0 to 1.83)
 */
export const calculateDistanceMultiplier = (distance: number): number => {
  return distance / BASE_DISTANCE;
};

// =============================================================================
// RACE COMPLETION DETECTION
// =============================================================================

/**
 * checkAllFinished - DETECTS WHEN RACE IS OVER
 *
 * Checks if every horse in the race has crossed the finish line.
 * Called every animation frame to know when to stop the race.
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │   Horse 1: position=100, finishTime=12345678  ✅ Finished                   │
 * │   Horse 2: position=100, finishTime=12345680  ✅ Finished                   │
 * │   Horse 3: position=98.5, finishTime=undefined ❌ Still racing              │
 * │                                                                             │
 * │   Result: false (not all finished)                                          │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * @param positions - Array of all horse positions in the current race
 * @returns true if ALL horses have a finishTime, false otherwise
 */
export const checkAllFinished = (positions: HorsePosition[]): boolean => {
  return positions.every((hp) => hp.finishTime !== undefined);
};

// =============================================================================
// RESULTS COMPILATION
// =============================================================================

/**
 * sortByFinishTime - ORDERS HORSES BY WHEN THEY FINISHED
 *
 * Sorts horses from first place to last based on their finish timestamps.
 * Earlier finishTime = better position.
 *
 * @param positions - Array of finished horse positions
 * @returns New array sorted by finishTime (earliest first)
 */
export const sortByFinishTime = (
  positions: HorsePosition[]
): HorsePosition[] => {
  // Create a copy to avoid mutating the original array
  // Sort ascending by finishTime (lower = earlier = better)
  return [...positions].sort(
    (a, b) => (a.finishTime || 0) - (b.finishTime || 0)
  );
};

/**
 * compileRaceResults - CREATES THE FINAL RACE RESULTS
 *
 * When all horses finish, this function:
 * 1. Sorts them by finish time
 * 2. Assigns positions (1st, 2nd, 3rd...)
 * 3. Calculates race time for each horse
 * 4. Attaches full horse data for display
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                          RESULTS COMPILATION                                │
 * │                                                                             │
 * │   Input (unsorted):                                                         │
 * │   ┌──────────┬───────────┬─────────────┐                                    │
 * │   │ Horse    │ Position  │ Finish Time │                                    │
 * │   ├──────────┼───────────┼─────────────┤                                    │
 * │   │ Thunder  │ 100%      │ 12345682    │                                    │
 * │   │ Bolt     │ 100%      │ 12345678    │ ← Finished first                   │
 * │   │ Storm    │ 100%      │ 12345685    │                                    │
 * │   └──────────┴───────────┴─────────────┘                                    │
 * │                                                                             │
 * │   Output (sorted with positions):                                           │
 * │   ┌──────────┬──────────┬────────────────────┐                              │
 * │   │ Position │ Horse    │ Time (ms)          │                              │
 * │   ├──────────┼──────────┼────────────────────┤                              │
 * │   │ 1st 🥇   │ Bolt     │ 4123ms             │                              │
 * │   │ 2nd 🥈   │ Thunder  │ 4127ms             │                              │
 * │   │ 3rd 🥉   │ Storm    │ 4130ms             │                              │
 * │   └──────────┴──────────┴────────────────────┘                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * @param positions - Array of all horse positions (all must have finishTime)
 * @param horses - Full horse array for looking up name, color, condition
 * @param animationStartTime - When the race animation started
 * @param currentTime - Fallback timestamp if finishTime is somehow missing
 * @returns Array of RaceResultEntry sorted by position (1st, 2nd, 3rd...)
 */
export const compileRaceResults = (
  positions: HorsePosition[],
  horses: Horse[],
  animationStartTime: number | undefined,
  currentTime: number
): RaceResultEntry[] => {
  // Step 1: Sort by finish time (earliest = 1st place)
  const sortedPositions = sortByFinishTime(positions);

  // Step 2: Map to result entries with position numbers and race times
  return sortedPositions.map((hp, index) => {
    // Find the full horse data for display (name, color, condition)
    const horse = horses.find((h) => h.id === hp.horseId);

    return {
      horseId: hp.horseId,
      position: index + 1, // 1-indexed: 1st, 2nd, 3rd...
      // Calculate race time: finishTime - startTime
      // This gives us how long it took this horse to complete the race
      time: (hp.finishTime || currentTime) - (animationStartTime || 0),
      horse: horse!, // Non-null assertion - horse should always exist
    };
  });
};
