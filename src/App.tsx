import { useEffect, useCallback } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { HorseList, Program, RaceTrack, Results } from "./components/HorseRace";
import AppBar from "./components/AppBar";
import Button from "./components/Button";
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
import styles from "./App.module.scss";

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

  // Loading state for initial app load
  const isInitializing = gameState === GameState.IDLE;

  // Get current race data
  const currentRace = raceExecution.currentRace;

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
    // Show CONTINUE if there are already completed races (restored session)
    if (results.length > 0 && gameState === GameState.SCHEDULE_READY) {
      return "CONTINUE";
    }
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
      <div className={styles.appContainer}>
        <AppBar
          title="Horse Racing"
          actions={
            <div className={styles.buttonGroup}>
              <Button
                onClick={handleGenerateProgram}
                disabled={!canGenerateSchedule}
                loading={isInitializing}
              >
                {isMobile ? "PROGRAM" : "GENERATE PROGRAM"}
              </Button>
              <Button
                onClick={handleStartPause}
                disabled={isStartPauseDisabled}
                loading={isInitializing}
              >
                {getStartPauseLabel()}
              </Button>
              <Button
                onClick={handleResetGame}
                disabled={isRacing}
                loading={isInitializing}
              >
                {isMobile ? "RESET" : "RESET GAME"}
              </Button>
            </div>
          }
        />
        <main className={styles.mainContent}>
          <div className={styles.leftPanel}>
            <HorseList horses={horses} />
          </div>
          <div className={styles.centerPanel}>
            <RaceTrack
              currentRace={currentRace}
              horses={horses}
              isAnimating={raceExecution.isAnimating}
            />
          </div>
          <div className={styles.rightPanel}>
            <Program
              schedule={schedule}
              horses={horses}
              currentRoundIndex={currentRoundIndex}
            />
            <Results results={results} />
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
