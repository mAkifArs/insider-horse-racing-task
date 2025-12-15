import React, { memo, useCallback } from "react";
import styled from "styled-components";
import Typography from "../../Typography";
import { RaceTrackProps } from "./types";
import { useGameStore, selectRaceExecution } from "../../../store";
import { HorsePosition, RaceResultEntry, GameState } from "../../../types";
import { useAnimationFrame } from "../../../hooks/useAnimationFrame";
import { fontSize, fontWeight, colors, spacing } from "../../../theme";
import HorseSvg from "./HorseSvg";

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

/**
 * Format lap label for display
 */
const formatLapLabel = (roundNumber: number, distance: number): string => {
  return `${roundNumber}.st Lap ${distance}m`;
};

const RaceTrack: React.FC<RaceTrackProps> = memo(
  ({ currentRace, horses, horsePositions, isAnimating, distance }) => {
    const raceExecution = useGameStore(selectRaceExecution);
    const gameState = useGameStore((state) => state.gameState);
    const updateHorsePositions = useGameStore(
      (state) => state.updateHorsePositions
    );
    const completeCurrentRace = useGameStore(
      (state) => state.completeCurrentRace
    );

    /**
     * Animation callback - updates horse positions each frame
     */
    const animate = useCallback(
      (deltaTime: number) => {
        if (!isAnimating || !currentRace || gameState !== GameState.RACING) {
          return;
        }

        const now = Date.now();

        // Calculate new positions
        // Speed is calibrated so races take ~10-15 seconds
        const newPositions: HorsePosition[] = raceExecution.horsePositions.map(
          (hp) => {
            // If already finished, don't move
            if (hp.finishTime !== undefined) {
              return hp;
            }

            // Random speed variation + base speed from horse condition
            const speedVariation = 0.8 + Math.random() * 0.4;
            // Divide by 100 for ~5-7 second races
            const moveAmount = hp.speed * speedVariation * (deltaTime / 100);
            const newPosition = Math.min(hp.position + moveAmount, 100);

            // Track finish time when horse crosses finish line
            const justFinished = hp.position < 100 && newPosition >= 100;

            return {
              ...hp,
              position: newPosition,
              finishTime: justFinished ? now : hp.finishTime,
            };
          }
        );

        updateHorsePositions(newPositions);

        // Check if all horses have finished
        const allFinished = newPositions.every(
          (hp) => hp.finishTime !== undefined
        );

        if (allFinished) {
          // Calculate results based on finish time (earlier = better)
          const sortedPositions = [...newPositions].sort(
            (a, b) => (a.finishTime || 0) - (b.finishTime || 0)
          );

          const results: RaceResultEntry[] = sortedPositions.map(
            (hp, index) => {
              const horse = horses.find((h) => h.id === hp.horseId);
              return {
                horseId: hp.horseId,
                position: index + 1,
                time:
                  (hp.finishTime || now) -
                  (raceExecution.animationStartTime || 0),
                horse: horse!,
              };
            }
          );

          completeCurrentRace(results);
        }
      },
      [
        isAnimating,
        currentRace,
        gameState,
        raceExecution.horsePositions,
        raceExecution.animationStartTime,
        horses,
        updateHorsePositions,
        completeCurrentRace,
      ]
    );

    // Use animation frame hook
    useAnimationFrame(animate, isAnimating && gameState === GameState.RACING);

    // No race to display
    if (!currentRace) {
      return (
        <TrackContainer>
          <EmptyMessage>
            <Typography variant="body1" color="secondary">
              {gameState === GameState.SCHEDULE_READY
                ? 'Click "START" to begin racing'
                : gameState === GameState.COMPLETED
                ? "All races completed!"
                : "Generate a program to start racing"}
            </Typography>
          </EmptyMessage>
        </TrackContainer>
      );
    }

    // Get horses for current race
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
            const positionPercent = position?.position ?? 0;
            // Adjust position to account for finish line area (max 95%)
            const displayPosition = Math.min(positionPercent * 0.95, 95);

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
            {formatLapLabel(currentRace.roundNumber, distance)}
          </Typography>
        </RaceInfo>
      </TrackContainer>
    );
  }
);

RaceTrack.displayName = "RaceTrack";

export default RaceTrack;
