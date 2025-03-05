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
    cy.get("[data-testid='nce-search-button']").click();
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
    cy.contains(
      "label.cds--checkbox-label",
      "Immunohistochemistry specimen",
    ).click({ force: true });
  }

  clickGoToNceFormButton() {
    cy.get("[data-testid='nce-goto-form-button']").click();
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
    cy.get("#text-area-corrective").type(action, { force: true });
  }

  enterDateCompleted(date) {
    cy.get("#dateCompleted").type(date);
  }

  selectActionType() {
    cy.get("[data-testid='nce-action-checkbox']").click({ force: true });
  }

  checkResolution() {
    cy.contains("span", "Yes").click();
  }

  clickRadioButtonNCE() {
    cy.get("[data-testid='Radio-button']")
      .eq(0) // 0 for first, 1 for second, 2 for third, etc.
      .should("be.visible")
      .click({ force: true });
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
