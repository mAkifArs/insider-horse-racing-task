import { Horse, HorsePosition, Race } from "../../../types";

export interface RaceTrackProps {
  currentRace: Race | null;
  horses: Horse[];
  horsePositions: HorsePosition[];
  isAnimating: boolean;
  distance: number;
}

export interface HorseLaneProps {
  horse: Horse;
  position: HorsePosition;
  laneNumber: number;
}
