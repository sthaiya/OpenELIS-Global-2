import LoginPage from "../pages/LoginPage";
import OrderEntityPage from "../pages/OrderEntityPage";
import ProviderManagementPage from "../pages/ProviderManagementPage";
import AdminPage from "../pages/AdminPage";

let homePage = null;
let loginPage = null;
let workplan = null;
let orderEntityPage = new OrderEntityPage();
let providerManagementPage = new ProviderManagementPage();
let adminPage = new AdminPage();

before("login", () => {
  loginPage = new LoginPage();
  loginPage.visit();
});

describe("Add requester details first", function () {
  it("Navidates to admin", function () {
    homePage = loginPage.goToHomePage();
    workplan = homePage.goToAdminPage();
    workplan = adminPage.goToProviderManagementPage();
  });

  it("Adds and saves requester", function () {
    providerManagementPage.clickAddProviderButton();
    providerManagementPage.enterProviderLastName();
    providerManagementPage.enterProviderFirstName();
    providerManagementPage.clickActiveDropdown();
    providerManagementPage.addProvider();
  });
});

describe("Add Orders for various workplans", function () {
  it("Add order with Albumin test", function () {
    homePage = loginPage.goToHomePage();
    workplan = homePage.goToOrderPage();
  });

  it("Should search patient in the search box", function () {
    workplan = orderEntityPage.getPatientPage();
    cy.wait(1000);
    cy.fixture("Patient").then((patient) => {
      patientEntryPage.searchPatientByFirstAndLastName(
        patient.firstName,
        patient.lastName,
      );
      patientEntryPage.clickSearchPatientButton();
      patientEntryPage.validatePatientSearchTable(
        patient.firstName,
        patient.inValidName,
      );
      patientEntryPage.selectPatientFromSearchResults();
      cy.wait(300);
      patientEntryPage.getFirstName().should("have.value", patient.firstName);
      patientEntryPage.getLastName().should("have.value", patient.lastName);
    });
    orderEntityPage.clickNextButton();
  });

  it("User goes to program selection", function () {
    orderEntityPage.selectCytology();
    cy.wait(200);
    orderEntityPage.clickNextButton();
  });

  it("User should select sample type option", function () {
    cy.fixture("Order").then((order) => {
      order.samples.forEach((sample) => {
        orderEntityPage.selectSampleTypeOption(sample.sampleType);
        orderEntityPage.checkPanelCheckBoxField();
      });
    });
    cy.wait(1000);
    orderEntityPage.clickNextButton();
  });

  it("Generate Lab Order Number", function () {
    orderEntityPage.generateLabOrderNumber();
  });

  it("should Enter or select site name", function () {
    cy.wait(1000);
    cy.fixture("Order").then((order) => {
      orderEntityPage.enterSiteName(order.siteName);
    });
  });

  it("should enter requester first and last name's", function () {
    cy.fixture("Order").then((order) => {
      orderEntityPage.enterRequesterLastAndFirstName(
        order.requester.fullName,
        order.requester.firstName,
        order.requester.lastName,
      );
    });
    orderEntityPage.rememberSiteAndRequester();
  });
  it("should click submit order button", function () {
    orderEntityPage.clickSubmitOrderButton();
    cy.wait(8000);
  });
});

describe("Work plan by Test", function () {
  it("User  selects work plan by test from main menu drop-down.And the page appears", function () {
    homePage = loginPage.goToHomePage();
    workplan = homePage.goToWorkPlanPlanByTest();
    cy.fixture("workplan").then((options) => {
      workplan.getWorkPlanFilterTitle(options.testTile);
    });
  });
  it("User should select test from drop-down selector option", () => {
    cy.fixture("workplan").then((options) => {
      workplan.selectDropdownOption(options.testName);
      workplan.getPrintWorkPlanButton();
    });
  });
  it("All known orders are present", () => {
    cy.fixture("Order").then((options) => {
      workplan
        .getWorkPlanResultsTable()
        .find("tr")
        .then((row) => {
          expect(row.text()).contains(options.labNo);
        });
    });
  });
});

describe("Work plan by Panel", function () {
  it("User can select work plan by test from main menu drop-down. Workplan by panel page appears.", function () {
    homePage = loginPage.goToHomePage();
    workplan = homePage.goToWorkPlanPlanByPanel();
    cy.fixture("workplan").then((options) => {
      workplan.getWorkPlanFilterTitle(options.panelTile);
    });
  });

  it("User should select panel from drop-down selector option", () => {
    cy.fixture("workplan").then((options) => {
      workplan.selectDropdownOption(options.bilanPanelType);
      workplan.getPrintWorkPlanButton();
    });
  });

  it("All known orders are present", () => {
    cy.fixture("Order").then((options) => {
      workplan
        .getWorkPlanResultsTable()
        .find("tr")
        .then((row) => {
          expect(row.text()).contains(options.labNo);
        });
    });
  });
});

describe("Work plan by Unit", function () {
  it("User can select work plan By Unit from main menu drop-down. Workplan By Unit page appears.", function () {
    homePage = loginPage.goToHomePage();
    workplan = homePage.goToWorkPlanPlanByUnit();
    cy.fixture("workplan").then((options) => {
      workplan.getWorkPlanFilterTitle(options.unitTile);
    });
  });

  it("User should select unit type from drop-down selector option", () => {
    cy.fixture("workplan").then((options) => {
      workplan.selectDropdownOption(options.unitType);
      workplan.getPrintWorkPlanButton();
    });
  });

  it("All known orders are present", () => {
    cy.fixture("Order").then((options) => {
      workplan
        .getWorkPlanResultsTable()
        .find("tr")
        .then((row) => {
          expect(row.text()).contains(options.labNo);
        });
    });
  });
});

describe("Work plan by Priority", function () {
  it("User can select work plan By Priority from main menu drop-down. Workplan By Priority page appears.", function () {
    homePage = loginPage.goToHomePage();
    workplan = homePage.goToWorkPlanPlanByPriority();
    cy.fixture("workplan").then((options) => {
      workplan.getWorkPlanFilterTitle(options.priorityTile);
    });
  });

  it("User should select Priority from drop-down selector option", () => {
    cy.fixture("workplan").then((options) => {
      workplan.selectDropdownOption(options.priority);
      workplan.getPrintWorkPlanButton();
    });
  });

  it("All known orders are present", () => {
    cy.fixture("Order").then((options) => {
      workplan
        .getWorkPlanResultsTable()
        .find("tr")
        .then((row) => {
          expect(row.text()).contains(options.labNo);
        });
    });
  });
});
