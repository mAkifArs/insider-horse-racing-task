import React, { memo, useMemo } from "react";
import styles from "./Program.module.scss";
import Panel from "../../Panel";
import DataTable, { Column } from "../../DataTable";
import Typography from "../../Typography";
import { Horse, Race, RaceStatus } from "../../../types";
import { ProgramProps } from "./types";
import { formatRoundLabel } from "../../../utils/formatters";

/**
 * Data structure for displaying a horse in the program
 */
interface ProgramHorseEntry {
  position: number;
  name: string;
  horseId: string;
}

/**
 * Get horses for a race by their IDs
 */
const getHorsesForRace = (race: Race, horses: Horse[]): ProgramHorseEntry[] => {
  return race.horseIds.map((horseId, index) => {
    const horse = horses.find((h) => h.id === horseId);
    return {
      position: index + 1,
      name: horse?.name ?? "Unknown",
      horseId,
    };
  });
};

/**
 * Get status label for user-friendly display
 */
const getStatusLabel = (
  isCompleted: boolean,
  isRunning: boolean,
  isNext: boolean
): string => {
  if (isCompleted) return "(Finished)";
  if (isRunning) return "(Running Now)";
  if (isNext) return "(Next Race)";
  return "(Pending)";
};

const Program: React.FC<ProgramProps> = memo(
  ({ schedule, horses, currentRoundIndex }) => {
    // Define columns for the program table
    const columns: Column<ProgramHorseEntry>[] = useMemo(
      () => [
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
      ],
      []
    );

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
        {schedule.map((race, index) => {
          const isCompleted = race.status === RaceStatus.COMPLETED;
          const isRunning = race.status === RaceStatus.RUNNING;
          const isNext =
            index === currentRoundIndex && !isRunning && !isCompleted;
          const isActive = isRunning || isNext;
          const raceHorses = getHorsesForRace(race, horses);
          const statusLabel = getStatusLabel(isCompleted, isRunning, isNext);

          const headerClasses = [
            styles.roundHeader,
            isActive ? styles.headerActive : "",
            isCompleted ? styles.headerCompleted : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div key={race.roundNumber} className={styles.roundSection}>
              <div className={headerClasses}>
                <Typography variant="caption" bold>
                  {formatRoundLabel(race.roundNumber, race.distance)}{" "}
                  {statusLabel}
                </Typography>
              </div>
              <DataTable
                columns={columns}
                data={raceHorses}
                keyExtractor={(entry) => entry.horseId}
              />
            </div>
          );
        })}
      </Panel>
    );
  }
);

Program.displayName = "Program";

export default Program;
