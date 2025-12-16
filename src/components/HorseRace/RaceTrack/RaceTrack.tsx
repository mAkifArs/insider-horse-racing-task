import React, { memo } from "react";
import Typography from "../../Typography";
import {
  useGameStore,
  selectRaceExecution,
  selectResults,
} from "../../../store";
import { useRaceAnimation } from "../../../hooks/useRaceAnimation";
import { formatRoundLabel } from "../../../utils/formatters";
import { getEmptyMessage } from "./raceTrackUtils";
import RaceLane from "./RaceLane";
import styles from "./RaceTrack.module.scss";

/**
 * RaceTrack Component
 *
 * Renders the race track visualization.
 * Gets all data from store - no props needed.
 *
 * Features:
 * - 10 lanes with horse icons
 * - Finish line
 * - Race info display
 * - Empty state messages
 */
const RaceTrack: React.FC = memo(() => {
  // Store state
  const gameState = useGameStore((state) => state.gameState);
  const currentRace = useGameStore(selectRaceExecution).currentRace;
  const results = useGameStore(selectResults);

  // Animation hook - handles positions and race logic
  const { raceHorses } = useRaceAnimation();

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
            raceHorse={raceHorse}
            laneNumber={index + 1}
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
