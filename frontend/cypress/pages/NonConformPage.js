class NonConform {
  // Title validation (kept as-is per request)
  getReportNonConformTitle() {
    return cy.get("h2");
  }

  getViewNonConformTitle() {
    return cy.get("h2");
  }

  // Form interactions
  selectSearchType(type) {
    cy.get("#type").select(type);
  }

  enterSearchField(value) {
    cy.get("[data-cy='fieldName']").type(value);
  }

  clickSearchButton() {
    cy.get("[data-testid='nce-search-button']").should("be.visible").click();
  }

  // Search results validation
  validateSearchResult(expectedValue) {
    cy.get("[data-testid='nce-search-result']")
      .first()
      .invoke("text")
      .should("eq", expectedValue);
  }

  validateLabNoSearchResult(labNo) {
    cy.get("[data-testid='nce-search-result']")
      .invoke("text")
      .should("eq", labNo);
  }

  validateNCESearchResult(NCENo) {
    cy.get("[data-testid='nce-number-result']")
      .invoke("text")
      .should("eq", NCENo);
  }

  // Checkbox and navigation
  clickCheckbox() {
    cy.get("[data-testid='nce-sample-checkbox']")
      .should("be.visible")
      .check({ force: true });
  }

  clickGoToNceFormButton() {
    cy.get("[data-testid='nce-goto-form-button']").should("be.visible").click();
  }

  // Form fields (preserve original IDs)
  enterStartDate(date) {
    cy.get("input#startDate").type(date);
  }

  selectReportingUnit(unit) {
    cy.get("#reportingUnits").select(unit);
  }

  enterDescription(description) {
    cy.get("#text-area-1").type(description);
  }

  enterSuspectedCause(SuspectedCause) {
    cy.get("#text-area-2").type(SuspectedCause);
  }

  enterCorrectiveAction(correctiveaction) {
    cy.get("#text-area-3").type(correctiveaction);
  }

  // Dropdowns
  enterNceCategory(nceCategory) {
    cy.get("#nceCategory").select(nceCategory);
  }

  enterNceType(nceType) {
    cy.get("#nceType").select(nceType);
  }

  enterConsequences(consequences) {
    cy.get("#consequences").select(consequences);
  }

  enterRecurrence(recurrence) {
    cy.get("#recurrence").select(recurrence);
  }

  enterLabComponent(labComponent) {
    cy.get("#labComponent").select(labComponent);
  }

  // Text areas
  enterDescriptionAndComments(testText) {
    cy.get("#text-area-10").type(testText);
    cy.get("#text-area-3").type(testText);
    cy.get("#text-area-2").type(testText);
  }

  // Submission
  submitForm() {
    cy.get("[data-testid='nce-submit-button']").click();
  }

  // Corrective actions
  enterDiscussionDate(date) {
    cy.get("#tdiscussionDate").type(date);
  }

  enterProposedCorrectiveAction(action) {
    cy.get("#text-area-corrective")
      .should("not.be.disabled")
      .type(action, { force: true });
  }

  enterDateCompleted(date) {
    cy.get("#dateCompleted").type(date);
  }

  selectActionType() {
    cy.get(
      "div.cds--sm\:col-span-3:nth-child(30) > div:nth-child(1) > input:nth-child(1)",
    ).check({ force: true });
  }

  checkResolution() {
    cy.contains("span", "Yes").click();
  }

  clickRadioButtonNCE() {
    cy.get(
      "tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > label:nth-child(2) > span:nth-child(1)",
    )
      //.first()
      .click();
  }

  enterDateCompleted0(date) {
    cy.get(".cds--date-picker-input__wrapper > #dateCompleted-0").type(date);
  }

  clickSubmitButton() {
    cy.get("[data-testid='nce-submit-button']").should("be.visible").click();
  }
  // Data management
  getAndSaveNceNumber() {
    cy.get("[data-testid='nce-number-result']")
      .invoke("text")
      .then((text) => {
        cy.readFile("cypress/fixtures/NonConform.json").then((existingData) => {
          const newData = {
            ...existingData,
            NceNumber: text.trim(),
          };
          cy.writeFile("cypress/fixtures/NonConform.json", newData);
        });
      });
  }
}

export default NonConform;
