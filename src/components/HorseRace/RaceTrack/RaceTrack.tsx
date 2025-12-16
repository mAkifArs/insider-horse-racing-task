import React, { memo } from "react";
import Typography from "../../Typography";
import {
  useGameStore,
  selectRaceExecution,
  selectResults,
} from "../../../store";
import { useRefBasedRaceAnimation } from "../../../hooks/useRefBasedRaceAnimation";
import { formatRoundLabel } from "../../../utils/formatters";
import { getEmptyMessage } from "./raceTrackUtils";
import RaceLane from "./RaceLane";
import styles from "./RaceTrack.module.scss";

/**
 * RaceTrack Component
 *
 * Renders the race track visualization.
 * Uses ref-based animation for smooth, re-render-free animation.
 *
 * Features:
 * - 10 lanes with horse icons
 * - Finish line
 * - Race info display
 * - Empty state messages
 *
 * PERFORMANCE:
 * - Uses useRefBasedRaceAnimation which updates DOM directly via refs
 * - NO React re-renders during animation (~600 re-renders eliminated per race)
 * - Only re-renders when race starts or completes
 */
const RaceTrack: React.FC = memo(() => {
  // Store state
  const gameState = useGameStore((state) => state.gameState);
  const currentRace = useGameStore(selectRaceExecution).currentRace;
  const results = useGameStore(selectResults);

  // Ref-based animation hook - updates DOM directly, no re-renders during animation
  const { raceHorses, registerHorseRef } = useRefBasedRaceAnimation();

  // Empty state
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

  // Race view
  return (
    <div className={styles.trackContainer}>
      <div className={styles.lanesContainer}>
        {raceHorses.map((raceHorse, index) => (
          <RaceLane
            key={raceHorse.horse.id}
            horse={raceHorse.horse}
            initialPosition={raceHorse.initialPosition}
            laneNumber={index + 1}
            onRegisterRef={registerHorseRef}
          />
        ))}
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
});

RaceTrack.displayName = "RaceTrack";

export default RaceTrack;
