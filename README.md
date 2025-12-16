# 🏇 Horse Racing Game

A high-performance, interactive horse racing simulation built with React 19 and TypeScript. Features smooth 60fps animations, real-time race execution, and a clean architecture designed for scalability.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)
![Tests](https://img.shields.io/badge/Tests-97%20passed-brightgreen)

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Features](#-features)
- [Game Rules](#-game-rules)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Performance Optimization](#-performance-optimization)
- [Testing](#-testing)
- [Available Scripts](#-available-scripts)
- [Development Guide](#-development-guide)

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
open http://localhost:5173
```

That's it! The game will load with 20 horses ready to race.

---

## ✨ Features

### Core Gameplay

| Feature                 | Description                                  |
| ----------------------- | -------------------------------------------- |
| **20 Unique Horses**    | Each with name, condition (1-100), and color |
| **6 Race Rounds**       | Distances: 1200m → 2200m                     |
| **10 Horses per Race**  | Randomly selected each round                 |
| **Real-time Animation** | Smooth 60fps horse movement                  |
| **Sequential Races**    | One race completes before the next begins    |

### Technical Features

| Feature                    | Description                              |
| -------------------------- | ---------------------------------------- |
| **State Persistence**      | Game saves to localStorage automatically |
| **Offline Support**        | Works without internet using cached data |
| **Error Boundaries**       | Graceful error handling with recovery    |
| **Performance Monitoring** | Built-in react-scan for dev mode         |

### UI Panels

- **Horse List** — View all 20 horses with stats
- **Race Track** — Animated race visualization with 10 lanes
- **Program** — Race schedule with horse assignments
- **Results** — Live results as races complete

---

## 🎮 Game Rules

### Horses

- **20 horses** generated at game start
- Each has a **condition score** (1-100) affecting speed
- Higher condition = faster base speed

### Races

| Round   | Distance | Duration (approx) |
| ------- | -------- | ----------------- |
| 1st Lap | 1200m    | ~4 seconds        |
| 2nd Lap | 1400m    | ~5 seconds        |
| 3rd Lap | 1600m    | ~5.5 seconds      |
| 4th Lap | 1800m    | ~6 seconds        |
| 5th Lap | 2000m    | ~7 seconds        |
| 6th Lap | 2200m    | ~7.5 seconds      |

### Race Mechanics

- **10 horses** randomly selected per race
- Speed = Base speed × Condition factor × Random variation (0.8-1.2)
- Longer races take proportionally more time
- First horse to 100% wins

---

## 🛠 Technology Stack

| Category             | Technology                   |
| -------------------- | ---------------------------- |
| **Framework**        | React 19                     |
| **Language**         | TypeScript 5.9               |
| **Build Tool**       | Vite 7.2                     |
| **State Management** | Zustand 5.0                  |
| **Styling**          | SCSS Modules                 |
| **Unit Testing**     | Jest + React Testing Library |
| **E2E Testing**      | Cypress 13                   |
| **Performance**      | react-scan                   |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── AppBar/              # App header with title
│   ├── Button/              # Reusable button component
│   ├── DataTable/           # Generic table component
│   ├── ErrorBoundary/       # Error handling wrapper
│   ├── GameControls/        # Start/Pause/Reset buttons
│   ├── Panel/               # Container component
│   ├── Typography/          # Text component
│   └── HorseRace/           # Feature components
│       ├── HorseList/       # Horse listing table
│       ├── Program/         # Race schedule display
│       ├── RaceTrack/       # Race visualization
│       └── Results/         # Race results display
│
├── hooks/
│   ├── useRefBasedRaceAnimation.ts  # ⚡ Optimized animation hook
│   ├── useAnimationFrame.ts         # RAF wrapper
│   ├── raceAnimationUtils.ts        # Race physics calculations
│   ├── useLocalStorage.ts           # Persistence hook
│   └── useOnlineStatus.ts           # Network detection
│
├── store/
│   ├── useGameStore.ts      # Main Zustand store
│   ├── selectors.ts         # State selectors
│   └── helpers/             # Store helper functions
│
├── types/
│   ├── horse.ts             # Horse & HorsePosition types
│   ├── race.ts              # Race & RaceResult types
│   └── game.ts              # GameState types
│
├── utils/
│   ├── horseGenerator.ts    # Horse name/color generation
│   ├── formatters.ts        # Display formatters
│   └── performance.ts       # RAF utilities
│
└── styles/
    └── _variables.scss      # Design tokens
```

---

## 🏛 Architecture

### State Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         GAME STATE MACHINE                          │
│                                                                     │
│   IDLE ──→ HORSES_READY ──→ SCHEDULE_READY ──→ RACING ⇄ PAUSED    │
│              │                      ↑              │                │
│              │                      │              ↓                │
│              │                      └────────── COMPLETED           │
│              │                                     │                │
│              └─────────────────────────────────────┘                │
│                          (RESET GAME)                               │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                       DATA SEPARATION                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Horse (static, 20 total)      HorsePosition (ephemeral, 10/race) │
│   ├── id                        ├── horseId (reference)            │
│   ├── name                      ├── position (0-100%)              │
│   ├── condition                 ├── lane (1-10)                    │
│   └── color                     ├── speed                          │
│                                 └── finishTime                     │
│                                                                     │
│   Lifecycle: Entire game        Lifecycle: ~5-10 seconds           │
│   Persisted: Yes (localStorage) Persisted: No                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Architecture

- **Container Components** — Connected to Zustand store
- **Presentational Components** — Pure, receive props only
- **Custom Hooks** — Reusable logic extraction
- **Error Boundaries** — Graceful error handling

---

## ⚡ Performance Optimization

### The Problem

Traditional React animation:

```
Animation Frame → Update State → React Re-render → DOM Update
                      ↓
            60 fps × 10 horses = 600 re-renders/race
```

### The Solution: Ref-Based Animation

```
Animation Frame → Calculate Position → Direct DOM Update (via refs)
                                              ↓
                              0 re-renders during animation!
```

### Implementation

We use `useRefBasedRaceAnimation` hook that:

1. **Stores positions in refs** (not state) during animation
2. **Updates DOM directly** via element refs
3. **Only updates store** when race completes

```typescript
// Old approach (600 re-renders per race)
updateHorsePositions(newPositions); // Triggers React re-render

// New approach (0 re-renders during animation)
element.style.left = `${position}%`; // Direct DOM manipulation
```

### Performance Monitoring

We include **react-scan** for development:

```typescript
// Enabled automatically in dev mode (src/main.tsx)
if (import.meta.env.DEV) {
  scan({ enabled: true, log: true });
}
```

**To verify:**

1. Run `npm run dev`
2. Open `http://localhost:5173`
3. Look for the react-scan toolbar
4. Start a race — components should NOT flash (no re-renders)

### Results

| Metric                | Before   | After            |
| --------------------- | -------- | ---------------- |
| Re-renders per race   | ~600     | ~2               |
| Animation smoothness  | Variable | Consistent 60fps |
| CPU usage during race | High     | Low              |

---

## 🧪 Testing

### Unit Tests (Jest)

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

**Coverage:**

- ✅ Race animation calculations
- ✅ Horse generation
- ✅ Schedule generation
- ✅ Formatters
- ✅ Store helpers

### E2E Tests (Cypress)

```bash
# Interactive mode (recommended)
npm run cypress:open

# Headless mode
npm run cypress:run
```

**Test Scenarios:**

- ✅ Initial load with 20 horses
- ✅ Program generation (6 races)
- ✅ Race execution (start/pause/resume)
- ✅ Results display
- ✅ Game reset
- ✅ State persistence

### Running Tests

```bash
# Full test suite
npm test && npm run cypress:run

# Quick verification
npm test
```

---

## 📜 Available Scripts

| Script                  | Description                 |
| ----------------------- | --------------------------- |
| `npm run dev`           | Start dev server (with HMR) |
| `npm run build`         | Build for production        |
| `npm run preview`       | Preview production build    |
| `npm test`              | Run unit tests              |
| `npm run test:watch`    | Run tests in watch mode     |
| `npm run test:coverage` | Generate coverage report    |
| `npm run cypress:open`  | Open Cypress interactive    |
| `npm run cypress:run`   | Run Cypress headless        |

---

## 💻 Development Guide

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# Clone repository
git clone <repository-url>
cd insider-one-case

# Install dependencies
npm install

# Start development
npm run dev
```

### Development Workflow

1. **Start dev server:** `npm run dev`
2. **Open browser:** `http://localhost:5173`
3. **Make changes:** Files hot-reload automatically
4. **Run tests:** `npm test` (in another terminal)
5. **Check performance:** Use react-scan toolbar in browser

### Code Quality

- TypeScript strict mode enabled
- ESLint for code linting
- Prettier for formatting
- Jest for unit testing
- Cypress for E2E testing

### Key Files to Know

| File                                    | Purpose                  |
| --------------------------------------- | ------------------------ |
| `src/store/useGameStore.ts`             | Central state management |
| `src/hooks/useRefBasedRaceAnimation.ts` | Animation engine         |
| `src/hooks/raceAnimationUtils.ts`       | Race physics             |
| `src/components/HorseRace/RaceTrack/`   | Race visualization       |

---

## 📊 Requirements Checklist

### Functional Requirements ✅

- [x] Generate 20 horses with unique properties
- [x] Create 6-race schedule with different distances
- [x] Select 10 random horses per race
- [x] Execute races sequentially
- [x] Animate horse movement
- [x] Display results after each race

### Technical Requirements ✅

- [x] React.js framework
- [x] TypeScript for type safety
- [x] Zustand for state management
- [x] Component-based architecture
- [x] Unit tests with Jest
- [x] E2E tests with Cypress
- [x] Error Boundaries
- [x] LocalStorage persistence
- [x] Offline support
- [x] Performance optimization

### UI Requirements ✅

- [x] Horse List table
- [x] Race Track visualization
- [x] Program panel
- [x] Results panel
- [x] Generate Program button
- [x] Start/Pause/Reset buttons

---

## 🛡️ Error Handling

### Error Boundaries

- Global error boundary at app level
- Section boundaries for major features
- User-friendly fallback UI
- Error logging for debugging

### LocalStorage

- Graceful handling of quota exceeded
- Validation of stored data
- Fallback to defaults if corrupted

### Offline Support

- Network status detection
- Visual offline indicator
- Cached data usage
- Auto-sync on reconnect

---

## 📝 Notes

- **Production-ready** code quality
- **Clean architecture** with separation of concerns
- **Scalable** component structure
- **Well-documented** with inline comments
- **Performance-optimized** animation system

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
