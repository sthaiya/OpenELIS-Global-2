const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const e2eFolder = path.join(__dirname, "cypress/e2e");

      // Manually define the first N test files
      const prioritizedTests = [
        "cypress/e2e/login.cy.js",
        "cypress/e2e/home.cy.js",
        "cypress/e2e/patientEntry.cy.js",
        "cypress/e2e/orderEntity.cy.js", // First 4 tests in order
      ];

      // Function to get all test files excluding the prioritized ones
      const getRemainingTests = (dir, excludeList) => {
        return fs
          .readdirSync(dir)
          .filter(
            (file) =>
              file.endsWith(".cy.js") &&
              !excludeList.includes(path.join(dir, file)),
          )
          .sort((a, b) => a.localeCompare(b)) // Sort remaining tests alphabetically
          .map((file) => path.join("cypress/e2e", file));
      };

      // Get the remaining tests
      const remainingTests = getRemainingTests(e2eFolder, prioritizedTests);

      // Combine ordered and alphabetized lists
      config.specPattern = [...prioritizedTests, ...remainingTests];

      console.log("Running tests in custom order:", config.specPattern);

      return config;
    },
  },
});
