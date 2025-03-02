import LoginPage from "../pages/LoginPage";
import PatientEntryPage from "../pages/PatientEntryPage";
import OrderEntityPage from "../pages/OrderEntityPage";
import ProviderManagementPage from "../pages/ProviderManagementPage";
import AdminPage from "../pages/AdminPage";

let homePage = null;
let loginPage = null;
let modifyOrderPage = null;
let adminPage = new AdminPage();
let providerManagementPage = new ProviderManagementPage();
let orderEntityPage = new OrderEntityPage();
let patientPage = new PatientEntryPage();

before("login", () => {
  loginPage = new LoginPage();
  loginPage.visit();
});
describe("Add requester details first", function () {
  it("Navidates to admin", function () {
    homePage = loginPage.goToHomePage();
    modifyOrderPage = homePage.goToAdminPage();
    modifyOrderPage = adminPage.goToProviderManagementPage();
  });

  it("Adds and saves requester", function () {
    providerManagementPage.clickAddProviderButton();
    providerManagementPage.enterProviderLastName();
    providerManagementPage.enterProviderFirstName();
    providerManagementPage.clickActiveDropdown();
    providerManagementPage.addProvider();
  });
});

describe("Modify Order search by patient ", function () {
  it("User Visits Home Page and goes to Modify Order Page ", function () {
    homePage = loginPage.goToHomePage();
    modifyOrderPage = homePage.goToModifyOrderPage();
  });

  it("Should search Patient By First and LastName", function () {
    cy.wait(1000);
    cy.fixture("Patient").then((patient) => {
      patientPage.searchPatientByFirstAndLastName(
        patient.firstName,
        patient.lastName,
      );
      patientPage.getFirstName().should("have.value", patient.firstName);
      patientPage.getLastName().should("have.value", patient.lastName);

      patientPage.getLastName().should("not.have.value", patient.inValidName);

      modifyOrderPage.clickSearchPatientButton();
      patientPage.validatePatientSearchTable(
        patient.firstName,
        patient.inValidName,
      );
    });
    cy.wait(200).reload();
  });

  it("Should be able to search patients By gender", function () {
    cy.wait(1000);
    patientPage.getMaleGenderRadioButton().should("be.visible");
    patientPage.getMaleGenderRadioButton().click();
    cy.wait(200);
    modifyOrderPage.clickSearchPatientButton();
    cy.fixture("Patient").then((patient) => {
      patientPage.validatePatientByGender("M");
    });
    cy.wait(200).reload();
  });

  it("should search patient By PatientId", function () {
    cy.wait(1000);
    cy.fixture("Patient").then((patient) => {
      patientPage.searchPatientByPatientId(patient.nationalId);
      modifyOrderPage.clickSearchPatientButton();
      patientPage.validatePatientSearchTable(
        patient.firstName,
        patient.inValidName,
      );
    });
  });
  //TO DO needs fixing
  it("Should be able to search by respective patient ", function () {
    cy.wait(1000);
    modifyOrderPage.clickRespectivePatient();
    cy.wait(1000);
  });
  it("Validate program dropdown button not visible and click next", function () {
    modifyOrderPage.checkProgramButton();
    modifyOrderPage.clickNextButton();
  });

  it("should be able to record", function () {
    cy.wait(1000);
    modifyOrderPage.assignValues();
  });

  it("Click next, go add order page then submit order", function () {
    modifyOrderPage.clickNextButton();
    cy.wait(1000);
    orderEntityPage.rememberSiteAndRequester();
    modifyOrderPage.clickSubmitButton();
  });

  it("User prints barcode", function () {
    cy.window().then((win) => {
      //stubbed to prevent opening new tab
      cy.stub(win, "open").as("windowOpen");
    });

    modifyOrderPage.clickPrintBarcodeButton();

    cy.get("@windowOpen").should(
      "be.calledWithMatch",
      /\/api\/OpenELIS-Global\/LabelMakerServlet\?labNo=/,
    );
  });
});

describe("Modify Order search by accession Number", function () {
  it("User Visits Home Page and goes to Modify Order Page ", function () {
    homePage = loginPage.goToHomePage();
    modifyOrderPage = homePage.goToModifyOrderPage();
  });

  it("Searche with accession number and submit", () => {
    cy.wait(200);
    cy.fixture("Patient").then((patient) => {
      modifyOrderPage.enterAccessionNo(patient.labNo);
      modifyOrderPage.clickSubmitAccessionButton();
    });
    cy.wait(10000);
  });

  it("Validate program dropdown button not visible and click next", function () {
    modifyOrderPage.checkProgramButton();
    modifyOrderPage.clickNextButton();
  });

  it("Add Sample", function () {
    modifyOrderPage.selectSerumSample();
    orderEntityPage.checkPanelCheckBoxField();
    modifyOrderPage.clickNextButton();
  });

  it("Add Order", function () {
    orderEntityPage.generateLabOrderNumber();
    cy.fixture("Order").then((order) => {
      orderEntityPage.enterSiteName(order.siteName);
      orderEntityPage.enterRequesterLastAndFirstName(
        order.requester.fullName,
        order.requester.firstName,
        order.requester.lastName,
      );
    });
    orderEntityPage.rememberSiteAndRequester();
    modifyOrderPage.clickSubmitButton();
    cy.wait(90000);
  });

  it("should be able to print barcode", function () {
    cy.window().then((win) => {
      //stubbed to prevent opening new tab
      cy.stub(win, "open").as("windowOpen");
    });

    modifyOrderPage.clickPrintBarcodeButton();

    cy.get("@windowOpen").should(
      "be.calledWithMatch",
      /\/api\/OpenELIS-Global\/LabelMakerServlet\?labNo=/,
    );
  });
});
