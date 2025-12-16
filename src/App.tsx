import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { GameControls } from "./components/GameControls";
import { HorseList, Program, RaceTrack, Results } from "./components/HorseRace";
import {
  useGameStore,
  selectHorses,
  selectGameState,
  selectResults,
} from "./store";
import { GameState } from "./types";
import styles from "./App.module.scss";

/**
 * App Component
 *
 * Main layout component. Child components manage their own store subscriptions.
 */
function App() {
  // Store state for components that still need props
  const horses = useGameStore(selectHorses);
  const gameState = useGameStore(selectGameState);
  const results = useGameStore(selectResults);

  // Store actions
  const initializeHorses = useGameStore((state) => state.initializeHorses);

  // Initialize horses on mount
  useEffect(() => {
    if (gameState === GameState.IDLE) {
      initializeHorses();
    }
  }, [gameState, initializeHorses]);

  return (
    <ErrorBoundary>
      <div className={styles.appContainer}>
        <GameControls />
        <main className={styles.mainContent}>
          <div className={styles.leftPanel}>
            <HorseList horses={horses} />
          </div>
          <div className={styles.centerPanel}>
            <RaceTrack />
          </div>
          <div className={styles.rightPanel}>
            <Program />
            <Results results={results} />
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
