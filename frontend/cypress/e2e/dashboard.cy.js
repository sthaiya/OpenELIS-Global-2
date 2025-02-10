import LoginPage from "../pages/LoginPage";

let homePage = null;
let loginPage = null;
let dashboard = null;

before("Login to the Application", () => {
  loginPage = new LoginPage();
  loginPage.visit();
});

/**
 * Reusable function to place an order on any dashboard
 */
function placeOrder(dashboardName, testSelectionFn) {
  it(`User places a new order on ${dashboardName} Dashboard`, function () {
    homePage.goToOrderPage();
    dashboard.searchPatientByFName();
    dashboard.searchPatient();
    cy.wait(200);
    dashboard.checkPatientRadio();
    dashboard.clickNext();
    cy.wait(200);

    // Select test type (specific for each dashboard)
    testSelectionFn();
    
    dashboard.clickNext();
    cy.wait(200);
    dashboard.selectSampleType();
    dashboard.checkTestPanel();
    dashboard.clickNext();
    cy.wait(200);
    dashboard.generateLabNo();
    dashboard.selectSite();
    dashboard.selectRequesting();
    cy.wait(200);
    dashboard.submitButton();
    cy.wait(3000);
  });
}

/**
 * Reusable function to validate an order
 */
function validateOrder(dashboardName) {
  it(`Validate Success by Confirming Print Barcode button on ${dashboardName} Dashboard`, function () {
    dashboard.clickPrintBarCode();
    cy.wait(200);
  });
}

/**
 * Reusable function to change order status
 */
function changeOrderStatus(dashboardName, additionalActions = () => {}) {
  it(`Change The Status of Order on ${dashboardName} Dashboard`, function () {
    dashboard.selectFirstOrder();
    cy.wait(500);
    dashboard.selectStatus();
    dashboard.selectTechnician();
    dashboard.selectPathologist();
    additionalActions(); // Any extra actions (e.g., adding reports)
    dashboard.checkReadyForRelease();
    dashboard.saveOrder();
    cy.wait(500);
  });
}

/**
 * Reusable function to filter orders
 */
function filterOrders(dashboardName) {
  it(`Validate the Status of Order on ${dashboardName} Dashboard`, () => {
    dashboard = homePage[`goTo${dashboardName}Dashboard`]();
    dashboard.statusFilter();
  });
}

/**
 * Test Suite: Pathology Dashboard
 */
describe("Pathology Dashboard", function () {
  it("User Visits Pathology Dashboard", function () {
    homePage = loginPage.goToHomePage();
    dashboard = homePage.goToPathologyDashboard();
    cy.wait(500);
  });

  placeOrder("Pathology", () => dashboard.selectHistopathology());

  validateOrder("Pathology");

  it("User navigates back to pathology to confirm added order", () => {
    homePage.goToPathologyDashboard();
  });

  changeOrderStatus("Pathology");

  filterOrders("Pathology");
});

/**
 * Test Suite: ImmunoChemistry Dashboard
 */
describe("ImmunoChemistry Dashboard", function () {
  it("User Visits ImmunoChemistry Dashboard", function () {
    homePage = loginPage.goToHomePage();
    dashboard = homePage.goToImmunoChemistryDashboard();
    cy.wait(500);
  });

  placeOrder("ImmunoChemistry", () => dashboard.selectImmunoChem());

  validateOrder("ImmunoChemistry");

  it("User navigates back to ImmunoChem to confirm added order", () => {
    homePage.goToImmunoChemistryDashboard();
  });

  changeOrderStatus("ImmunoChemistry", () => {
    dashboard.addImmunoChemReport();
  });

  filterOrders("ImmunoChemistry");
});

/**
 * Test Suite: Cytology Dashboard
 */
describe("Cytology Dashboard", function () {
  it("User Visits Cytology Dashboard", function () {
    homePage = loginPage.goToHomePage();
    dashboard = homePage.goToCytologyDashboard();
    cy.wait(500);
  });

  placeOrder("Cytology", () => dashboard.selectCytology());

  validateOrder("Cytology");

  it("User navigates back to Cytology to confirm added order", () => {
    dashboard = homePage.goToCytologyDashboard();
  });

  changeOrderStatus("Cytology");

  filterOrders("Cytology");
});
