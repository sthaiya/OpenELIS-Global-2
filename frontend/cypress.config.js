const { defineConfig } = require("cypress");

module.exports = defineConfig({
  defaultCommandTimeout: 8000,
  viewportWidth: 1200,
  viewportHeight: 700,
  video: false,
  watchForFileChanges: false,
  e2e: {
    setupNodeEvents(on, config) {
      // Listeners
      return config;
    },
    baseUrl: "https://localhost",
    testIsolation: false,
    env: {
      STARTUP_WAIT_MILLISECONDS: 300000,
    },
    specPattern: "cypress/e2e/**/*.cy.js", // Automatically includes all test specs
  },
});
