class DashBoardPage {
  constructor() {}

  searchPatientByFName() {
    cy.get("#firstName").type("John");
  }
  searchPatient() {
    cy.get("#local_search").click();
  }

  checkPatientRadio() {
    cy.get("table tbody tr").first().find("td label span").click();
  }

  clickNext() {
    cy.get(".forwardButton").click();
  }

  selectHistopathology() {
    cy.get("#additionalQuestionsSelect").select("Histopathology");
  }

  selectImmunoChem() {
    cy.get("#additionalQuestionsSelect").select("Immunohistochemistry");
  }

  selectCytology(){
    cy.get("#additionalQuestionsSelect").select("Cytology");
  }

  selectFluidSample(){ 
    cy.get("#sampleId_0")
      .should("be.visible")
      .select("Fluid");    
  }

  checkCovidPanel(){
    cy.contains(
      "label.cds--checkbox-label",
      "COVID-19 PCR",
    ).click();
  }

  selectSpecimen() {
    cy.get(".cds--select-input__wrapper > .cds--select-input").select(
      "APPENDIX",
    );
  }

  specimenType() {
    cy.get(".cds--select-input__wrapper > .cds--select-input").select("Biopsy");
  }

  procedurePerformed() {
    cy.get(".cds--select-input__wrapper > .cds--select-input").select(
      "Core Biopsy",
    );
  }

  selectPathologySample() {
    cy.get("#sampleId_0")
      .should("be.visible")
      .select("Histopathology specimen");
    //cy.get("#panel_0_1").click();
  }

  selectImmunoChemSample() {
    cy.get("#sampleId_0")
      .should("be.visible")
      .select("Immunohistochemistry Specimen");
  }

  checkImmunoChemTest() {
    cy.get("#test_0_339").check();
  }
  checkPathologyPanel() {
    cy.contains(
      "label.cds--checkbox-label",
      "Histopathology examination",
    ).click();
  }

  generateLabNo() {
    cy.contains("a.cds--link", "Generate").click();
  }

  selectSite() {
    cy.get("#siteName").type("279 - CAMES");
    cy.wait(100);
    cy.contains(".suggestion-active", "279 - CAMES").click();
    cy.wait(200);
  }

  selectRequesting() {
    cy.get("#requesterId").type("Optimus");
    cy.contains(".suggestion-active", "Optimus").click();
    cy.wait(200);
    //cy.get("#requesterFirstName").type(order.requester.firstName);
    //cy.get("#requesterLastName").type(order.requester.firstName);
  }

  submitButton() {
    cy.contains(".forwardButton", "Submit").should("be.visible").click();
  }

  clickPrintBarCode() {
    cy.contains("button.cds--btn--primary", "Print Barcode").should(
      "be.visible",
    );
  }

  selectFirstOrder() {
    cy.get('tbody[aria-live="polite"] > tr').first().click();
  }

  saveOrder() {
    cy.get("#pathology_save2").click();
  }

  changePathologyStatus() {
    cy.get("#status").select("Processing");
  }

  selectStatus() {
    cy.get("#status").select("Completed");
  }
  selectPathologist() {
    cy.get("#assignedPathologist").select("ELIS,Open");
  }

  selectTechnician() {
    cy.get("assignedTechnician").select("External,Service");
  }

  checkImmunoChem() {
    cy.get("#referToImmunoHistoChemistry").check();
    cy.get("#ihctest-input").select("Anti-CD 5(Immunohistochemistry specimen)");
  }

  addImmunoChemReport() {
    cy.get("#report").select("Immunohistochemistry Report");
  }

  toggleReportParam() {
    cy.contains(".cds--toggle-text", "off").click();
  }

  checkReadyForRelease() {
    cy.get("#release").check();
  }

  statusFilter() {
    cy.get("#statusFilter").select("Completed");
  }
}

export default DashBoardPage;
