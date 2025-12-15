import { generateHorses, getHorseById, getHorsesByIds } from "../horseGenerator";
import { Horse } from "../../types/horse";

describe("horseGenerator", () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // generateHorses
  // ─────────────────────────────────────────────────────────────────────────────

  describe("generateHorses", () => {
    it("generates exactly 20 horses", () => {
      const horses = generateHorses();
      expect(horses).toHaveLength(20);
    });

    it("generates horses with unique IDs", () => {
      const horses = generateHorses();
      const ids = horses.map((h) => h.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(20);
    });

    it("generates horses with IDs in format horse_N", () => {
      const horses = generateHorses();
      horses.forEach((horse, index) => {
        expect(horse.id).toBe(`horse_${index + 1}`);
      });
    });

    it("generates horses with unique colors", () => {
      const horses = generateHorses();
      const colors = horses.map((h) => h.color);
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(20);
    });

    it("generates horses with valid hex color codes", () => {
      const horses = generateHorses();
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      horses.forEach((horse) => {
        expect(horse.color).toMatch(hexColorRegex);
      });
    });

    it("generates horses with condition between 1 and 100", () => {
      const horses = generateHorses();
      horses.forEach((horse) => {
        expect(horse.condition).toBeGreaterThanOrEqual(1);
        expect(horse.condition).toBeLessThanOrEqual(100);
      });
    });

    it("generates horses with non-empty names", () => {
      const horses = generateHorses();
      horses.forEach((horse) => {
        expect(horse.name).toBeTruthy();
        expect(horse.name.length).toBeGreaterThan(0);
      });
    });

    it("generates different conditions on multiple calls (randomness)", () => {
      const horses1 = generateHorses();
      const horses2 = generateHorses();

      // Compare conditions - they should differ (extremely unlikely to be same)
      const conditions1 = horses1.map((h) => h.condition).join(",");
      const conditions2 = horses2.map((h) => h.condition).join(",");

      expect(conditions1).not.toBe(conditions2);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // getHorseById
  // ─────────────────────────────────────────────────────────────────────────────

  describe("getHorseById", () => {
    const mockHorses: Horse[] = [
      { id: "horse_1", name: "Thunder", condition: 80, color: "#FF0000" },
      { id: "horse_2", name: "Lightning", condition: 90, color: "#00FF00" },
      { id: "horse_3", name: "Storm", condition: 70, color: "#0000FF" },
    ];

    it("returns the correct horse when found", () => {
      const horse = getHorseById(mockHorses, "horse_2");
      expect(horse).toBeDefined();
      expect(horse?.name).toBe("Lightning");
      expect(horse?.condition).toBe(90);
    });

    it("returns undefined when horse not found", () => {
      const horse = getHorseById(mockHorses, "horse_999");
      expect(horse).toBeUndefined();
    });

    it("returns undefined for empty array", () => {
      const horse = getHorseById([], "horse_1");
      expect(horse).toBeUndefined();
    });

    it("returns first match when duplicates exist", () => {
      const duplicateHorses: Horse[] = [
        { id: "horse_1", name: "First", condition: 50, color: "#111111" },
        { id: "horse_1", name: "Second", condition: 60, color: "#222222" },
      ];
      const horse = getHorseById(duplicateHorses, "horse_1");
      expect(horse?.name).toBe("First");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // getHorsesByIds
  // ─────────────────────────────────────────────────────────────────────────────

  describe("getHorsesByIds", () => {
    const mockHorses: Horse[] = [
      { id: "horse_1", name: "Thunder", condition: 80, color: "#FF0000" },
      { id: "horse_2", name: "Lightning", condition: 90, color: "#00FF00" },
      { id: "horse_3", name: "Storm", condition: 70, color: "#0000FF" },
      { id: "horse_4", name: "Blaze", condition: 85, color: "#FFFF00" },
    ];

    it("returns correct horses for valid IDs", () => {
      const horses = getHorsesByIds(mockHorses, ["horse_1", "horse_3"]);
      expect(horses).toHaveLength(2);
      expect(horses[0].name).toBe("Thunder");
      expect(horses[1].name).toBe("Storm");
    });

    it("filters out invalid IDs", () => {
      const horses = getHorsesByIds(mockHorses, [
        "horse_1",
        "invalid_id",
        "horse_2",
      ]);
      expect(horses).toHaveLength(2);
      expect(horses[0].name).toBe("Thunder");
      expect(horses[1].name).toBe("Lightning");
    });

    it("returns empty array when no IDs match", () => {
      const horses = getHorsesByIds(mockHorses, ["invalid_1", "invalid_2"]);
      expect(horses).toHaveLength(0);
    });

    it("returns empty array for empty ID list", () => {
      const horses = getHorsesByIds(mockHorses, []);
      expect(horses).toHaveLength(0);
    });

    it("preserves order of input IDs", () => {
      const horses = getHorsesByIds(mockHorses, [
        "horse_4",
        "horse_2",
        "horse_1",
      ]);
      expect(horses).toHaveLength(3);
      expect(horses[0].name).toBe("Blaze");
      expect(horses[1].name).toBe("Lightning");
      expect(horses[2].name).toBe("Thunder");
    });

    it("handles all valid IDs", () => {
      const horses = getHorsesByIds(mockHorses, [
        "horse_1",
        "horse_2",
        "horse_3",
        "horse_4",
      ]);
      expect(horses).toHaveLength(4);
    });
  });
});

