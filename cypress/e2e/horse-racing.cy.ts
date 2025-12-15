/// <reference types="cypress" />

/**
 * Horse Racing Game - E2E Tests
 *
 * Tests the complete user flow of the horse racing application:
 * 1. Initial load and horse list display
 * 2. Program generation
 * 3. Race execution (start, pause, resume)
 * 4. Results display
 * 5. Game reset
 */

describe("Horse Racing Game", () => {
  beforeEach(() => {
    // Start fresh each test
    cy.visitFresh();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // INITIAL LOAD TESTS
  // ─────────────────────────────────────────────────────────────────────────────

  describe("Initial Load", () => {
    it("displays the app header with title", () => {
      cy.contains("h1", "Horse Racing").should("be.visible");
    });

    it("loads 20 horses on startup", () => {
      cy.waitForHorsesToLoad();
      cy.contains("Horse List (1-20)").should("be.visible");
    });

    it("displays horse list with name, condition, and color columns", () => {
      cy.waitForHorsesToLoad();
      cy.get("table thead").within(() => {
        cy.contains("Name").should("be.visible");
        cy.contains("Condition").should("be.visible");
        cy.contains("Color").should("be.visible");
      });
    });

    it("shows each horse has a condition between 1-100", () => {
      cy.waitForHorsesToLoad();
      cy.get("table tbody tr").each(($row) => {
        cy.wrap($row)
          .find("td")
          .eq(1)
          .invoke("text")
          .then((text) => {
            const condition = parseInt(text, 10);
            expect(condition).to.be.at.least(1);
            expect(condition).to.be.at.most(100);
          });
      });
    });

    it("has GENERATE PROGRAM button enabled initially", () => {
      cy.waitForHorsesToLoad();
      cy.contains("button", /GENERATE PROGRAM|PROGRAM/).should("not.be.disabled");
    });

    it("has START button disabled initially", () => {
      cy.waitForHorsesToLoad();
      cy.contains("button", "START").should("be.disabled");
    });

    it("shows empty race track message", () => {
      cy.waitForHorsesToLoad();
      cy.contains("Generate a program to start racing").should("be.visible");
    });

    it("shows empty results message", () => {
      cy.waitForHorsesToLoad();
      cy.contains("No races completed yet").should("be.visible");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // PROGRAM GENERATION TESTS
  // ─────────────────────────────────────────────────────────────────────────────

  describe("Program Generation", () => {
    beforeEach(() => {
      cy.waitForHorsesToLoad();
    });

    it("generates a schedule with 6 races", () => {
      cy.generateProgram();

      // Check all 6 laps are displayed (use exist since some may be scrolled)
      cy.contains("1ST Lap - 1200m").should("exist");
      cy.contains("2ND Lap - 1400m").should("exist");
      cy.contains("3RD Lap - 1600m").should("exist");
      cy.contains("4TH Lap - 1800m").should("exist");
      cy.contains("5TH Lap - 2000m").should("exist");
      cy.contains("6TH Lap - 2200m").should("exist");
    });

    it("each race shows horses in program", () => {
      cy.generateProgram();

      // Just verify there are race entries with positions
      cy.contains("1ST Lap - 1200m")
        .parent()
        .parent()
        .within(() => {
          cy.get("table tbody tr").should("have.length.at.least", 1);
        });
    });

    it("enables START button after program generation", () => {
      cy.generateProgram();
      cy.contains("button", "START").should("not.be.disabled");
    });

    it("disables GENERATE PROGRAM button after generation", () => {
      cy.generateProgram();
      cy.contains("button", /GENERATE PROGRAM|PROGRAM/).should("be.disabled");
    });

    it('shows "Next Race" indicator on first race', () => {
      cy.generateProgram();
      cy.contains("Next Race").should("exist");
    });

    it("updates race track message after generation", () => {
      cy.generateProgram();
      cy.contains('Click "START" to begin racing').should("be.visible");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // RACE EXECUTION TESTS
  // ─────────────────────────────────────────────────────────────────────────────

  describe("Race Execution", () => {
    beforeEach(() => {
      cy.waitForHorsesToLoad();
      cy.generateProgram();
    });

    it("starts racing when START is clicked", () => {
      cy.startRace();

      // Button should change to PAUSE
      cy.contains("button", "PAUSE").should("be.visible");

      // Race track should show the current lap info
      cy.contains("1ST Lap - 1200m").should("exist");
    });

    it("displays PAUSE button while racing", () => {
      cy.startRace();
      cy.contains("button", "PAUSE").should("be.visible").and("not.be.disabled");
    });

    it("disables RESET button while racing", () => {
      cy.startRace();
      cy.contains("button", /RESET GAME|RESET/).should("be.disabled");
    });

    it('shows "Running Now" on current race', () => {
      cy.startRace();
      cy.contains("Running Now").should("exist");
    });

    it("pauses the race when PAUSE is clicked", () => {
      cy.startRace();
      cy.pauseRace();

      // Button should change to RESUME
      cy.contains("button", "RESUME").should("be.visible");
    });

    it("resumes the race when RESUME is clicked", () => {
      cy.startRace();
      cy.pauseRace();
      cy.resumeRace();

      // Button should change back to PAUSE
      cy.contains("button", "PAUSE").should("be.visible");
    });

    it("completes first race and shows in program as finished", () => {
      cy.startRace();

      // Wait for first race to complete (shows "Finished" status)
      cy.waitForRaceComplete(1);

      // Program should show first race as finished
      cy.contains("1ST Lap - 1200m (Finished)").should("exist");
    });

    it("automatically starts next race after completion", () => {
      cy.startRace();

      // Wait for first race to complete
      cy.waitForRaceComplete(1);

      // Should see second race or transition message
      cy.contains(/2ND Lap|Running Now/).should("exist");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // FULL RACE FLOW TEST
  // ─────────────────────────────────────────────────────────────────────────────

  describe("Complete Race Flow", () => {
    it("runs all 6 races to completion", () => {
      cy.waitForHorsesToLoad();
      cy.generateProgram();
      cy.startRace();

      // Wait for all races to complete (generous timeout)
      cy.waitForAllRacesComplete();

      // Verify completion message
      cy.contains("All races completed! 🏆").should("be.visible");

      // Verify we can see Results panel header
      cy.contains("Results").should("exist");

      // GENERATE PROGRAM should be enabled again
      cy.contains("button", /GENERATE PROGRAM|PROGRAM/).should("not.be.disabled");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // GAME RESET TESTS
  // ─────────────────────────────────────────────────────────────────────────────

  describe("Game Reset", () => {
    it("resets game after program generation", () => {
      cy.waitForHorsesToLoad();
      cy.generateProgram();
      cy.resetGame();

      // Wait for horses to reload
      cy.waitForHorsesToLoad();

      // Should show initial message again
      cy.contains("Generate a program to start racing").should("be.visible");

      // Results should be empty
      cy.contains("No races completed yet").should("be.visible");
    });

    it("resets game after races complete", () => {
      cy.waitForHorsesToLoad();
      cy.generateProgram();
      cy.startRace();

      // Wait for at least one race to complete
      cy.waitForRaceComplete(1);

      // Pause to enable reset
      cy.pauseRace();
      cy.resetGame();

      // Horse list should reload
      cy.waitForHorsesToLoad();

      // Should show initial state
      cy.contains("Generate a program to start racing").should("be.visible");
    });

    it("maintains 20 horses after reset", () => {
      cy.waitForHorsesToLoad();

      // Reset and verify 20 horses still exist
      cy.resetGame();
      cy.waitForHorsesToLoad();

      // Should still have 20 horses
      cy.get("table tbody tr").should("have.length", 20);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // PERSISTENCE TESTS
  // ─────────────────────────────────────────────────────────────────────────────

  describe("State Persistence", () => {
    it("persists horse list after page reload", () => {
      cy.waitForHorsesToLoad();

      // Get a horse name
      let horseName: string;
      cy.get("table tbody tr")
        .first()
        .find("td")
        .first()
        .invoke("text")
        .then((text) => {
          horseName = text;
        });

      // Reload page
      cy.reload();

      // Same horse should still be first
      cy.waitForHorsesToLoad();
      cy.get("table tbody tr")
        .first()
        .find("td")
        .first()
        .invoke("text")
        .then((text) => {
          expect(text).to.equal(horseName);
        });
    });

    it("persists schedule after page reload", () => {
      cy.waitForHorsesToLoad();
      cy.generateProgram();

      // Reload page
      cy.reload();

      // Schedule should still be visible
      cy.contains("1ST Lap - 1200m").should("exist");
      cy.contains("button", "START").should("not.be.disabled");
    });

    it("persists race state after page reload", () => {
      cy.waitForHorsesToLoad();
      cy.generateProgram();
      cy.startRace();

      // Wait for first race to complete
      cy.waitForRaceComplete(1);

      // Pause and reload
      cy.pauseRace();
      cy.reload();

      // Should see finished race indicator
      cy.contains("1ST Lap - 1200m (Finished)").should("exist");
    });
  });
});
