import React, { memo, useCallback } from "react";
import AppBar from "../AppBar";
import Button from "../Button";
import { useIsMobile } from "../../hooks/useIsMobile";
import {
  useGameStore,
  selectGameState,
  selectResults,
  selectCanGenerateSchedule,
} from "../../store";
import { GameState } from "../../types";
import styles from "./GameControls.module.scss";

/**
 * GameControls Component
 *
 * Encapsulates the game header bar with all control buttons.
 * Manages its own store subscriptions and handlers.
 *
 * Buttons:
 * - Generate Program: Creates new race schedule
 * - Start/Pause/Resume: Controls race execution
 * - Reset: Clears game state
 */
const GameControls: React.FC = memo(() => {
  const isMobile = useIsMobile();

  // Store state
  const gameState = useGameStore(selectGameState);
  const results = useGameStore(selectResults);
  const canGenerateSchedule = useGameStore(selectCanGenerateSchedule);

  // Derived state from gameState enum
  const isInitializing = gameState === GameState.IDLE;
  const isRacing = gameState === GameState.RACING;
  const isPaused = gameState === GameState.PAUSED;
  const canStartRace = gameState === GameState.SCHEDULE_READY;

  // Store actions
  const generateSchedule = useGameStore((state) => state.generateSchedule);
  const startRacing = useGameStore((state) => state.startRacing);
  const pauseRacing = useGameStore((state) => state.pauseRacing);
  const resumeRacing = useGameStore((state) => state.resumeRacing);
  const resetGame = useGameStore((state) => state.resetGame);

  // ─────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────

  const handleGenerateProgram = useCallback(() => {
    if (canGenerateSchedule) {
      generateSchedule();
    }
  }, [canGenerateSchedule, generateSchedule]);

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

  const handleResetGame = useCallback(() => {
    resetGame();
  }, [resetGame]);

  // ─────────────────────────────────────────────────────────────────────────
  // BUTTON STATES
  // ─────────────────────────────────────────────────────────────────────────

  const getStartPauseLabel = (): string => {
    if (isPaused) return "RESUME";
    if (isRacing) return "PAUSE";
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
  );
});

GameControls.displayName = "GameControls";

export default GameControls;
