import React, { memo, useMemo } from "react";
import styled from "styled-components";
import Panel from "../../Panel";
import DataTable, { Column } from "../../DataTable";
import Typography from "../../Typography";
import { Horse, Race, RaceStatus } from "../../../types";
import { ProgramProps } from "./types";
import { spacing } from "../../../theme";

/**
 * Data structure for displaying a horse in the program
 */
interface ProgramHorseEntry {
  position: number;
  name: string;
  horseId: string;
}

const StyledPanel = styled(Panel)`
  min-width: 240px;
  max-width: 240px;
  height: 100%;

  @media (max-width: 1024px) {
    min-width: unset;
    max-width: unset;
    width: 100%;
    height: auto;
    max-height: 400px;
  }
`;

const RoundSection = styled.div`
  margin-bottom: ${spacing.sm};
`;

const RoundHeader = styled.div<{ $isActive: boolean; $isCompleted: boolean }>`
  background-color: ${(props) =>
    props.$isActive ? "#ffd700" : props.$isCompleted ? "#90EE90" : "#cd5c5c"};
  padding: ${spacing.xs} ${spacing.sm};
  text-align: center;
`;

const EmptyMessage = styled.div`
  padding: ${spacing.xl};
  text-align: center;
`;

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
 * Format lap label (e.g., "1ST Lap - 1200m")
 */
const formatLapLabel = (roundNumber: number, distance: number): string => {
  const suffix =
    roundNumber === 1
      ? "ST"
      : roundNumber === 2
      ? "ND"
      : roundNumber === 3
      ? "RD"
      : "TH";
  return `${roundNumber}${suffix} Lap - ${distance}m`;
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
        <StyledPanel title="Program" variant="primary">
          <EmptyMessage>
            <Typography variant="caption" color="secondary">
              Click "GENERATE PROGRAM" to create race schedule
            </Typography>
          </EmptyMessage>
        </StyledPanel>
      );
    }

    return (
      <StyledPanel title="Program" variant="primary">
        {schedule.map((race, index) => {
          const isCompleted = race.status === RaceStatus.COMPLETED;
          const isRunning = race.status === RaceStatus.RUNNING;
          const isNext =
            index === currentRoundIndex && !isRunning && !isCompleted;
          const isActive = isRunning || isNext;
          const raceHorses = getHorsesForRace(race, horses);
          const statusLabel = getStatusLabel(isCompleted, isRunning, isNext);

          return (
            <RoundSection key={race.roundNumber}>
              <RoundHeader $isActive={isActive} $isCompleted={isCompleted}>
                <Typography variant="caption" bold>
                  {formatLapLabel(race.roundNumber, race.distance)}{" "}
                  {statusLabel}
                </Typography>
              </RoundHeader>
              <DataTable
                columns={columns}
                data={raceHorses}
                keyExtractor={(entry) => entry.horseId}
              />
            </RoundSection>
          );
        })}
      </StyledPanel>
    );
  }
);

Program.displayName = "Program";

export default Program;
