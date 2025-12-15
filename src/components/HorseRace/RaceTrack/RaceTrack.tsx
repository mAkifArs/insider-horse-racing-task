import React, { memo } from "react";
import styled from "styled-components";
import Typography from "../../Typography";
import { RaceTrackProps } from "./types";
import { useGameStore, selectResults } from "../../../store";
import { GameState } from "../../../types";
import { useRaceAnimation } from "../../../hooks/useRaceAnimation";
import { fontSize, fontWeight, colors, spacing } from "../../../theme";
import { formatRoundLabel } from "../../../utils/formatters";
import HorseSvg from "./HorseSvg";

// =============================================================================
// STYLED COMPONENTS
// =============================================================================

const TrackContainer = styled.div`
  border-radius: 4px;
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 400px;

  @media (max-width: 768px) {
    padding: 8px;
    min-height: 350px;
  }
`;

const LanesContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Lane = styled.div<{ $isEven: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
  border-bottom: 2px dashed rgba(0, 0, 0, 0.3);

  &:last-child {
    border-bottom: none;
  }
`;

const LaneNumber = styled.div`
  width: 30px;
  height: 30px;
  background-color: ${colors.track.laneNumber};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${fontWeight.bold};
  font-size: ${fontSize.sm};
  margin-right: ${spacing.sm};
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    font-size: ${fontSize.xs};
    margin-right: 6px;
  }
`;

const TrackArea = styled.div`
  flex: 1;
  position: relative;
  height: 100%;
`;

/**
 * Horse wrapper using .attrs() for performance
 * - Dynamic position is passed via inline style (no class regeneration)
 * - will-change hints browser about upcoming changes
 */
const HorseIconWrapper = styled.div.attrs<{ $position: number }>((props) => ({
  style: {
    left: `${props.$position}%`,
  },
}))<{ $position: number }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  will-change: left;
  filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.4));
`;

const FinishLine = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  background: repeating-linear-gradient(
    0deg,
    #fff,
    #fff 10px,
    #000 10px,
    #000 20px
  );
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 5px;
`;

const FinishText = styled.span`
  background-color: ${colors.track.finishLine};
  color: ${colors.neutral.white};
  padding: 2px 6px;
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.bold};
  border-radius: 2px;
`;

const RaceInfo = styled.div`
  text-align: center;
  padding: ${spacing.sm};
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 4px;
  margin-top: ${spacing.sm};
`;

const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
`;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the message to display when no race is active
 */
const getEmptyMessage = (
  gameState: GameState,
  resultsCount: number
): string => {
  if (gameState === GameState.SCHEDULE_READY) {
    return 'Click "START" to begin racing';
  }
  if (gameState === GameState.COMPLETED) {
    return "All races completed! 🏆";
  }
  // Between races - show next race message
  if (gameState === GameState.RACING && resultsCount > 0) {
    const nextRound = resultsCount + 1;
    return `Next race starting... (Round ${nextRound}/6)`;
  }
  return "Generate a program to start racing";
};

/**
 * Convert position percentage to display position (accounting for finish line area)
 */
const getDisplayPosition = (positionPercent: number): number => {
  return Math.min(positionPercent * 0.95, 95);
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * RaceTrack Component
 *
 * Pure presentation component that renders the race track visualization.
 * All animation logic is handled by the useRaceAnimation hook.
 *
 * Features:
 * - 10 lanes with lane numbers
 * - Animated horse icons
 * - Finish line
 * - Race info display
 * - Empty state messages
 */
const RaceTrack: React.FC<RaceTrackProps> = memo(
  ({ currentRace, horses, isAnimating }) => {
    // Get game state for empty message logic
    const gameState = useGameStore((state) => state.gameState);
    const results = useGameStore(selectResults);

    // Use race animation hook - handles all position calculations
    const { horsePositions } = useRaceAnimation({
      currentRace,
      horses,
      isAnimating,
    });

    // ─────────────────────────────────────────────────────────────────────────
    // EMPTY STATE
    // ─────────────────────────────────────────────────────────────────────────

    if (!currentRace) {
      return (
        <TrackContainer>
          <EmptyMessage>
            <Typography variant="body1" color="secondary">
              {getEmptyMessage(gameState, results.length)}
            </Typography>
          </EmptyMessage>
        </TrackContainer>
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // RACE VIEW
    // ─────────────────────────────────────────────────────────────────────────

    // Get horses participating in this race
    const raceHorses = currentRace.horseIds
      .map((id) => horses.find((h) => h.id === id))
      .filter((h): h is NonNullable<typeof h> => h !== undefined);

    return (
      <TrackContainer>
        <LanesContainer>
          {raceHorses.map((horse, index) => {
            const position = horsePositions.find(
              (hp) => hp.horseId === horse.id
            );
            const displayPosition = getDisplayPosition(position?.position ?? 0);

            return (
              <Lane key={horse.id} $isEven={index % 2 === 0}>
                <LaneNumber>{index + 1}</LaneNumber>
                <TrackArea>
                  <HorseIconWrapper $position={displayPosition}>
                    <HorseSvg color={horse.color} size={36} />
                  </HorseIconWrapper>
                </TrackArea>
              </Lane>
            );
          })}
          <FinishLine>
            <FinishText>FINISH</FinishText>
          </FinishLine>
        </LanesContainer>
        <RaceInfo>
          <Typography variant="body2" bold>
            {formatRoundLabel(currentRace.roundNumber, currentRace.distance)}
          </Typography>
        </RaceInfo>
      </TrackContainer>
    );
  }
);

RaceTrack.displayName = "RaceTrack";

export default RaceTrack;
