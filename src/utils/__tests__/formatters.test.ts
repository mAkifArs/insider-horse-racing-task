import { getOrdinalSuffix, formatRoundLabel } from "../formatters";

describe("formatters", () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // getOrdinalSuffix
  // ─────────────────────────────────────────────────────────────────────────────

  describe("getOrdinalSuffix", () => {
    it("returns ST for 1", () => {
      expect(getOrdinalSuffix(1)).toBe("ST");
    });

    it("returns ND for 2", () => {
      expect(getOrdinalSuffix(2)).toBe("ND");
    });

    it("returns RD for 3", () => {
      expect(getOrdinalSuffix(3)).toBe("RD");
    });

    it("returns TH for 4 and above", () => {
      expect(getOrdinalSuffix(4)).toBe("TH");
      expect(getOrdinalSuffix(5)).toBe("TH");
      expect(getOrdinalSuffix(6)).toBe("TH");
      expect(getOrdinalSuffix(10)).toBe("TH");
      expect(getOrdinalSuffix(100)).toBe("TH");
    });

    it("returns TH for 0 and negative numbers", () => {
      expect(getOrdinalSuffix(0)).toBe("TH");
      expect(getOrdinalSuffix(-1)).toBe("TH");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // formatRoundLabel
  // ─────────────────────────────────────────────────────────────────────────────

  describe("formatRoundLabel", () => {
    it("formats round 1 correctly", () => {
      expect(formatRoundLabel(1, 1200)).toBe("1ST Lap - 1200m");
    });

    it("formats round 2 correctly", () => {
      expect(formatRoundLabel(2, 1400)).toBe("2ND Lap - 1400m");
    });

    it("formats round 3 correctly", () => {
      expect(formatRoundLabel(3, 1600)).toBe("3RD Lap - 1600m");
    });

    it("formats rounds 4-6 correctly", () => {
      expect(formatRoundLabel(4, 1800)).toBe("4TH Lap - 1800m");
      expect(formatRoundLabel(5, 2000)).toBe("5TH Lap - 2000m");
      expect(formatRoundLabel(6, 2200)).toBe("6TH Lap - 2200m");
    });

    it("handles any distance value", () => {
      expect(formatRoundLabel(1, 500)).toBe("1ST Lap - 500m");
      expect(formatRoundLabel(1, 10000)).toBe("1ST Lap - 10000m");
    });
  });
});

