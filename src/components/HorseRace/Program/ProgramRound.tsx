import React, { memo, useMemo } from "react";
import { Race, Horse } from "../../../types";
import { formatRoundLabel } from "../../../utils/formatters";
import {
  getHorsesForRace,
  getStatusLabel,
  getRaceState,
  ProgramHorseEntry,
} from "./programUtils";
import DataTable, { Column } from "../../DataTable";
import Typography from "../../Typography";
import styles from "./Program.module.scss";

interface ProgramRoundProps {
  race: Race;
  horses: Horse[];
  index: number;
  currentRoundIndex: number;
}

/**
 * Table columns for program display
 */
const columns: Column<ProgramHorseEntry>[] = [
  {
    key: "position",
    header: "Position",
    align: "center" as const,
    width: "60px",
    render: (entry) => entry.position,
  },
  {
    key: "name",
    header: "Name",
    render: (entry) => entry.name,
  },
];

/**
 * ProgramRound Component
 *
 * Displays a single race round with its horses.
 */
const ProgramRound: React.FC<ProgramRoundProps> = memo(
  ({ race, horses, index, currentRoundIndex }) => {
    const { isCompleted, isRunning, isNext, isActive } = getRaceState(
      race,
      index,
      currentRoundIndex
    );

    const raceHorses = useMemo(
      () => getHorsesForRace(race, horses),
      [race, horses]
    );

    const statusLabel = getStatusLabel(isCompleted, isRunning, isNext);

    const headerClasses = [
      styles.roundHeader,
      isActive ? styles.headerActive : "",
      isCompleted ? styles.headerCompleted : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={styles.roundSection}>
        <div className={headerClasses}>
          <Typography variant="caption" bold>
            {formatRoundLabel(race.roundNumber, race.distance)} {statusLabel}
          </Typography>
        </div>
        <DataTable
          columns={columns}
          data={raceHorses}
          keyExtractor={(entry) => entry.horseId}
        />
      </div>
    );
  }
);

ProgramRound.displayName = "ProgramRound";

export default ProgramRound;
