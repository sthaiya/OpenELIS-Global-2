import LoginPage from "../pages/LoginPage";

let homePage = null;
let loginPage = null;
let nonConform = null;
//let skipBeforeEach = false;

before("login", () => {
  loginPage = new LoginPage();
  loginPage.visit();
});

describe("Report Non-Conforming Event", function () {
  it("User visits Report Non-Conforming Event Page", function () {
    homePage = loginPage.goToHomePage();
    nonConform = homePage.goToReportNCE();
    nonConform
      .getReportNonConformTitle()
      .should("contain.text", "Report Non-Conforming Event (NCE)");
  });

  it("Report NCE by Last Name", function () {
    cy.fixture("Patient").then((patient) => {
      nonConform.selectSearchType("Last Name");
      nonConform.enterSearchField(patient.lastName);
      nonConform.clickSearchButton();
      //nonConform.validateSearchResult(patient.labNo);
      nonConform.clickCheckbox({ force: true });
      nonConform.clickGoToNceFormButton();
    });
  });

  it("Enter details", function () {
    cy.fixture("NonConform").then((nonConformData) => {
      nonConform.enterStartDate(nonConformData.dateOfEvent);
      nonConform.selectReportingUnit(nonConformData.reportingUnit);
      nonConform.enterDescription(nonConformData.description);
      nonConform.enterSuspectedCause(nonConformData.suspectedCause);
      nonConform.enterCorrectiveAction(nonConformData.proposedCorrectiveAction);
      nonConform.submitForm();
    });
    cy.reload();
  });

  it("Report NCE by First Name", function () {
    cy.fixture("Patient").then((patient) => {
      nonConform.selectSearchType("First Name");
      nonConform.enterSearchField(patient.firstName);
      nonConform.clickSearchButton();
      //nonConform.validateSearchResult(patient.labNo);
      //});
      nonConform.clickCheckbox({ force: true });
      nonConform.clickGoToNceFormButton();
    });
  });

  it("Enter details", function () {
    cy.fixture("NonConform").then((nonConformData) => {
      nonConform.enterStartDate(nonConformData.dateOfEvent);
      nonConform.selectReportingUnit(nonConformData.reportingUnit);
      nonConform.enterDescription(nonConformData.description);
      nonConform.enterSuspectedCause(nonConformData.suspectedCause);
      nonConform.enterCorrectiveAction(nonConformData.proposedCorrectiveAction);
      nonConform.submitForm();
    });
    cy.reload();
  });

  it("Report NCE by PatientID", function () {
    cy.fixture("Patient").then((patient) => {
      nonConform.selectSearchType("Patient Identification Code");
      nonConform.enterSearchField(patient.nationalId);
      nonConform.clickSearchButton();
      //nonConform.validateSearchResult(patient.labNo);
      //});
      nonConform.clickCheckbox({ force: true });
      nonConform.clickGoToNceFormButton();
    });
  });

  it("Enter details", function () {
    cy.fixture("NonConform").then((nonConformData) => {
      nonConform.enterStartDate(nonConformData.dateOfEvent);
      nonConform.selectReportingUnit(nonConformData.reportingUnit);
      nonConform.enterDescription(nonConformData.description);
      nonConform.enterSuspectedCause(nonConformData.suspectedCause);
      nonConform.enterCorrectiveAction(nonConformData.proposedCorrectiveAction);
      nonConform.submitForm();
    });
  });

  it("Report NCE by Lab Number ", function () {
    homePage = loginPage.goToHomePage();
    nonConform = homePage.goToReportNCE();
    nonConform
      .getReportNonConformTitle()
      .should("contain.text", "Report Non-Conforming Event (NCE)");
    nonConform.selectSearchType("Lab Number");
    cy.fixture("Patient").then((patient) => {
      nonConform.enterSearchField(patient.labNo);
    });
    nonConform.clickSearchButton();
    //nonConform.validateSearchResult(patient.labNo);
    nonConform.clickCheckbox({ force: true });
    nonConform.clickGoToNceFormButton();
    nonConform.getAndSaveNceNumber();
  });

  it("Should enter the details and Submit the NCE Reporting Form", function () {
    cy.fixture("NonConform").then((nonConformData) => {
      nonConform.enterStartDate(nonConformData.dateOfEvent);
      nonConform.selectReportingUnit(nonConformData.reportingUnit);
      nonConform.enterDescription(nonConformData.description);
      nonConform.enterSuspectedCause(nonConformData.suspectedCause);
      nonConform.enterCorrectiveAction(nonConformData.proposedCorrectiveAction);
      nonConform.submitForm();
    });
  });
});

