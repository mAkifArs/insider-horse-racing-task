import React, { memo, useEffect, useRef } from "react";
import { Horse } from "../../../types";
import { getDisplayPosition } from "./raceTrackUtils";
import HorseSvg from "./HorseSvg";
import styles from "./RaceTrack.module.scss";

interface RaceLaneProps {
  horse: Horse;
  initialPosition: number;
  laneNumber: number;
  /** Callback to register the horse element ref for direct DOM updates */
  onRegisterRef: (horseId: string, element: HTMLDivElement | null) => void;
}

/**
 * RaceLane Component
 *
 * Renders a single lane with horse icon.
 * Uses ref-based animation for performance - position is updated directly via DOM.
 */
const RaceLane: React.FC<RaceLaneProps> = memo(
  ({ horse, initialPosition, laneNumber, onRegisterRef }) => {
    const horseWrapperRef = useRef<HTMLDivElement>(null);

    // Register ref on mount, unregister on unmount
    useEffect(() => {
      onRegisterRef(horse.id, horseWrapperRef.current);
      return () => {
        onRegisterRef(horse.id, null);
      };
    }, [horse.id, onRegisterRef]);

    const displayPosition = getDisplayPosition(initialPosition);

    return (
      <div className={styles.lane}>
        <div className={styles.laneNumber}>{laneNumber}</div>
        <div className={styles.trackArea}>
          <div
            ref={horseWrapperRef}
            className={styles.horseIconWrapper}
            style={{ left: `${displayPosition}%` }}
          >
            <HorseSvg color={horse.color} size={36} />
          </div>
        </div>
      </div>
    );
  }
);

RaceLane.displayName = "RaceLane";

export default RaceLane;

