class DashBoardPage {
  selectors = {
    firstNameInput: "#firstName",
    localSearchButton: "#local_search",
    patientRadio: "table tbody tr:first-child td label span",
    nextButton: ".forwardButton",
    additionalQuestionsSelect: "#additionalQuestionsSelect",
    sampleIdSelect: "#sampleId_0",
    covidCheckbox: 'label.cds--checkbox-label:contains("COVID-19 PCR")',
    histopathologyCheckbox:
      'label.cds--checkbox-label:contains("Histopathology examination")',
    immunoChemCheckbox: '.cds--checkbox-label-text:contains("Anti-CD7")',
    generateLabNoLink: 'a.cds--link:contains("Generate")',
    siteNameInput: "#siteName",
    siteNameSuggestion: '.suggestion-active:contains("279 - CAMES ")',
    requesterIdInput: "#requesterId",
    requesterSuggestion: '.suggestion-active:contains("Optimus")',
    submitButton: '.forwardButton:contains("Submit")',
    printBarcodeButton: '.cds--btn--primary:contains("Print Barcode")',
    firstOrderRow: 'tbody[aria-live="polite"] > tr:first-child',
    saveOrderButton: "#pathology_save2",
    pathologyStatusSelect: "#status",
    statusFilterSelect: "#statusFilter",
    assignedPathologistSelect: "#assignedPathologist",
    assignedTechnicianSelect: "#assignedTechnician",
    immunoChemReferCheckbox: "#referToImmunoHistoChemistry",
    immunoChemTestSelect: "#ihctest-input",
    reportSelect: "#report",
    readyForReleaseCheckbox: "#release",
  };

  constructor() {}

  searchPatientByFName() {
    cy.get(this.selectors.firstNameInput, { timeout: 10000 })
      .should("be.visible")
      .type("John");
  }

  searchPatient() {
    cy.get(this.selectors.localSearchButton, { timeout: 10000 })
      .should("be.visible")
      .click();
  }

  checkPatientRadio() {
    cy.get(this.selectors.patientRadio, { timeout: 10000 })
      .should("be.visible")
      .click();
  }

  clickNext() {
    cy.get(this.selectors.nextButton, { timeout: 10000 })
      .should("be.visible")
      .click();
  }

  selectHistopathology() {
    cy.get(this.selectors.additionalQuestionsSelect, { timeout: 10000 })
      .should("be.visible")
      .select("Histopathology");
  }

  selectImmunoChem() {
    cy.get(this.selectors.additionalQuestionsSelect, { timeout: 10000 })
      .should("be.visible")
      .select("Immunohistochemistry");
  }

  selectCytology() {
    cy.get(this.selectors.additionalQuestionsSelect, { timeout: 10000 })
      .should("be.visible")
      .select("Cytology");
  }

  selectFluidSample() {
    cy.get(this.selectors.sampleIdSelect, { timeout: 10000 })
      .should("be.visible")
      .select("Fluid");
  }

  checkCovidPanel() {
    cy.get(this.selectors.covidCheckbox, { timeout: 10000 })
      .should("be.visible")
      .click();
  }

  selectPathologySample() {
    cy.get(this.selectors.sampleIdSelect, { timeout: 10000 })
      .should("be.visible")
      .select("Histopathology specimen");
  }

  selectImmunoChemSample() {
    cy.get(this.selectors.sampleIdSelect, { timeout: 10000 })
      .should("be.visible")
      .select("Immunohistochemistry specimen");
  }

  checkImmunoChemTest() {
    cy.get(this.selectors.immunoChemCheckbox, { timeout: 10000 })
      .should("be.visible")
      .click();
  }

  checkPathologyPanel() {
    cy.get(this.selectors.histopathologyCheckbox, { timeout: 10000 })
      .should("be.visible")
      .click();
  }

  generateLabNo() {
    cy.get(this.selectors.generateLabNoLink, { timeout: 10000 })
      .should("be.visible")
      .click();
  }

  selectSite() {
    cy.get(this.selectors.siteNameInput, { timeout: 10000 })
      .should("be.visible")
      .type("279 - CAMES ");
    cy.get(this.selectors.siteNameSuggestion, { timeout: 10000 })
      .should("be.visible")
      .click();
    cy.wait(200); // Considering to replace this
  }

  selectRequesting() {
    cy.get(this.selectors.requesterIdInput, { timeout: 10000 })
      .should("be.visible")
      .type("Optimus");
    cy.get(this.selectors.requesterSuggestion, { timeout: 10000 })
      .should("be.visible")
      .click();
    cy.wait(200);
  }

  submitButton() {
    cy.get(this.selectors.submitButton, { timeout: 10000 })
      .should("be.visible")
      .click();
  }

  clickPrintBarCode() {
    cy.get(this.selectors.printBarcodeButton, { timeout: 15000 }).should(
      "be.visible",
    );
  }

  selectFirstOrder() {
    cy.get(this.selectors.firstOrderRow, { timeout: 10000 })
      .should("be.visible")
      .click();
  }

  saveOrder() {
    cy.get(this.selectors.saveOrderButton, { timeout: 10000 })
      .should("be.visible")
      .click();
  }

  selectPathologyStatus() {
    cy.get(this.selectors.pathologyStatusSelect, { timeout: 10000 })
      .should("be.visible")
      .select("Processing");
  }

  pathologyStatusFilter() {
    cy.get(this.selectors.statusFilterSelect, { timeout: 10000 })
      .should("be.visible")
      .select("Processing");
  }

  selectStatus() {
    cy.get(this.selectors.pathologyStatusSelect, { timeout: 15000 })
      .should("be.visible")
      .select("Completed");
  }

  selectPathologist() {
    cy.get(this.selectors.assignedPathologistSelect, { timeout: 10000 })
      .should("be.visible")
      .select("ELIS,Open");
  }

  selectTechnician() {
    cy.get(this.selectors.assignedTechnicianSelect, { timeout: 10000 })
      .should("be.visible")
      .select("External,Service");
  }

  checkImmunoChem() {
    cy.get(this.selectors.immunoChemReferCheckbox, { timeout: 10000 })
      .should("be.visible")
      .check();
  }

  chckImmunoChemOption() {
    cy.get(this.selectors.immunoChemTestSelect, { timeout: 10000 })
      .should("be.visible")
      .select("Anti-CD 5(Immunohistochemistry specimen)");
  }

  addImmunoChemReport() {
    cy.get(this.selectors.reportSelect, { timeout: 10000 })
      .should("be.visible")
      .select("Immunohistochemistry Report");
  }

  checkReadyForRelease() {
    cy.get(this.selectors.readyForReleaseCheckbox, { timeout: 10000 })
      .should("be.visible")
      .check({ force: true });
  }

  statusFilter() {
    cy.get(this.selectors.statusFilterSelect, { timeout: 15000 })
      .should("be.visible")
      .select("Completed");
  }
}

export default DashBoardPage;
