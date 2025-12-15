import {
  calculateHorseSpeed,
  initializeHorsePositions,
  DEFAULT_HORSE_SPEED,
} from "../raceHelpers";
import { Horse } from "../../../types";

// Mock horses for testing
const createMockHorses = (conditions: number[]): Horse[] => {
  return conditions.map((condition, i) => ({
    id: `horse_${i + 1}`,
    name: `Horse ${i + 1}`,
    condition,
    color: `#${String(i).padStart(6, "0")}`,
  }));
};

describe("raceHelpers", () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // calculateHorseSpeed
  // ─────────────────────────────────────────────────────────────────────────────

  describe("calculateHorseSpeed", () => {
    it("returns 0.505 for condition 1 (slowest)", () => {
      const speed = calculateHorseSpeed(1);
      expect(speed).toBeCloseTo(0.505, 3);
    });

    it("returns 0.75 for condition 50 (average)", () => {
      const speed = calculateHorseSpeed(50);
      expect(speed).toBeCloseTo(0.75, 3);
    });

    it("returns 1.0 for condition 100 (fastest)", () => {
      const speed = calculateHorseSpeed(100);
      expect(speed).toBeCloseTo(1.0, 3);
    });

    it("returns 0.5 for condition 0", () => {
      const speed = calculateHorseSpeed(0);
      expect(speed).toBeCloseTo(0.5, 3);
    });

    it("higher condition results in higher speed", () => {
      const speed25 = calculateHorseSpeed(25);
      const speed50 = calculateHorseSpeed(50);
      const speed75 = calculateHorseSpeed(75);

      expect(speed25).toBeLessThan(speed50);
      expect(speed50).toBeLessThan(speed75);
    });

    it("speed is linearly proportional to condition", () => {
      // Speed formula: 0.5 + (condition / 100) * 0.5
      // For every 20 points of condition, speed increases by 0.1
      const speed20 = calculateHorseSpeed(20);
      const speed40 = calculateHorseSpeed(40);
      const speed60 = calculateHorseSpeed(60);

      const diff1 = speed40 - speed20;
      const diff2 = speed60 - speed40;

      expect(diff1).toBeCloseTo(diff2, 5);
      expect(diff1).toBeCloseTo(0.1, 5);
    });

    it("best horse is ~2x faster than worst horse", () => {
      const slowest = calculateHorseSpeed(1);
      const fastest = calculateHorseSpeed(100);
      const ratio = fastest / slowest;

      // Ratio should be approximately 1.98 (1.0 / 0.505)
      expect(ratio).toBeCloseTo(1.98, 1);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // initializeHorsePositions
  // ─────────────────────────────────────────────────────────────────────────────

  describe("initializeHorsePositions", () => {
    const mockHorses = createMockHorses([80, 60, 40, 100, 20]);

    it("creates positions for all provided horse IDs", () => {
      const horseIds = ["horse_1", "horse_2", "horse_3"];
      const positions = initializeHorsePositions(horseIds, mockHorses);
      expect(positions).toHaveLength(3);
    });

    it("all horses start at position 0", () => {
      const horseIds = ["horse_1", "horse_2", "horse_3"];
      const positions = initializeHorsePositions(horseIds, mockHorses);
      positions.forEach((pos) => {
        expect(pos.position).toBe(0);
      });
    });

    it("assigns correct lane numbers (1-based)", () => {
      const horseIds = ["horse_1", "horse_2", "horse_3"];
      const positions = initializeHorsePositions(horseIds, mockHorses);
      positions.forEach((pos, index) => {
        expect(pos.lane).toBe(index + 1);
      });
    });

    it("assigns correct horse IDs", () => {
      const horseIds = ["horse_3", "horse_1", "horse_2"];
      const positions = initializeHorsePositions(horseIds, mockHorses);
      expect(positions[0].horseId).toBe("horse_3");
      expect(positions[1].horseId).toBe("horse_1");
      expect(positions[2].horseId).toBe("horse_2");
    });

    it("calculates speed based on horse condition", () => {
      // horse_1 has condition 80, horse_3 has condition 40
      const horseIds = ["horse_1", "horse_3"];
      const positions = initializeHorsePositions(horseIds, mockHorses);

      expect(positions[0].speed).toBeCloseTo(calculateHorseSpeed(80), 5);
      expect(positions[1].speed).toBeCloseTo(calculateHorseSpeed(40), 5);
    });

    it("uses default condition (50) for unknown horse IDs", () => {
      const horseIds = ["unknown_horse"];
      const positions = initializeHorsePositions(horseIds, mockHorses);

      // Default condition is 50, so speed should be 0.75
      expect(positions[0].speed).toBeCloseTo(0.75, 5);
    });

    it("handles empty horse IDs array", () => {
      const positions = initializeHorsePositions([], mockHorses);
      expect(positions).toHaveLength(0);
    });

    it("handles 10 horses (full race)", () => {
      const tenHorses = createMockHorses([
        10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
      ]);
      const horseIds = tenHorses.map((h) => h.id);
      const positions = initializeHorsePositions(horseIds, tenHorses);

      expect(positions).toHaveLength(10);
      expect(positions[0].lane).toBe(1);
      expect(positions[9].lane).toBe(10);
    });

    it("positions have no finishTime initially", () => {
      const horseIds = ["horse_1", "horse_2"];
      const positions = initializeHorsePositions(horseIds, mockHorses);
      positions.forEach((pos) => {
        expect(pos.finishTime).toBeUndefined();
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // DEFAULT_HORSE_SPEED
  // ─────────────────────────────────────────────────────────────────────────────

  describe("DEFAULT_HORSE_SPEED", () => {
    it("equals speed for condition 50", () => {
      expect(DEFAULT_HORSE_SPEED).toBeCloseTo(calculateHorseSpeed(50), 5);
    });

    it("is 0.75", () => {
      expect(DEFAULT_HORSE_SPEED).toBe(0.75);
    });
  });
});
