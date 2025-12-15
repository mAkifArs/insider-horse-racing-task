import { useEffect, useCallback } from "react";
import styled from "styled-components";
import ErrorBoundary from "./components/ErrorBoundary";
import { HorseList, Program, RaceTrack, Results } from "./components/HorseRace";
import AppBar from "./components/AppBar";
import Button from "./components/Button";
import { useIsMobile } from "./hooks/useIsMobile";
import { colors, spacing, breakpoints } from "./theme";
import {
  useGameStore,
  selectHorses,
  selectGameState,
  selectSchedule,
  selectCurrentRoundIndex,
  selectRaceExecution,
  selectResults,
  selectCanGenerateSchedule,
  selectCanStartRace,
  selectIsRacing,
  selectIsPaused,
} from "./store";
import { GameState } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// STYLED COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${colors.background.app};
  font-family: Arial, sans-serif;
`;

const MainContent = styled.main`
  display: flex;
  gap: ${spacing.lg};
  padding: ${spacing.lg};
  flex: 1;
  height: calc(100vh - 60px);

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    height: auto;
    padding: ${spacing.md};
  }

  @media (max-width: ${breakpoints.mobile}) {
    gap: ${spacing.md};
    padding: ${spacing.sm};
  }
`;

const LeftPanel = styled.div`
  flex-shrink: 0;
  height: 100%;

  @media (max-width: ${breakpoints.tablet}) {
    height: auto;
  }
`;

const CenterPanel = styled.div`
  flex: 1;
  height: 100%;
  min-width: 0;

  @media (max-width: ${breakpoints.tablet}) {
    height: auto;
    min-height: 300px;
  }
`;

const RightPanel = styled.div`
  display: flex;
  gap: ${spacing.lg};
  flex-shrink: 0;
  height: 100%;

  @media (max-width: ${breakpoints.tablet}) {
    height: auto;
    flex-direction: column;
  }

  @media (max-width: ${breakpoints.mobile}) {
    gap: ${spacing.md};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${spacing.sm};

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
    justify-content: center;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function App() {
  // Detect mobile viewport
  const isMobile = useIsMobile();

  // Zustand store state (using selectors for optimized re-renders)
  const horses = useGameStore(selectHorses);
  const gameState = useGameStore(selectGameState);
  const schedule = useGameStore(selectSchedule);
  const currentRoundIndex = useGameStore(selectCurrentRoundIndex);
  const raceExecution = useGameStore(selectRaceExecution);
  const results = useGameStore(selectResults);
  const canGenerateSchedule = useGameStore(selectCanGenerateSchedule);
  const canStartRace = useGameStore(selectCanStartRace);
  const isRacing = useGameStore(selectIsRacing);
  const isPaused = useGameStore(selectIsPaused);

  // Get current race data
  const currentRace = raceExecution.currentRace;
  const currentDistance = currentRace?.distance ?? 0;

  // Zustand store actions
  const initializeHorses = useGameStore((state) => state.initializeHorses);
  const generateSchedule = useGameStore((state) => state.generateSchedule);
  const startRacing = useGameStore((state) => state.startRacing);
  const pauseRacing = useGameStore((state) => state.pauseRacing);
  const resumeRacing = useGameStore((state) => state.resumeRacing);
  const resetGame = useGameStore((state) => state.resetGame);

  // Initialize horses on mount
  useEffect(() => {
    if (gameState === GameState.IDLE) {
      initializeHorses();
    }
  }, [gameState, initializeHorses]);

  // Handle Generate Program button
  const handleGenerateProgram = useCallback(() => {
    if (canGenerateSchedule) {
      generateSchedule();
    }
  }, [canGenerateSchedule, generateSchedule]);

  // Handle Start/Pause button
  const handleStartPause = useCallback(() => {
    if (canStartRace) {
      startRacing();
    } else if (isRacing) {
      pauseRacing();
    } else if (isPaused) {
      resumeRacing();
    }
  }, [canStartRace, isRacing, isPaused, startRacing, pauseRacing, resumeRacing]);

  // Handle Reset Game button
  const handleResetGame = useCallback(() => {
    resetGame();
  }, [resetGame]);

  // Determine button labels and states
  const getStartPauseLabel = () => {
    if (isPaused) return "RESUME";
    if (isRacing) return "PAUSE";
    return "START";
  };

  const isStartPauseDisabled =
    gameState === GameState.IDLE ||
    gameState === GameState.HORSES_READY ||
    gameState === GameState.COMPLETED;

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <ErrorBoundary>
      <AppContainer>
        <AppBar
          title="Horse Racing"
          actions={
            <ButtonGroup>
              <Button
                onClick={handleGenerateProgram}
                disabled={!canGenerateSchedule}
              >
                {isMobile ? "PROGRAM" : "GENERATE PROGRAM"}
              </Button>
              <Button
                onClick={handleStartPause}
                disabled={isStartPauseDisabled}
              >
                {getStartPauseLabel()}
              </Button>
              <Button onClick={handleResetGame} disabled={isRacing}>
                {isMobile ? "RESET" : "RESET GAME"}
              </Button>
            </ButtonGroup>
          }
        />
        <MainContent>
          <LeftPanel>
            <HorseList horses={horses} />
          </LeftPanel>
          <CenterPanel>
            <RaceTrack
              currentRace={currentRace}
              horses={horses}
              horsePositions={raceExecution.horsePositions}
              isAnimating={raceExecution.isAnimating}
              distance={currentDistance}
            />
          </CenterPanel>
          <RightPanel>
            <Program
              schedule={schedule}
              horses={horses}
              currentRoundIndex={currentRoundIndex}
            />
            <Results results={results} />
          </RightPanel>
        </MainContent>
      </AppContainer>
    </ErrorBoundary>
  );
}

export default App;
