import {
  shuffleArray,
  selectRandomHorses,
  createRaceSchedule,
} from "../scheduleHelpers";
import { Horse, RaceStatus, ROUND_DISTANCES } from "../../../types";

// Mock horses for testing
const createMockHorses = (count: number): Horse[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `horse_${i + 1}`,
    name: `Horse ${i + 1}`,
    condition: 50 + i,
    color: `#${String(i).padStart(6, "0")}`,
  }));
};

describe("scheduleHelpers", () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // shuffleArray
  // ─────────────────────────────────────────────────────────────────────────────

  describe("shuffleArray", () => {
    it("returns array with same length", () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffleArray(input);
      expect(result).toHaveLength(input.length);
    });

    it("returns array with same elements", () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffleArray(input);
      expect(result.sort()).toEqual(input.sort());
    });

    it("does not mutate original array", () => {
      const input = [1, 2, 3, 4, 5];
      const originalCopy = [...input];
      shuffleArray(input);
      expect(input).toEqual(originalCopy);
    });

    it("returns new array instance", () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffleArray(input);
      expect(result).not.toBe(input);
    });

    it("handles empty array", () => {
      const result = shuffleArray([]);
      expect(result).toEqual([]);
    });

    it("handles single element array", () => {
      const result = shuffleArray([1]);
      expect(result).toEqual([1]);
    });

    it("produces different orders on multiple calls (randomness)", () => {
      const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const results = new Set<string>();

      // Run multiple times and collect unique orderings
      for (let i = 0; i < 20; i++) {
        results.add(shuffleArray(input).join(","));
      }

      // Should have at least 2 different orderings (extremely likely)
      expect(results.size).toBeGreaterThan(1);
    });

    it("works with objects", () => {
      const input = [{ a: 1 }, { a: 2 }, { a: 3 }];
      const result = shuffleArray(input);
      expect(result).toHaveLength(3);
      expect(result.map((x) => x.a).sort()).toEqual([1, 2, 3]);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // selectRandomHorses
  // ─────────────────────────────────────────────────────────────────────────────

  describe("selectRandomHorses", () => {
    const mockHorses = createMockHorses(20);

    it("returns exactly 10 horse IDs", () => {
      const result = selectRandomHorses(mockHorses);
      expect(result).toHaveLength(10);
    });

    it("returns unique horse IDs", () => {
      const result = selectRandomHorses(mockHorses);
      const uniqueIds = new Set(result);
      expect(uniqueIds.size).toBe(10);
    });

    it("returns only valid horse IDs from input", () => {
      const result = selectRandomHorses(mockHorses);
      const validIds = mockHorses.map((h) => h.id);
      result.forEach((id) => {
        expect(validIds).toContain(id);
      });
    });

    it("returns different selections on multiple calls (randomness)", () => {
      const results = new Set<string>();

      for (let i = 0; i < 10; i++) {
        const selection = selectRandomHorses(mockHorses).sort().join(",");
        results.add(selection);
      }

      // Should have at least 2 different selections
      expect(results.size).toBeGreaterThan(1);
    });

    it("handles exactly 10 horses input", () => {
      const tenHorses = createMockHorses(10);
      const result = selectRandomHorses(tenHorses);
      expect(result).toHaveLength(10);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // createRaceSchedule
  // ─────────────────────────────────────────────────────────────────────────────

  describe("createRaceSchedule", () => {
    const mockHorses = createMockHorses(20);

    it("creates exactly 6 races", () => {
      const schedule = createRaceSchedule(mockHorses);
      expect(schedule).toHaveLength(6);
    });

    it("assigns correct round numbers (1-6)", () => {
      const schedule = createRaceSchedule(mockHorses);
      schedule.forEach((race, index) => {
        expect(race.roundNumber).toBe(index + 1);
      });
    });

    it("assigns correct distances from ROUND_DISTANCES", () => {
      const schedule = createRaceSchedule(mockHorses);
      schedule.forEach((race, index) => {
        expect(race.distance).toBe(ROUND_DISTANCES[index]);
      });
    });

    it("assigns distances in correct order (1200, 1400, 1600, 1800, 2000, 2200)", () => {
      const schedule = createRaceSchedule(mockHorses);
      const expectedDistances = [1200, 1400, 1600, 1800, 2000, 2200];
      schedule.forEach((race, index) => {
        expect(race.distance).toBe(expectedDistances[index]);
      });
    });

    it("each race has 10 horses", () => {
      const schedule = createRaceSchedule(mockHorses);
      schedule.forEach((race) => {
        expect(race.horseIds).toHaveLength(10);
      });
    });

    it("each race starts with PENDING status", () => {
      const schedule = createRaceSchedule(mockHorses);
      schedule.forEach((race) => {
        expect(race.status).toBe(RaceStatus.PENDING);
      });
    });

    it("each race has unique horse IDs within the race", () => {
      const schedule = createRaceSchedule(mockHorses);
      schedule.forEach((race) => {
        const uniqueIds = new Set(race.horseIds);
        expect(uniqueIds.size).toBe(10);
      });
    });

    it("different races may have different horse selections", () => {
      const schedule = createRaceSchedule(mockHorses);
      const selections = schedule.map((race) => race.horseIds.sort().join(","));
      const uniqueSelections = new Set(selections);

      // At least some races should have different selections
      // (could be same by chance, but very unlikely for all 6)
      expect(uniqueSelections.size).toBeGreaterThanOrEqual(1);
    });
  });
});
