import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import Result from "../pages/ResultsPage";
import PatientEntryPage from "../pages/PatientEntryPage";

let homePage = null;
let loginPage = null;
let result = null;
let patientPage = new PatientEntryPage();

before("login", () => {
  loginPage = new LoginPage();
  loginPage.visit();
});

describe("Result By Unit", function () {
  before("navigate to Result By Unit", function () {
    homePage = loginPage.goToHomePage();
    result = homePage.goToResultsByUnit();
  });

  it("User visits Results Page", function () {
    cy.fixture("result").then((res) => {
      result.getResultTitle().should("contain.text", res.pageTitle);
    });
  });

  it("Should Search by Unit", function () {
    cy.fixture("workplan").then((order) => {
      result.selectUnitType(order.unitBioType);
    });
  });

  it("should accept the sample, refer the sample, and save the result", function () {
    cy.fixture("result").then((res) => {
      //result.acceptSample();
      result.expandSampleDetails();
      result.selectTestMethod(0, res.pcrTestMethod);
      //cy.get(":nth-child(3) > .cds--form-item > .cds--checkbox-label").click();
      result.referTests();
      // result.referSample(0, res.testNotPerformed, res.cedres);
      result.setResultValue(0, res.positiveResult);
      result.submitResults();
    });
  });
});

describe("Result By Patient", function () {
  it("navigate to Result By Patient", function () {
    result = homePage.goToResultsByPatient();
  });

  it("User visits Results Page", function () {
    cy.fixture("result").then((res) => {
      result.getResultTitle().should("contain.text", res.pageTitle);
    });
  });

  it("Should search Patient By First and LastName and validate", function () {
    cy.wait(1000);
    cy.fixture("Patient").then((patient) => {
      patientPage.searchPatientByFirstAndLastName(
        patient.firstName,
        patient.lastName,
      );
      patientPage.getFirstName().should("have.value", patient.firstName);
      patientPage.getLastName().should("have.value", patient.lastName);
      patientPage.getLastName().should("not.have.value", patient.inValidName);
      patientPage.clickSearchPatientButton();
      patientPage.validatePatientSearchTable(
        patient.firstName,
        patient.inValidName,
      );
    });
    cy.reload();
  });

  it("should search patient By PatientId and validate", function () {
    cy.wait(500);
    cy.fixture("Patient").then((patient) => {
      patientPage.searchPatientByPatientId(patient.nationalId);
      patientPage.clickSearchPatientButton();
      patientPage.validatePatientSearchTable(
        patient.firstName,
        patient.inValidName,
      );
    });
    cy.reload();
  });

  it("should search patient By Lab Number and validate", function () {
    cy.wait(500);
    cy.fixture("Patient").then((patient) => {
      cy.get("#labNumber").type(patient.labNo);
      patientPage.clickSearchPatientButton();
    });
  });

  it("Search by respective patient and accept the result", function () {
    cy.wait(1000);
    cy.fixture("Patient").then((patient) => {
      patientPage.searchPatientByFirstAndLastName(
        patient.firstName,
        patient.lastName,
      );
    });
    patientPage.getMaleGenderRadioButton();
    patientPage.clickSearchPatientButton();
    cy.wait(10000);
    result.selectPatientFromSearchResults();
    cy.wait(800);
    cy.fixture("result").then((res) => {
      //result.acceptResult();
      result.expandSampleDetails();
      result.selectTestMethod(0, res.stainTestMethod);
      result.submitResults();
    });
  });
});

describe("Result By Order", function () {
  before("navigate to Result By Order", function () {
    homePage = loginPage.goToHomePage();
    result = homePage.goToResultsByOrder();
  });

  it("User visits Results Page", function () {
    cy.fixture("result").then((res) => {
      result.getResultTitle().should("contain.text", res.pageTitle);
    });
  });

  it("Should Search by Accession Number", function () {
    cy.fixture("Patient").then((order) => {
      cy.get("#accessionNumber").type(order.labNo);
    });
    result.searchResults();
    cy.wait(1000);
  });

  it("should accept the sample and save the result", function () {
    cy.fixture("result").then((res) => {
      //result.acceptSample();
      result.expandSampleDetails();
      result.selectTestMethod(0, res.stainTestMethod);
      result.submitResults();
    });
  });
});

