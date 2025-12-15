# Horse Racing Game

An interactive horse racing simulation game built with React and TypeScript. This project demonstrates clean architecture, state management, and component-based design for a complex interactive application.

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Game Rules](#game-rules)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Development Approach](#development-approach)
- [Architecture](#architecture)
- [Testing](#testing)
- [Requirements](#requirements)

## 🎯 Overview

This is a horse racing simulation game where:
- 20 horses are available for racing
- Each horse has unique properties (name, condition score, color)
- 6 rounds of races are conducted with different distances
- Each round randomly selects 10 horses from the available 20
- Races are executed sequentially with animated horse movement
- Results are displayed as each race concludes

## 🛠 Technology Stack

- **React 19** - Modern UI framework with hooks
- **TypeScript 5** - Type-safe JavaScript for better code quality
- **Zustand** - Lightweight state management library
- **Styled-components** - CSS-in-JS for component styling
- **Vite** - Fast build tool and development server
- **Jest** - JavaScript testing framework
- **React Testing Library** - React component testing utilities
- **Cypress** - End-to-end testing framework
- **LocalStorage API** - Client-side data persistence
- **Service Worker** (optional) - Offline support and caching

## 📁 Project Structure

```
insider-one-case/
├── src/
│   ├── components/     # React components
│   │   ├── HorseList.tsx
│   │   ├── RaceTrack.tsx
│   │   ├── Program.tsx
│   │   ├── Results.tsx
│   │   └── ...
│   ├── store/          # Zustand state management
│   │   ├── horseStore.ts
│   │   ├── raceStore.ts
│   │   └── ...
│   ├── hooks/          # Custom React hooks
│   │   ├── useRace.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useOnlineStatus.ts
│   │   └── ...
│   ├── utils/          # Utility functions
│   │   ├── horseGenerator.ts
│   │   ├── raceLogic.ts
│   │   ├── localStorage.ts
│   │   ├── offline.ts
│   │   └── ...
│   ├── components/    # React components
│   │   ├── ErrorBoundary.tsx
│   │   └── ...
│   ├── types/          # TypeScript type definitions
│   │   ├── horse.ts
│   │   ├── race.ts
│   │   └── ...
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── cypress/            # E2E tests
├── .cursorrules        # Cursor AI rules for development
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
├── jest.config.js      # Jest configuration
└── cypress.config.ts   # Cypress configuration
```

## ✨ Features

### Core Functionality

1. **Horse Management**
   - Generate 20 horses with unique names
   - Each horse has a condition score (1-100)
   - Each horse is assigned a unique color

2. **Race Schedule Generation**
   - Create a schedule with 6 rounds
   - Each round randomly selects 10 horses from the 20 available
   - Rounds have different distances: 1200m, 1400m, 1600m, 1800m, 2000m, 2200m

3. **Race Execution**
   - Sequential race execution (one round at a time)
   - Animated horse movement during races
   - Real-time position updates
   - Race completion detection

4. **Results Display**
   - Results appear sequentially as each race concludes
   - Shows final positions for each round
   - Displays race statistics

5. **Data Persistence**
   - Game state automatically saved to localStorage
   - Horses, race schedule, and results persist across sessions
   - Graceful handling of localStorage errors

6. **Offline Support**
   - Works offline using cached data
   - Online/offline status indicator
   - Automatic data sync when connection is restored

7. **Error Handling**
   - React Error Boundaries catch and handle component errors
   - User-friendly error messages
   - Graceful degradation when features fail

### User Interface

- **Horse List Panel**: Table displaying all 20 horses with their properties
- **Race Track Visualization**: Visual representation of the race with lanes
- **Program Panel**: Shows scheduled races and participating horses
- **Results Panel**: Displays race outcomes as they complete
- **Control Buttons**: Generate Program and Start/Pause functionality

## 🎮 Game Rules

### Horse Specifications

- **Total Horses**: 20 horses available
- **Condition Score**: Random value between 1 and 100 for each horse
- **Color**: Each horse has a unique color representation
- **Name**: Each horse has a unique name

### Race Specifications

- **Total Rounds**: 6 rounds
- **Horses per Round**: 10 horses randomly selected from 20
- **Round Distances**:
  - Round 1: 1200 meters
  - Round 2: 1400 meters
  - Round 3: 1600 meters
  - Round 4: 1800 meters
  - Round 5: 2000 meters
  - Round 6: 2200 meters

### Race Execution

- Races run sequentially (one at a time)
- Horses move based on their condition scores and race logic
- Results are displayed immediately after each race completes
- Animation shows horse movement during the race

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd insider-one-case
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## 📜 Available Scripts

### Development

- `npm run dev` - Start Vite development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally

### Testing

- `npm test` - Run unit tests with Jest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run cypress:open` - Open Cypress test runner (interactive)
- `npm run cypress:run` - Run Cypress tests headlessly

## 🏗 Development Approach

### Priority: Business Logic First, UI Second

This project follows a **functionality-first** development approach:

1. **Phase 1: Core Logic**
   - Define TypeScript types and interfaces
   - Implement utility functions (horse generation, race logic)
   - Create Zustand stores with all business logic
   - Ensure data flow and state management work correctly

2. **Phase 2: Basic UI**
   - Create functional components with minimal styling
   - Connect components to state management
   - Verify all features work correctly
   - Test user interactions and data flow

3. **Phase 3: Polish**
   - Add styled-components for visual design
   - Implement animations for horse movement
   - Enhance UI/UX with proper styling
   - Optimize performance

### Why This Approach?

- Ensures core functionality works before investing in styling
- Makes debugging easier (separate logic from presentation)
- Allows for iterative testing of business logic
- Results in more maintainable codebase

## 🏛 Architecture

### State Management (Zustand)

The application uses Zustand for state management with separate stores:

- **Horse Store**: Manages horse list, generation, and properties
- **Race Store**: Handles race schedule, execution, and results
- **UI Store**: Controls UI state (loading, errors, etc.)

### Component Architecture

- **Container Components**: Connected to stores, handle business logic
- **Presentational Components**: Receive props, focus on rendering
- **Custom Hooks**: Extract reusable logic from components

### Data Flow

```
User Action → Component → Zustand Store → Business Logic → State Update → LocalStorage → UI Re-render
```

### Error Handling

- **Error Boundaries**: Wrap major sections to catch rendering errors
- **LocalStorage Errors**: Handle quota exceeded and disabled storage gracefully
- **Network Errors**: Detect offline status and use cached data

### Data Persistence

- **LocalStorage**: Automatically saves game state (horses, schedule, results)
- **Offline Mode**: Game functions using cached data when offline
- **Sync**: Data syncs when connection is restored

## 🧪 Testing

### Unit Tests

Unit tests cover:
- Utility functions (horse generation, race calculations)
- State management logic
- Component functionality
- Custom hooks

### E2E Tests

Cypress tests cover critical user flows:
- Generating horse list
- Creating race schedule
- Starting and pausing races
- Viewing race results
- Complete game flow

### Running Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run cypress:open
```

## 📝 Requirements

### Functional Requirements

1. ✅ Generate 20 horses with unique names, colors, and condition scores
2. ✅ Create race schedule with 6 rounds
3. ✅ Select 10 random horses per round from 20 available
4. ✅ Execute races sequentially (one round at a time)
5. ✅ Animate horse movement during races
6. ✅ Display results as each race concludes

### Technical Requirements

1. ✅ React.js framework
2. ✅ TypeScript for type safety
3. ✅ Zustand for state management
4. ✅ Component-based architecture
5. ✅ Styled-components for styling
6. ✅ Unit tests with Jest
7. ✅ E2E tests with Cypress
8. ✅ Error Boundaries for error handling
9. ✅ LocalStorage for data persistence
10. ✅ Offline support with online/offline detection

### UI Requirements

1. ✅ Horse List table (Name, Condition, Color)
2. ✅ Race Track visualization with lanes
3. ✅ Program panel showing scheduled races
4. ✅ Results panel showing race outcomes
5. ✅ Generate Program button
6. ✅ Start/Pause button

## 🛡️ Error Handling & Resilience

### Error Boundaries

The application implements React Error Boundaries to catch errors in the component tree:

- **Global Error Boundary**: Catches errors at the app level
- **Section Error Boundaries**: Protect major features (Horse List, Race Track, Results)
- **Fallback UI**: User-friendly error messages with recovery options
- **Error Logging**: Errors are logged for debugging (consider error reporting service in production)

### Local Storage

- **Automatic Persistence**: Game state (horses, race schedule, results) saved to localStorage
- **Error Handling**: Gracefully handles localStorage quota exceeded and disabled storage
- **Data Validation**: Validates stored data before loading
- **Migration Support**: Handles data structure changes between versions

### Offline Support

- **Online Detection**: Uses `navigator.onLine` and online/offline events
- **Offline Indicator**: Visual indicator when network is unavailable
- **Cached Data**: Game functions using localStorage cache when offline
- **Auto Sync**: Automatically syncs when connection is restored

## 📚 Additional Notes

- Code follows clean architecture principles
- Designed for scalability and maintainability
- Production-ready code quality
- Comprehensive error handling with Error Boundaries
- Data persistence with localStorage
- Offline support for better user experience
- Accessible UI components
- Performance optimizations

## 🤝 Contributing

This is an assessment project. For questions or clarifications, please refer to the project requirements document (`ingredients.md`).

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
