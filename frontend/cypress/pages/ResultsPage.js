class Result {
  getResultTitle() {
    return cy.get("section > h3");
  }

  selectUnitType(unitType) {
    cy.get("#unitType").select(unitType);
  }

  acceptSample(index = 0) {
    cy.get("[data-cy='checkTestResult']").eq(index).check();
  }
  acceptResult() {
    cy.get("#cell-accept-0 > .cds--form-item > .cds--checkbox-label").click();
  }

  expandSampleDetails(index = 0) {
    //cy.get(`button[aria-label="Expand Row"]:nth-of-type(${index + 1})`, {
    // timeout: 10000,
    // })
    cy.get("#row-0 > div.sc-hLBbgP.sc-ftTHYK.cpdasa.jNRUar > button")
      .should("exist")
      .should("be.visible")
      .click({ force: true });
  }

  selectTestMethod(index = 0, method) {
    cy.get(`#testMethod${index}`).select(method);
  }

  searchResults() {
    cy.get("#searchResults").click();
  }

  validatePatientResult(patient) {
    cy.get("tbody > :nth-child(1) > :nth-child(2)").should(
      "contain.text",
      patient.lastName,
    );
    cy.get("tbody > :nth-child(1) > :nth-child(3)").should(
      "contain.text",
      patient.firstName,
    );
  }

  referSample(index = 0, reason, institute) {
    cy.get(`#referralReason${index}`).select(reason);
    cy.get(`#institute${index}`).select(institute);
  }

  referTests() {
    cy.contains("span", "Refer test to a reference lab")
      .should("be.visible")
      .click();
  }
  selectPatientFromSearchResults() {
    cy.get('label[for="2"] .cds--radio-button__appearance').click();
  }

  selectRefferedTest() {
    cy.get(
      "tbody > tr > .cds--table-column-checkbox > .cds--checkbox--inline > .cds--checkbox-label",
    ).click();
  }

  selectAnalysisStatus(status) {
    cy.get("#analysisStatus").select(status);
  }
  selectTestName(testName) {
    cy.get("#testName").select(testName);
  }

  printReport() {
    cy.get(":nth-child(6) > :nth-child(2) > .cds--btn")
      .should("be.visible")
      .click();
  }

  clickReferralsByPatient() {
    cy.get("[data-cy='referralsByPatient']").should("be.visible").click();
  }
  clickReferralsByTestAndName() {
    cy.get("[data-cy='byUnitsAndTests']").should("be.visible").click();
  }
  clickReferralsByLabNumber() {
    cy.get("[data-cy='byLabNumber']").should("be.visible").click();
  }

  setResultValue(index = 0, value) {
    cy.get(`#ResultValue${index}`).type(value);
  }

  submitResults() {
    cy.get("#saveResults").should("be.visible").click();
  }
}

export default Result;
