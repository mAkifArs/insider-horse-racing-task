import { useEffect, useCallback } from "react";
import styled from "styled-components";
import ErrorBoundary from "./components/ErrorBoundary";
import { HorseList, Program, RaceTrack, Results } from "./components/HorseRace";
import { useIsMobile } from "./hooks/useIsMobile";
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

// Breakpoints
const MOBILE_BREAKPOINT = "768px";
const TABLET_BREAKPOINT = "1024px";

const AppContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
  background-color: #c0c0c0;
  font-family: Arial, sans-serif;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 12px;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  color: #333;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    text-align: center;
    font-size: 20px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    justify-content: center;
    gap: 8px;
  }
`;

const Button = styled.button<{ $disabled?: boolean }>`
  padding: 8px 16px;
  font-size: 12px;
  font-weight: bold;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  border: 1px solid #666;
  background-color: ${(props) => (props.$disabled ? "#ccc" : "#e0e0e0")};
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};
  white-space: nowrap;

  &:hover {
    background-color: ${(props) => (props.$disabled ? "#ccc" : "#d0d0d0")};
  }

  &:active {
    background-color: ${(props) => (props.$disabled ? "#ccc" : "#c0c0c0")};
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 12px 16px;
    font-size: 14px;
    flex: 1;
    min-width: 100px;
  }
`;

const MainContent = styled.main`
  display: flex;
  gap: 16px;
  height: calc(100vh - 100px);

  @media (max-width: ${TABLET_BREAKPOINT}) {
    flex-direction: column;
    height: auto;
    min-height: calc(100vh - 140px);
  }
`;

const LeftPanel = styled.div`
  flex-shrink: 0;
  height: 100%;

  @media (max-width: ${TABLET_BREAKPOINT}) {
    height: auto;
  }
`;

const RightPanel = styled.div`
  display: flex;
  gap: 16px;
  flex-shrink: 0;
  height: 100%;

  @media (max-width: ${TABLET_BREAKPOINT}) {
    height: auto;
    flex-direction: column;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    gap: 12px;
  }
`;

const CenterPanel = styled.div`
  flex: 1;
  height: 100%;
  min-width: 0;

  @media (max-width: ${TABLET_BREAKPOINT}) {
    height: auto;
    min-height: 200px;
  }
`;

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
  }, [
    canStartRace,
    isRacing,
    isPaused,
    startRacing,
    pauseRacing,
    resumeRacing,
  ]);

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

  return (
    <ErrorBoundary>
      <AppContainer>
        <Header>
          <Title>Horse Racing</Title>
          <ButtonGroup>
            <Button
              onClick={handleGenerateProgram}
              $disabled={!canGenerateSchedule}
            >
              {isMobile ? "PROGRAM" : "GENERATE PROGRAM"}
            </Button>
            <Button onClick={handleStartPause} $disabled={isStartPauseDisabled}>
              {getStartPauseLabel()}
            </Button>
            <Button onClick={handleResetGame} $disabled={isRacing}>
              {isMobile ? "RESET" : "RESET GAME"}
            </Button>
          </ButtonGroup>
        </Header>
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
