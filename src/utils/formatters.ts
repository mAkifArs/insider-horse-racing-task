/**
 * =============================================================================
 * FORMATTERS
 * Utility functions for formatting display strings
 * =============================================================================
 */

/**
 * Get ordinal suffix for a number (1st, 2nd, 3rd, 4th, etc.)
 *
 * @param n - The number to get suffix for
 * @returns Ordinal suffix (ST, ND, RD, TH)
 */
export const getOrdinalSuffix = (n: number): string => {
  const suffixes = ["ST", "ND", "RD"];
  return suffixes[n - 1] || "TH";
};

/**
 * Format round/lap label for display
 * Example: "1ST Lap - 1200m", "2ND Lap - 1400m"
 *
 * @param roundNumber - Round number (1-6)
 * @param distance - Distance in meters
 * @returns Formatted label string
 */
export const formatRoundLabel = (
  roundNumber: number,
  distance: number
): string => {
  const suffix = getOrdinalSuffix(roundNumber);
  return `${roundNumber}${suffix} Lap - ${distance}m`;
};
