const { defineConfig } = require("cypress");

module.exports = defineConfig({
  defaultCommandTimeout: 8000,
  viewportWidth: 1200,
  viewportHeight: 700,
  video: false,
  watchForFileChanges: false,
  e2e: {
    setupNodeEvents(on, config) {
      // Listener for test failures - logs failed tests
      on("task", {
        logError(message) {
          console.error(message);
          return null;
        },
      });

      // Listener for test retries - logs retry attempts
      on("test:retry", (test) => {
        console.warn(`Retrying test: ${test.title}`);
      });

      // Listener for before run - useful for setup tasks
      on("before:run", (details) => {
        console.log("Starting test run...", details.totalTests, "tests");
      });

      // Listener for after run - useful for cleanup tasks
      on("after:run", (results) => {
        console.log(
          "Test run completed with:",
          results.totalFailed,
          "failed tests",
        );
      });

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
