class DashBoardPage {
  constructor() {}

  searchPatient() {
    cy.get("#local_search").click();
  }

  checkPatientRadio() {
    cy.get("label.cds--radio-button__label")
      .first()
      .find("span.cds--radio-button__appearance")
      .click();
  }

  clickNext() {
    cy.get(".forwardButton").click();
  }

  selectHistopathology() {
    cy.get("#additionalQuestionsSelect").select("Histopathology");
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
    cy.get("#sampleId_0").select("Histopathology Specimen");
    //cy.get("#panel_0_1").click();
  }

  checkPathologyPanel() {
    cy.get("label.cds--checkbox-label", "Histopathology examination");
  }

  generateLabNo() {
    cy.contains("a.cds--link", "Generate").click();
  }

  selectSite(siteName) {
    cy.get("#siteName").type(siteName);
    cy.contains(".suggestions", siteName).click();
    cy.wait(200);
  }

  selectRequesting(requesting) {
    cy.get("#requesterId").type(requesting);
    cy.contains(".suggestions", requesting).click();
    cy.wait(200);
    //cy.get("#requesterFirstName").type(order.requester.firstName);
    //cy.get("#requesterLastName").type(order.requester.firstName);
  }

  submitButton() {
    cy.contains("button.forwardButton", "Submit").should("be.visible").click();
  }

  clickPrintBarCode() {
    cy.contains("button.cds--btn--primary", "Print Barcode").should(
      "be.visible",
    );
  }

  saveOrder() {
    cy.get("#pathology_save2").click();
  }

  changeStatus(status) {
    cy.get("#status").select(status);
  }

  selectPathologist(pathologist) {
    cy.get("#assignedPathologist").select(pathologist);
  }
}

export default DashBoardPage;
