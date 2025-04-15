import LoginPage from "../../pages/LoginPage";
import ProgramEntryPage from "../../pages/ProgramEntryPage";

let loginPage = null;
let homePage = null;
let adminPage = null;
let programEntryPage = new ProgramEntryPage();

// Test data: programs and their associated tests
const programs = [
  { name: "Routine Testing", test: "Biochemistry" },
  {
    name: "People living with HIV Program - Initial Visit",
    test: "Hematology",
  },
  {
    name: "People living with HIV Program - Follow-up Visit",
    test: "Serology-Immunology",
  },
  { name: "Cytology", test: null }, // No test selection needed
  { name: "Immunohistochemistry", test: null }, // No test selection needed
  { name: "Histopathology", test: null }, // No test selection needed
];

// Navigate to the Program Entry page
const navigateToProgramEntry = () => {
  loginPage = new LoginPage();
  loginPage.visit();
  homePage = loginPage.goToHomePage();
  adminPage = homePage.goToAdminPageProgram();
  programEntryPage = adminPage.goToProgramEntry();
  programEntryPage.verifyPageLoads();
};
before(() => {
  navigateToProgramEntry();
});

afterEach(() => {
  cy.wait(5000);
  cy.reload();
});

describe("Selects various Programs", () => {
  programs.forEach((program) => {
    it(`Selects program: ${program.name}`, () => {
      programEntryPage.selectProgram(program.name);
      if (program.test) {
        programEntryPage.selectTest(program.test);
      }
      programEntryPage.submitProgram();
    });
  });
});
