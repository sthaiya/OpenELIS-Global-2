import LoginPage from "../pages/LoginPage";

let homePage = null;
let loginPage = null;
let dashboard = null;

before("login", () => {
  loginPage = new LoginPage();
  loginPage.visit();
});

describe("Pathology Dashboard", function () {
  it("User  Visits Pathology Dashboard", function () {
    homePage = loginPage.goToHomePage();
    dashboard = homePage.goToPathologyDashboard();
    cy.wait(500);
  });

  it("User adds a new Pathology order", function () {
    homePage.goToOrderPage();
    dashboard.searchPatientByFName();
    dashboard.searchPatient();
    cy.wait(200);
    dashboard.checkPatientRadio();
    dashboard.clickNext();
    cy.wait(200);
    dashboard.selectHistopathology();
    dashboard.clickNext();
    cy.wait(200);
    dashboard.selectPathologySample();
    dashboard.checkPathologyPanel();
    dashboard.clickNext();
    cy.wait(200);
    dashboard.generateLabNo();
    dashboard.selectSite();
    dashboard.selectRequesting();
    cy.wait(200);
    dashboard.submitButton();
    cy.wait(2000);
  });

  it("Validate Success by Confirming Print Barcode button", function () {
    dashboard.clickPrintBarCode();
  });

  it("User navigates back to pathology to confirm added order", () => {
    homePage.goToPathologyDashboard();
  });

  it("Change The Status of Order and saves it", function () {
    dashboard.selectFirstOrder();
    cy.wait(500);
    dashboard.selectPathologyStatus();
    dashboard.selectTechnician();
    dashboard.selectPathologist();
    dashboard.checkReadyForRelease();
    dashboard.saveOrder();
    cy.wait(500);
  });

  it("Validate the Status of Order", () => {
    dashboard = homePage.goToPathologyDashboard();

    //selects processing orders
    dashboard.pathologyStatusFilter();
  });
});

describe("ImmunoChemistry Dashboard", function () {
  it("User  Visits ImmunoChemistry Dashboard", function () {
    homePage = loginPage.goToHomePage();
    dashboard = homePage.goToImmunoChemistryDashboard();
    cy.wait(500);
  });

  it("User adds a new ImmunioChemistry order", function () {
    homePage.goToOrderPage();
    dashboard.searchPatientByFName();
    dashboard.searchPatient();
    cy.wait(200);
    dashboard.checkPatientRadio();
    dashboard.clickNext();
    cy.wait(200);
    dashboard.selectImmunoChem();
    //dashboard.selectSpecimen();
    //dashboard.specimenType();
    //dashboard.procedurePerformed();
    dashboard.clickNext();
    cy.wait(200);
    dashboard.selectImmunoChemSample();
    dashboard.checkImmunoChemTest();
    dashboard.clickNext();
    cy.wait(200);
    dashboard.generateLabNo();
    dashboard.selectSite();
    dashboard.selectRequesting();
    cy.wait(200);
    dashboard.submitButton();
    cy.wait(2000);
  });

  it("Validate Success by Confirming Print Barcode button", function () {
    dashboard.clickPrintBarCode();
    cy.wait(200);
  });

  it("User navigates back to ImmunoChem to confirm added order", () => {
    homePage.goToImmunoChemistryDashboard();
  });

  it("Change The Status of Order and saves it", function () {
    dashboard.selectFirstOrder();
    cy.wait(500);
    dashboard.selectTechnician();
    dashboard.selectPathologist();
    dashboard.selectStatus();
    dashboard.addImmunoChemReport();
    dashboard.checkReadyForRelease();
    dashboard.saveOrder();
    cy.wait(200);
  });

  it("Validate the Status of Order", () => {
    dashboard = homePage.goToImmunoChemistryDashboard();

    //selects complete orders
    dashboard.statusFilter();
  });
});

describe("Cytology Dashboard", function () {
  it("User  Visits Cytology Dashboard", function () {
    homePage = loginPage.goToHomePage();
    dashboard = homePage.goToCytologyDashboard();
    cy.wait(500);
  });

  it("User adds a new Cytology order", function () {
    homePage.goToOrderPage();
    dashboard.searchPatientByFName();
    dashboard.searchPatient();
    cy.wait(200);
    dashboard.checkPatientRadio();
    cy.wait(100);
    dashboard.clickNext();
    cy.wait(200);
    dashboard.selectCytology();
    dashboard.clickNext();
    cy.wait(200);
    dashboard.selectFluidSample();
    dashboard.checkCovidPanel();
    dashboard.clickNext();
    cy.wait(200);
    dashboard.generateLabNo();
    dashboard.selectSite();
    dashboard.selectRequesting();
    cy.wait(200);
    dashboard.submitButton();
    cy.wait(2000);
  });

  it("Validate Success by Confirming Print Barcode button", function () {
    dashboard.clickPrintBarCode();
    cy.wait(200);
  });

  it("User navigates back to cytology to confirm added order", () => {
    dashboard = homePage.goToCytologyDashboard();
  });

  it("Change The Status of Order and saves it", function () {
    dashboard.selectFirstOrder();
    cy.wait(500);
    dashboard.selectStatus();
    dashboard.selectTechnician();
    dashboard.selectPathologist();
    dashboard.checkReadyForRelease();
    dashboard.saveOrder();
    cy.wait(500);
  });

  it("Validate the Status of Order", () => {
    dashboard = homePage.goToCytologyDashboard();

    //selects complete orders
    dashboard.statusFilter();
  });
});