describe("View New Non-Conforming Event", function () {
  it("User visits View Non-Conforming Event Page", function () {
    homePage = loginPage.goToHomePage();
    nonConform = homePage.goToViewNCE();
    nonConform
      .getViewNonConformTitle()
      .should("contain.text", "View New Non Conform Event");
  });
  it("View New NCE by Lab Number", function () {
    cy.fixture("Patient").then((patient) => {
      nonConform.selectSearchType("Lab Number");
      nonConform.enterSearchField(patient.labNo);
      nonConform.clickSearchButton();
      nonConform.clickRadioButtonNCE();
      //nonConform.validateLabNoSearchResult(patient.labNo);
    });
  });

  it("Enter details", function () {
    cy.fixture("NonConform").then((nce) => {
      nonConform.enterNceCategory(nce.nceCategory);
      nonConform.enterNceType(nce.nceType);
      nonConform.enterConsequences(nce.consequences);
      nonConform.enterRecurrence(nce.recurrence);
      nonConform.enterLabComponent(nce.labComponent);
      nonConform.enterDescriptionAndComments(nce.test);
      nonConform.submitForm();
    });
    cy.reload();
  });

  it("View New NCE by NCE Number", function () {
    cy.fixture("NonConform").then((nce) => {
      nonConform.selectSearchType("NCE Number");
      nonConform.enterSearchField(nce.NceNumber);
      nonConform.clickSearchButton();
      cy.wait(5000);
      //nonConform.validateNCESearchResult(nce.NceNumber);
    });
  });

  it("Enter The details and Submit", function () {
    cy.fixture("NonConform").then((nce) => {
      nonConform.enterNceCategory(nce.nceCategory);
      nonConform.enterNceType(nce.nceType);
      nonConform.enterConsequences(nce.consequences);
      nonConform.enterRecurrence(nce.recurrence);
      nonConform.enterLabComponent(nce.labComponent);
      nonConform.enterDescriptionAndComments(nce.test);
      nonConform.submitForm();
    });
  });
});

describe("Corrective Actions", function () {
  it("User visits Corrective Actions Page", function () {
    homePage = loginPage.goToHomePage();
    nonConform = homePage.goToCorrectiveActions();
    nonConform
      .getViewNonConformTitle()
      .should("contain.text", "Nonconforming Events Corrective Action");
  });
  it("Should Search by Lab Number and Validate the results", function () {
    cy.fixture("Patient").then((patient) => {
      nonConform.selectSearchType("Lab Number");
      nonConform.enterSearchField(patient.labNo);
      nonConform.clickSearchButton();
      nonConform.clickRadioButtonNCE();
      //nonConform.validateLabNoSearchResult(patient.labNo);
    });
  });

  it("Enter Discussion details and submit", function () {
    cy.fixture("NonConform").then((nce) => {
      nonConform.enterDiscussionDate(nce.dateOfEvent);
      nonConform.selectActionType();
      nonConform.checkResolution();
      nonConform.enterDateCompleted(nce.dateOfEvent);
      nonConform.enterProposedCorrectiveAction(nce.proposedCorrectiveAction);
      nonConform.enterDateCompleted0(nce.dateOfEvent);
      nonConform.clickSubmitButton();
    });
    cy.reload();
  });

  it("Search by NCE Number and Validate the results", function () {
    cy.fixture("NonConform").then((nce) => {
      nonConform.selectSearchType("NCE Number");
      nonConform.enterSearchField(nce.NceNumber);
      nonConform.clickSearchButton();
      //nonConform.validateNCESearchResult(nce.NceNumber);
    });
  });

  it("Enter Discussion details and submit", function () {
    cy.fixture("NonConform").then((nce) => {
      nonConform.enterDiscussionDate(nce.dateOfEvent);
      nonConform.selectActionType();
      nonConform.checkResolution();
      nonConform.enterDateCompleted(nce.dateOfEvent);
      nonConform.enterProposedCorrectiveAction(nce.proposedCorrectiveAction);
      nonConform.enterDateCompleted0(nce.dateOfEvent);
      nonConform.clickSubmitButton();
    });
  });
});
