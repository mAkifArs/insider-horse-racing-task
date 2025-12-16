import React, { memo } from "react";
import Typography from "../../Typography";
import { RaceTrackProps } from "./types";
import { useGameStore, selectResults } from "../../../store";
import { GameState } from "../../../types";
import { useRaceAnimation } from "../../../hooks/useRaceAnimation";
import { formatRoundLabel } from "../../../utils/formatters";
import HorseSvg from "./HorseSvg";
import styles from "./RaceTrack.module.scss";

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the message to display when no race is active
 */
const getEmptyMessage = (
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
 * Convert position percentage to display position (accounting for finish line area)
 */
const getDisplayPosition = (positionPercent: number): number => {
  return Math.min(positionPercent * 0.95, 95);
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * RaceTrack Component
 *
 * Pure presentation component that renders the race track visualization.
 * All animation logic is handled by the useRaceAnimation hook.
 *
 * Features:
 * - 10 lanes with lane numbers
 * - Animated horse icons (pre-joined data, no lookups in render)
 * - Finish line
 * - Race info display
 * - Empty state messages
 */
const RaceTrack: React.FC<RaceTrackProps> = memo(
  ({ currentRace, horses, isAnimating }) => {
    // Get game state for empty message logic
    const gameState = useGameStore((state) => state.gameState);
    const results = useGameStore(selectResults);

    // Use race animation hook - returns pre-joined horse data with positions
    const { raceHorses } = useRaceAnimation({
      currentRace,
      horses,
      isAnimating,
    });

    // ─────────────────────────────────────────────────────────────────────────
    // EMPTY STATE
    // ─────────────────────────────────────────────────────────────────────────

    if (!currentRace) {
      return (
        <div className={styles.trackContainer}>
          <div className={styles.emptyMessage}>
            <Typography variant="body1" color="secondary">
              {getEmptyMessage(gameState, results.length)}
            </Typography>
          </div>
        </div>
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // RACE VIEW
    // ─────────────────────────────────────────────────────────────────────────

    return (
      <div className={styles.trackContainer}>
        <div className={styles.lanesContainer}>
          {raceHorses.map((raceHorse, index) => {
            const displayPosition = getDisplayPosition(raceHorse.position);

            return (
              <div key={raceHorse.horse.id} className={styles.lane}>
                <div className={styles.laneNumber}>{index + 1}</div>
                <div className={styles.trackArea}>
                  <div
                    className={styles.horseIconWrapper}
                    style={{ left: `${displayPosition}%` }}
                  >
                    <HorseSvg color={raceHorse.horse.color} size={36} />
                  </div>
                </div>
              </div>
            );
          })}
          <div className={styles.finishLine}>
            <span className={styles.finishText}>FINISH</span>
          </div>
        </div>
        <div className={styles.raceInfo}>
          <Typography variant="body2" bold>
            {formatRoundLabel(currentRace.roundNumber, currentRace.distance)}
          </Typography>
        </div>
      </div>
    );
  }
);

RaceTrack.displayName = "RaceTrack";

export default RaceTrack;
