//this script is used to detect unstable selectors in the cypress tests
//install: npm install glob acorn chalk
// Run: node detectUnstableSelectors.js
// Import required libraries
//created on Tuesday 2025-01-28
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const acorn = require("acorn");
const chalk = require("chalk");

// Define patterns for unstable selectors
const UNSTABLE_PATTERNS = [
  /\[.*=.*\]/, // Attribute selectors with dynamic values
  /:nth-child\(\d+\)/, // nth-child selectors
  /:contains\(.*\)/, // Contains selectors
  /\.\w+\d+/, // Classes with numbers (e.g., .class123)
  /#\w+\d+/, // IDs with numbers (e.g., #id123)
  /#[a-zA-Z0-9_-]*-\d+/g, // IDs with trailing numbers
  /\[class\*=.+\]/g, // Partial class matches
  /\[style=.+\]/g, // Inline styles
  /\.cds--.+/g, // Example: library-specific dynamic classes
];

// Check if a selector matches unstable patterns
function isSelectorUnstable(selector) {
  return UNSTABLE_PATTERNS.some((pattern) => pattern.test(selector));
}

// Analyze a file for unstable selectors
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const unstableSelectors = [];

  try {
    const ast = acorn.parse(content, {
      ecmaVersion: 2020,
      sourceType: "module",
    });
    walkAST(ast, (node) => {
      if (
        node.type === "CallExpression" &&
        node.callee.type === "MemberExpression" &&
        node.callee.object.name === "cy" &&
        (node.callee.property.name === "get" ||
          node.callee.property.name === "find")
      ) {
        const arg = node.arguments[0];
        if (arg && arg.type === "Literal" && typeof arg.value === "string") {
          const selector = arg.value;
          if (isSelectorUnstable(selector)) {
            unstableSelectors.push(selector);
          }
        }
      }
    });
  } catch (error) {
    console.error(
      chalk.red(`Error parsing file ${filePath}: ${error.message}`),
    );
  }

  return unstableSelectors;
}

// Helper function to walk through AST nodes
function walkAST(node, callback) {
  callback(node);
  for (const key in node) {
    const child = node[key];
    if (Array.isArray(child)) {
      child.forEach((n) => n && walkAST(n, callback));
    } else if (child && typeof child.type === "string") {
      walkAST(child, callback);
    }
  }
}

// Function to recursively analyze all test files in a directory
function analyzeTestDirectory(directory) {
  const files = glob.sync(`${directory}/**/*.js`);
  let totalIssues = 0;

  files.forEach((file) => {
    const issues = analyzeFile(file);
    if (issues.length > 0) {
      totalIssues += issues.length;
      console.log(chalk.yellow(`Unstable selectors in ${file}:`));
      issues.forEach((selector) => {
        console.log(chalk.red(`  - ${selector}`));
      });
    }
  });

  if (totalIssues === 0) {
    console.log(chalk.green("No unstable selectors detected!"));
  } else {
    console.log(chalk.red(`\nTotal issues found: ${totalIssues}`));
  }
}

// Main function to run the analysis
function main() {
  // Define multiple directories to analyze
  const testDirectories = [
    path.join(__dirname, "cypress", "e2e"), // Cypress e2e tests
    path.join(__dirname, "cypress", "pages"), // Cypress page objects
  ];

  // Analyze each directory
  testDirectories.forEach((directory) => {
    if (fs.existsSync(directory)) {
      console.log(`Analyzing directory: ${directory}`);
      analyzeTestDirectory(directory);
    } else {
      console.warn(chalk.red(`Directory not found: ${directory}`));
    }
  });
}

main();
