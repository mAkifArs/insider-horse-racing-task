import { Horse, Race } from "../../../types";

/**
 * Props for the RaceTrack component
 * Note: horsePositions are now handled internally by useRaceAnimation hook
 */
export interface RaceTrackProps {
  /** Current race being displayed (null when no race active) */
  currentRace: Race | null;
  /** All horses in the game (for looking up horse data) */
  horses: Horse[];
  /** Whether the race animation should be running */
  isAnimating: boolean;
}