describe("Result By Referred Out Tests", function () {
  before("navigate to Result By Referred Out Tests", function () {
    homePage = loginPage.goToHomePage();
    result = homePage.goToResultsForRefferedOut();
  });

  it("User visits Reffered out Page", function () {
    cy.fixture("result").then((res) => {
      result.getResultTitle().should("contain.text", res.referralPageTitle);
    });
  });

  it("Search Referrals By Patient and validate", function () {
    cy.fixture("Patient").then((patient) => {
      patientPage.searchPatientByPatientId(patient.nationalId);
      patientPage.searchPatientByFirstAndLastName(
        patient.firstName,
        patient.lastName,
      );
      patientPage.getFirstName().should("have.value", patient.firstName);
      patientPage.getLastName().should("have.value", patient.lastName);
      patientPage.clickSearchPatientButton();
      patientPage.validatePatientSearchTable(
        patient.firstName,
        patient.inValidName,
      );
    });
  });

  it("should validate the results", function () {
    cy.wait(1000);
    cy.fixture("Patient").then((patient) => {
      result.validatePatientResult(patient);
    });
    patientPage.selectPatientFromSearchResults();
    result.clickReferralsByPatient();
    cy.reload();
  });

  it("search Referrals By Test Unit and Name then validate", function () {
    cy.fixture("workplan").then((res) => {
      cy.get("#testnames-input").type(res.testName);
      cy.get("#testnames-item-0-item").click();
      cy.get("#testunits-input").type(res.unitType);
      cy.get("#testunits-item-0-item").click();
    });
    result.clickReferralsByTestAndName();
    cy.reload();
  });

  it("should search Referrals By LabNumber and validate", function () {
    cy.fixture("Patient").then((order) => {
      cy.get("#labNumberInput").type(order.labNo);
    });
    result.clickReferralsByLabNumber();
  });
});

describe("Result By Range Of Order", function () {
  before("navigate to Result By Range Of Order", function () {
    homePage = loginPage.goToHomePage();
    result = homePage.goToResultsByRangeOrder();
  });

  it("User visits Results Page", function () {
    cy.fixture("result").then((res) => {
      result.getResultTitle().should("contain.text", res.pageTitle);
    });
  });

  it("Should Enter Lab Number and perform Search", function () {
    cy.fixture("Patient").then((order) => {
      cy.get("#startLabNo").type(order.labNo);
    });
    result.searchResults();
  });

  it("Should Accept And Save the result", function () {
    cy.wait(1000);
    cy.fixture("result").then((res) => {
      //result.acceptSample();
      result.expandSampleDetails();
      result.selectTestMethod(0, res.eiaTestMethod);
      result.submitResults();
    });
  });
});

describe("Result By Test And Status", function () {
  before("navigate to Result By Test And Status", function () {
    homePage = loginPage.goToHomePage();
    result = homePage.goToResultsByTestAndStatus();
  });

  it("User visits Results Page", function () {
    cy.fixture("result").then((res) => {
      result.getResultTitle().should("contain.text", res.pageTitle);
    });
  });

  it("Should select testName, analysis status, and perform Search", function () {
    cy.fixture("workplan").then((order) => {
      result.selectTestName(order.testName);
    });
    cy.fixture("result").then((res) => {
      result.selectAnalysisStatus(res.analysisStatus);
      //result.selectSampleStaus
      result.searchResults();
    });
  });

  it("Should Validate And accept the result", function () {
    cy.fixture("workplan").then((order) => {
      cy.contains("#row-0", order.testName).should("be.visible");
    });
    cy.fixture("result").then((res) => {
      cy.wait(1000);
      //result.acceptSample();
      result.expandSampleDetails();
      result.selectTestMethod(0, res.eiaTestMethod);
      result.submitResults();
    });
  });
});
