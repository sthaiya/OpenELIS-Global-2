import LoginPage from "../pages/LoginPage";

let homePage = null;
let loginPage = null;
let dashboard = null;

before("login", () => {
  loginPage = new LoginPage();
  loginPage.visit();
});

const navigateToDashboard = (dashboardName) => {
  homePage = loginPage.goToHomePage();
  switch (dashboardName) {
    case "Pathology":
      dashboard = homePage.goToPathologyDashboard();
      break;
    case "ImmunoChemistry":
      dashboard = homePage.goToImmunoChemistryDashboard();
      break;
    case "Cytology":
      dashboard = homePage.goToCytologyDashboard();
      break;
  }
  cy.wait(500);
};

const addOrder = (orderType) => {
  homePage.goToOrderPage();
  dashboard.searchPatientByFName();
  dashboard.searchPatient();
  cy.wait(200);
  dashboard.checkPatientRadio();
  dashboard.clickNext();
  cy.wait(200);
  switch (orderType) {
    case "Pathology":
      dashboard.selectHistopathology();
      dashboard.clickNext();
      cy.wait(200);
      dashboard.selectPathologySample();
      dashboard.checkPathologyPanel();
      break;
    case "ImmunoChemistry":
      dashboard.selectImmunoChem();
      dashboard.clickNext();
      cy.wait(200);
      dashboard.selectImmunoChemSample();
      dashboard.checkImmunoChemTest();
      break;
    case "Cytology":
      dashboard.selectCytology();
      dashboard.clickNext();
      cy.wait(200);
      dashboard.selectFluidSample();
      dashboard.checkCovidPanel();
      break;
  }
  dashboard.clickNext();
  cy.wait(200);
  dashboard.generateLabNo();
  dashboard.selectSite();
  dashboard.selectRequesting();
  cy.wait(200);
  dashboard.submitButton();
  cy.wait(3000);
};

const validateSuccess = () => {
  dashboard.clickPrintBarCode();
  cy.wait(200);
};

const changeOrderStatus = (orderType) => {
  dashboard.selectFirstOrder();
  cy.wait(500);
  switch (orderType) {
    case "Pathology":
      dashboard.selectPathologyStatus();
      break;
    case "ImmunoChemistry":
      dashboard.selectStatus();
      dashboard.addImmunoChemReport();
      break;
    case "Cytology":
      dashboard.selectStatus();
      break;
  }
  dashboard.selectTechnician();
  dashboard.selectPathologist();
  dashboard.checkReadyForRelease();
  dashboard.saveOrder();
  cy.wait(500);
};

const validateOrderStatus = (dashboardName) => {
  navigateToDashboard(dashboardName);
  switch (dashboardName) {
    case "Pathology":
      dashboard.pathologyStatusFilter();
      break;
    case "ImmunoChemistry":
    case "Cytology":
      dashboard.statusFilter();
      break;
  }
};

describe("Pathology Dashboard", function () {
  it("User Visits Pathology Dashboard", function () {
    navigateToDashboard("Pathology");
  });

  it("User adds a new Pathology order", function () {
    addOrder("Pathology");
  });

  it("Validate Success by Confirming Print Barcode button", function () {
    validateSuccess();
  });

  it("User navigates back to pathology to confirm added order", () => {
    navigateToDashboard("Pathology");
  });

  it("Change The Status of Order and saves it", function () {
    changeOrderStatus("Pathology");
  });

  it("Validate the Status of Order", () => {
    validateOrderStatus("Pathology");
  });
});

describe("ImmunoChemistry Dashboard", function () {
  it("User Visits ImmunoChemistry Dashboard", function () {
    navigateToDashboard("ImmunoChemistry");
  });

  it("User adds a new ImmunioChemistry order", function () {
    addOrder("ImmunoChemistry");
  });

  it("Validate Success by Confirming Print Barcode button", function () {
    validateSuccess();
  });

  it("User navigates back to ImmunoChem to confirm added order", () => {
    navigateToDashboard("ImmunoChemistry");
  });

  it("Change The Status of Order and saves it", function () {
    changeOrderStatus("ImmunoChemistry");
  });

  it("Validate the Status of Order", () => {
    validateOrderStatus("ImmunoChemistry");
  });
});

describe("Cytology Dashboard", function () {
  it("User Visits Cytology Dashboard", function () {
    navigateToDashboard("Cytology");
  });

  it("User adds a new Cytology order", function () {
    addOrder("Cytology");
  });

  it("Validate Success by Confirming Print Barcode button", function () {
    validateSuccess();
  });

  it("User navigates back to cytology to confirm added order", () => {
    navigateToDashboard("Cytology");
  });

  it("Change The Status of Order and saves it", function () {
    changeOrderStatus("Cytology");
  });

  it("Validate the Status of Order", () => {
    validateOrderStatus("Cytology");
  });
});
