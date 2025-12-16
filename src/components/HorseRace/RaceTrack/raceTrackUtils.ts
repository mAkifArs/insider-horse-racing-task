import { GameState } from "../../../types";

/**
 * Get the message to display when no race is active
 */
export const getEmptyMessage = (
  gameState: GameState,
  resultsCount: number
): string => {
  if (gameState === GameState.SCHEDULE_READY) {
    if (resultsCount > 0) {
      const nextRound = resultsCount + 1;
      return `Click "CONTINUE" to resume racing (Round ${nextRound}/6)`;
    }
    return 'Click "START" to begin racing';
  }
  if (gameState === GameState.COMPLETED) {
    return "All races completed! 🏆";
  }
  if (gameState === GameState.RACING && resultsCount > 0) {
    const nextRound = resultsCount + 1;
    return `Next race starting... (Round ${nextRound}/6)`;
  }
  return "Generate a program to start racing";
};

/**
 * Convert position percentage to display position
 * Accounts for finish line area (95% max)
 */
export const getDisplayPosition = (positionPercent: number): number => {
  return Math.min(positionPercent * 0.95, 95);
};

