import React, { memo } from "react";
import { RaceHorseState } from "../../../types";
import { getDisplayPosition } from "./raceTrackUtils";
import HorseSvg from "./HorseSvg";
import styles from "./RaceTrack.module.scss";

interface RaceLaneProps {
  raceHorse: RaceHorseState;
  laneNumber: number;
}

/**
 * RaceLane Component
 *
 * Renders a single lane with horse icon.
 * Position is calculated from race progress.
 */
const RaceLane: React.FC<RaceLaneProps> = memo(({ raceHorse, laneNumber }) => {
  const displayPosition = getDisplayPosition(raceHorse.position);

  return (
    <div className={styles.lane}>
      <div className={styles.laneNumber}>{laneNumber}</div>
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
});

RaceLane.displayName = "RaceLane";

export default RaceLane;

