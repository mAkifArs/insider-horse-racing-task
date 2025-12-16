import React, { memo } from "react";
import {
  useGameStore,
  selectSchedule,
  selectHorses,
  selectCurrentRoundIndex,
} from "../../../store";
import Panel from "../../Panel";
import Typography from "../../Typography";
import ProgramRound from "./ProgramRound";
import styles from "./Program.module.scss";

/**
 * Program Component
 *
 * Displays the race schedule with all 6 rounds.
 * Gets all data from store - no props needed.
 */
const Program: React.FC = memo(() => {
  // Store state
  const schedule = useGameStore(selectSchedule);
  const horses = useGameStore(selectHorses);
  const currentRoundIndex = useGameStore(selectCurrentRoundIndex);

  // Empty state
  if (!schedule || schedule.length === 0) {
    return (
      <Panel title="Program" variant="primary" className={styles.panel}>
        <div className={styles.emptyMessage}>
          <Typography variant="caption" color="secondary">
            Click "GENERATE PROGRAM" to create race schedule
          </Typography>
        </div>
      </Panel>
    );
  }

  return (
    <Panel title="Program" variant="primary" className={styles.panel}>
      {schedule.map((race, index) => (
        <ProgramRound
          key={race.roundNumber}
          race={race}
          horses={horses}
          index={index}
          currentRoundIndex={currentRoundIndex}
        />
      ))}
    </Panel>
  );
});

Program.displayName = "Program";

export default Program;
