import { Horse, Race, RaceStatus } from "../../../types";

/**
 * Data structure for displaying a horse in the program
 */
export interface ProgramHorseEntry {
  position: number;
  name: string;
  horseId: string;
}

/**
 * Get horses for a race by their IDs
 */
export const getHorsesForRace = (
  race: Race,
  horses: Horse[]
): ProgramHorseEntry[] => {
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
export const getStatusLabel = (
  isCompleted: boolean,
  isRunning: boolean,
  isNext: boolean
): string => {
  if (isCompleted) return "(Finished)";
  if (isRunning) return "(Running Now)";
  if (isNext) return "(Next Race)";
  return "(Pending)";
};

/**
 * Determine race display state
 */
export const getRaceState = (
  race: Race,
  index: number,
  currentRoundIndex: number
) => {
  const isCompleted = race.status === RaceStatus.COMPLETED;
  const isRunning = race.status === RaceStatus.RUNNING;
  const isNext = index === currentRoundIndex && !isRunning && !isCompleted;
  const isActive = isRunning || isNext;

  return { isCompleted, isRunning, isNext, isActive };
};
