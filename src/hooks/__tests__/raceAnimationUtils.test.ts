import {
  BASE_DISTANCE,
  SPEED_DIVISOR,
  calculateNewPosition,
  generateSpeedVariation,
  calculateDistanceMultiplier,
  checkAllFinished,
  sortByFinishTime,
  compileRaceResults,
} from "../raceAnimationUtils";
import { Horse, HorsePosition } from "../../types";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const createMockPosition = (
  overrides: Partial<HorsePosition> = {}
): HorsePosition => ({
  horseId: "horse_1",
  position: 0,
  lane: 1,
  speed: 0.75,
  ...overrides,
});

const createMockHorse = (overrides: Partial<Horse> = {}): Horse => ({
  id: "horse_1",
  name: "Thunder",
  condition: 50,
  color: "#FF0000",
  ...overrides,
});

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

describe("constants", () => {
  it("BASE_DISTANCE is 1200", () => {
    expect(BASE_DISTANCE).toBe(1200);
  });

  it("SPEED_DIVISOR is 50", () => {
    expect(SPEED_DIVISOR).toBe(50);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// calculateNewPosition
// ─────────────────────────────────────────────────────────────────────────────

describe("calculateNewPosition", () => {
  const deltaTime = 16; // ~60fps
  const distanceMultiplier = 1.0;
  const speedVariation = 1.0;
  const currentTime = 1000;

  it("returns unchanged position if horse already finished", () => {
    const hp = createMockPosition({
      position: 100,
      finishTime: 500,
    });

    const result = calculateNewPosition(
      hp,
      deltaTime,
      distanceMultiplier,
      speedVariation,
      currentTime
    );

    expect(result).toEqual(hp);
    expect(result.position).toBe(100);
    expect(result.finishTime).toBe(500);
  });

  it("moves horse forward based on speed and deltaTime", () => {
    const hp = createMockPosition({
      position: 0,
      speed: 1.0,
    });

    const result = calculateNewPosition(
      hp,
      deltaTime,
      distanceMultiplier,
      speedVariation,
      currentTime
    );

    // moveAmount = speed * speedVariation * (deltaTime / (SPEED_DIVISOR * distanceMultiplier))
    // moveAmount = 1.0 * 1.0 * (16 / (50 * 1.0)) = 0.32
    expect(result.position).toBeCloseTo(0.32, 2);
    expect(result.finishTime).toBeUndefined();
  });

  it("higher speed means faster movement", () => {
    const slowHp = createMockPosition({ position: 0, speed: 0.5 });
    const fastHp = createMockPosition({ position: 0, speed: 1.0 });

    const slowResult = calculateNewPosition(
      slowHp,
      deltaTime,
      distanceMultiplier,
      speedVariation,
      currentTime
    );
    const fastResult = calculateNewPosition(
      fastHp,
      deltaTime,
      distanceMultiplier,
      speedVariation,
      currentTime
    );

    expect(fastResult.position).toBeGreaterThan(slowResult.position);
    expect(fastResult.position).toBeCloseTo(slowResult.position * 2, 2);
  });

  it("longer deltaTime means more movement", () => {
    const hp = createMockPosition({ position: 0, speed: 1.0 });

    const shortDelta = calculateNewPosition(
      hp,
      8,
      distanceMultiplier,
      speedVariation,
      currentTime
    );
    const longDelta = calculateNewPosition(
      hp,
      16,
      distanceMultiplier,
      speedVariation,
      currentTime
    );

    expect(longDelta.position).toBeGreaterThan(shortDelta.position);
    expect(longDelta.position).toBeCloseTo(shortDelta.position * 2, 2);
  });

  it("higher distance multiplier means slower movement", () => {
    const hp = createMockPosition({ position: 0, speed: 1.0 });

    const shortRace = calculateNewPosition(
      hp,
      deltaTime,
      1.0,
      speedVariation,
      currentTime
    );
    const longRace = calculateNewPosition(
      hp,
      deltaTime,
      2.0,
      speedVariation,
      currentTime
    );

    expect(shortRace.position).toBeGreaterThan(longRace.position);
    expect(shortRace.position).toBeCloseTo(longRace.position * 2, 2);
  });

  it("caps position at 100", () => {
    const hp = createMockPosition({
      position: 99.9,
      speed: 1.0,
    });

    const result = calculateNewPosition(
      hp,
      1000, // Large deltaTime to ensure crossing 100
      distanceMultiplier,
      speedVariation,
      currentTime
    );

    expect(result.position).toBe(100);
  });

  it("sets finishTime when crossing finish line", () => {
    const hp = createMockPosition({
      position: 99.5,
      speed: 1.0,
    });

    const result = calculateNewPosition(
      hp,
      100, // Enough to cross 100
      distanceMultiplier,
      speedVariation,
      currentTime
    );

    expect(result.position).toBe(100);
    expect(result.finishTime).toBe(currentTime);
  });

  it("does not set finishTime if not crossing finish line", () => {
    const hp = createMockPosition({
      position: 50,
      speed: 0.5,
    });

    const result = calculateNewPosition(
      hp,
      deltaTime,
      distanceMultiplier,
      speedVariation,
      currentTime
    );

    expect(result.position).toBeLessThan(100);
    expect(result.finishTime).toBeUndefined();
  });

  it("preserves other horse position properties", () => {
    const hp = createMockPosition({
      horseId: "horse_5",
      lane: 3,
      speed: 0.8,
      position: 25,
    });

    const result = calculateNewPosition(
      hp,
      deltaTime,
      distanceMultiplier,
      speedVariation,
      currentTime
    );

    expect(result.horseId).toBe("horse_5");
    expect(result.lane).toBe(3);
    expect(result.speed).toBe(0.8);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// generateSpeedVariation
// ─────────────────────────────────────────────────────────────────────────────

describe("generateSpeedVariation", () => {
  it("returns value between 0.8 and 1.2", () => {
    // Run multiple times to test randomness bounds
    for (let i = 0; i < 100; i++) {
      const variation = generateSpeedVariation();
      expect(variation).toBeGreaterThanOrEqual(0.8);
      expect(variation).toBeLessThanOrEqual(1.2);
    }
  });

  it("produces different values (randomness)", () => {
    const values = new Set<number>();
    for (let i = 0; i < 20; i++) {
      values.add(generateSpeedVariation());
    }
    // Should have multiple unique values
    expect(values.size).toBeGreaterThan(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// calculateDistanceMultiplier
// ─────────────────────────────────────────────────────────────────────────────

describe("calculateDistanceMultiplier", () => {
  it("returns 1.0 for BASE_DISTANCE (1200m)", () => {
    expect(calculateDistanceMultiplier(1200)).toBe(1.0);
  });

  it("returns correct multipliers for standard distances", () => {
    expect(calculateDistanceMultiplier(1200)).toBeCloseTo(1.0, 5);
    expect(calculateDistanceMultiplier(1400)).toBeCloseTo(1.167, 2);
    expect(calculateDistanceMultiplier(1600)).toBeCloseTo(1.333, 2);
    expect(calculateDistanceMultiplier(1800)).toBeCloseTo(1.5, 5);
    expect(calculateDistanceMultiplier(2000)).toBeCloseTo(1.667, 2);
    expect(calculateDistanceMultiplier(2200)).toBeCloseTo(1.833, 2);
  });

  it("returns 2.0 for double BASE_DISTANCE", () => {
    expect(calculateDistanceMultiplier(2400)).toBe(2.0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// checkAllFinished
// ─────────────────────────────────────────────────────────────────────────────

describe("checkAllFinished", () => {
  it("returns true when all horses have finishTime", () => {
    const positions: HorsePosition[] = [
      createMockPosition({ horseId: "h1", finishTime: 100 }),
      createMockPosition({ horseId: "h2", finishTime: 200 }),
      createMockPosition({ horseId: "h3", finishTime: 300 }),
    ];

    expect(checkAllFinished(positions)).toBe(true);
  });

  it("returns false when some horses have not finished", () => {
    const positions: HorsePosition[] = [
      createMockPosition({ horseId: "h1", finishTime: 100 }),
      createMockPosition({ horseId: "h2", finishTime: undefined }),
      createMockPosition({ horseId: "h3", finishTime: 300 }),
    ];

    expect(checkAllFinished(positions)).toBe(false);
  });

  it("returns false when no horses have finished", () => {
    const positions: HorsePosition[] = [
      createMockPosition({ horseId: "h1" }),
      createMockPosition({ horseId: "h2" }),
    ];

    expect(checkAllFinished(positions)).toBe(false);
  });

  it("returns true for empty array", () => {
    expect(checkAllFinished([])).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// sortByFinishTime
// ─────────────────────────────────────────────────────────────────────────────

describe("sortByFinishTime", () => {
  it("sorts positions by finishTime ascending", () => {
    const positions: HorsePosition[] = [
      createMockPosition({ horseId: "h3", finishTime: 300 }),
      createMockPosition({ horseId: "h1", finishTime: 100 }),
      createMockPosition({ horseId: "h2", finishTime: 200 }),
    ];

    const sorted = sortByFinishTime(positions);

    expect(sorted[0].horseId).toBe("h1");
    expect(sorted[1].horseId).toBe("h2");
    expect(sorted[2].horseId).toBe("h3");
  });

  it("does not mutate original array", () => {
    const positions: HorsePosition[] = [
      createMockPosition({ horseId: "h2", finishTime: 200 }),
      createMockPosition({ horseId: "h1", finishTime: 100 }),
    ];
    const originalOrder = positions.map((p) => p.horseId);

    sortByFinishTime(positions);

    expect(positions.map((p) => p.horseId)).toEqual(originalOrder);
  });

  it("treats undefined finishTime as 0", () => {
    const positions: HorsePosition[] = [
      createMockPosition({ horseId: "h1", finishTime: 100 }),
      createMockPosition({ horseId: "h2", finishTime: undefined }),
    ];

    const sorted = sortByFinishTime(positions);

    expect(sorted[0].horseId).toBe("h2"); // undefined (0) comes first
    expect(sorted[1].horseId).toBe("h1");
  });

  it("handles ties by preserving original order", () => {
    const positions: HorsePosition[] = [
      createMockPosition({ horseId: "h1", finishTime: 100 }),
      createMockPosition({ horseId: "h2", finishTime: 100 }),
    ];

    const sorted = sortByFinishTime(positions);

    // JavaScript sort is stable, so original order preserved for ties
    expect(sorted[0].horseId).toBe("h1");
    expect(sorted[1].horseId).toBe("h2");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// compileRaceResults
// ─────────────────────────────────────────────────────────────────────────────

describe("compileRaceResults", () => {
  const mockHorses: Horse[] = [
    createMockHorse({ id: "h1", name: "Thunder" }),
    createMockHorse({ id: "h2", name: "Lightning" }),
    createMockHorse({ id: "h3", name: "Storm" }),
  ];

  it("creates results sorted by finish time", () => {
    const positions: HorsePosition[] = [
      createMockPosition({ horseId: "h3", finishTime: 5300 }),
      createMockPosition({ horseId: "h1", finishTime: 5100 }),
      createMockPosition({ horseId: "h2", finishTime: 5200 }),
    ];

    const results = compileRaceResults(positions, mockHorses, 5000, 6000);

    expect(results[0].horseId).toBe("h1");
    expect(results[0].position).toBe(1);
    expect(results[1].horseId).toBe("h2");
    expect(results[1].position).toBe(2);
    expect(results[2].horseId).toBe("h3");
    expect(results[2].position).toBe(3);
  });

  it("calculates time relative to animation start", () => {
    const positions: HorsePosition[] = [
      createMockPosition({ horseId: "h1", finishTime: 5500 }),
    ];

    const results = compileRaceResults(positions, mockHorses, 5000, 6000);

    expect(results[0].time).toBe(500); // 5500 - 5000
  });

  it("includes horse data in results", () => {
    const positions: HorsePosition[] = [
      createMockPosition({ horseId: "h2", finishTime: 5100 }),
    ];

    const results = compileRaceResults(positions, mockHorses, 5000, 6000);

    expect(results[0].horse).toBeDefined();
    expect(results[0].horse.name).toBe("Lightning");
    expect(results[0].horse.id).toBe("h2");
  });

  it("assigns positions 1 through N", () => {
    const positions: HorsePosition[] = [
      createMockPosition({ horseId: "h1", finishTime: 5100 }),
      createMockPosition({ horseId: "h2", finishTime: 5200 }),
      createMockPosition({ horseId: "h3", finishTime: 5300 }),
    ];

    const results = compileRaceResults(positions, mockHorses, 5000, 6000);

    expect(results.map((r) => r.position)).toEqual([1, 2, 3]);
  });

  it("uses currentTime for fallback when finishTime is undefined", () => {
    const positions: HorsePosition[] = [
      createMockPosition({ horseId: "h1", finishTime: undefined }),
    ];

    const results = compileRaceResults(positions, mockHorses, 5000, 6000);

    expect(results[0].time).toBe(1000); // 6000 - 5000
  });

  it("handles empty positions array", () => {
    const results = compileRaceResults([], mockHorses, 5000, 6000);
    expect(results).toHaveLength(0);
  });
});
