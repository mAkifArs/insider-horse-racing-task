import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:5174",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    // Extended timeouts for React hydration
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 30000,
    // Retry failed tests
    retries: {
      runMode: 2,
      openMode: 0,
    },
  },
});
