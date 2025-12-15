/// <reference types="cypress" />

// ***********************************************
// Custom Commands for Horse Racing Game E2E Tests
// ***********************************************

/**
 * Visit the app and wait for it to load
 */
Cypress.Commands.add("visitFresh", () => {
  // Visit the app
  cy.visit("/", { timeout: 30000 });

  // Wait for horses table to be present (indicates React mounted and data loaded)
  cy.get("table tbody tr", { timeout: 20000 }).should("have.length", 20);

  // Click Reset if we have previous state (game completed or in progress)
  cy.get("body").then(($body) => {
    if ($body.text().includes("All races completed")) {
      cy.contains("button", /RESET GAME|RESET/).click();
      cy.get("table tbody tr", { timeout: 20000 }).should("have.length", 20);
    }
  });
});

/**
 * Wait for horses to load (20 horses in the list)
 */
Cypress.Commands.add("waitForHorsesToLoad", () => {
  cy.get("table tbody tr", { timeout: 10000 }).should("have.length", 20);
});

/**
 * Generate a new race program
 */
Cypress.Commands.add("generateProgram", () => {
  cy.contains("button", /GENERATE PROGRAM|PROGRAM/).click();
});

/**
 * Start the race
 */
Cypress.Commands.add("startRace", () => {
  cy.contains("button", "START").click();
});

/**
 * Pause the race
 */
Cypress.Commands.add("pauseRace", () => {
  cy.contains("button", "PAUSE").click();
});

/**
 * Resume the race
 */
Cypress.Commands.add("resumeRace", () => {
  cy.contains("button", "RESUME").click();
});

/**
 * Reset the game
 */
Cypress.Commands.add("resetGame", () => {
  cy.contains("button", /RESET GAME|RESET/).click();
});

/**
 * Wait for a specific race round to complete
 */
Cypress.Commands.add("waitForRaceComplete", (roundNumber: number) => {
  // Wait for the race to show "(Finished)" status in the Program section
  const suffix = getSuffix(roundNumber);
  // The full text is like "1ST Lap - 1200m (Finished)"
  cy.contains(`${roundNumber}${suffix} Lap`, { timeout: 60000 })
    .invoke("text")
    .should("include", "Finished");
});

/**
 * Wait for all races to complete
 */
Cypress.Commands.add("waitForAllRacesComplete", () => {
  // All 6 races take time - use generous timeout (2 minutes)
  cy.contains("All races completed!", { timeout: 120000 }).should("be.visible");
});

// Helper function for ordinal suffixes
function getSuffix(n: number): string {
  if (n === 1) return "ST";
  if (n === 2) return "ND";
  if (n === 3) return "RD";
  return "TH";
}

// Type declarations for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      visitFresh(): Chainable<void>;
      waitForHorsesToLoad(): Chainable<void>;
      generateProgram(): Chainable<void>;
      startRace(): Chainable<void>;
      pauseRace(): Chainable<void>;
      resumeRace(): Chainable<void>;
      resetGame(): Chainable<void>;
      waitForRaceComplete(roundNumber: number): Chainable<void>;
      waitForAllRacesComplete(): Chainable<void>;
    }
  }
}

export {};
