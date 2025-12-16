import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { GameControls } from "./components/GameControls";
import { HorseList, Program, RaceTrack, Results } from "./components/HorseRace";
import {
  useGameStore,
  selectHorses,
  selectGameState,
  selectSchedule,
  selectCurrentRoundIndex,
  selectRaceExecution,
  selectResults,
} from "./store";
import { GameState } from "./types";
import styles from "./App.module.scss";

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function App() {
  // Store state for layout components
  const horses = useGameStore(selectHorses);
  const gameState = useGameStore(selectGameState);
  const schedule = useGameStore(selectSchedule);
  const currentRoundIndex = useGameStore(selectCurrentRoundIndex);
  const raceExecution = useGameStore(selectRaceExecution);
  const results = useGameStore(selectResults);

  // Store actions
  const initializeHorses = useGameStore((state) => state.initializeHorses);

  // Initialize horses on mount
  useEffect(() => {
    if (gameState === GameState.IDLE) {
      initializeHorses();
    }
  }, [gameState, initializeHorses]);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <ErrorBoundary>
      <div className={styles.appContainer}>
        <GameControls />
        <main className={styles.mainContent}>
          <div className={styles.leftPanel}>
            <HorseList horses={horses} />
          </div>
          <div className={styles.centerPanel}>
            <RaceTrack
              currentRace={raceExecution.currentRace}
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
