class BarcodeConfigPage {
  constructor() {}

  captureDefaultOrder() {
    cy.get("#order").clear().type("2");
  }

  captureDefaultSpecimen() {
    cy.get("#specimen").clear().type("1");
  }

  captureMaxOrder() {
    cy.get("#maxOrder").clear().type("10");
  }

  captureMaxSpecimen() {
    cy.get("#maxSpecimen").clear().type("1");
  }

  checkCheckBoxes() {
    cy.contains("span", "Collection Date and Time").click();
    cy.contains("span", "Collected By").click();
    cy.contains("span", "Tests").click();
    cy.contains("span", "Patient Sex").click();
    cy.get("#checkBox").check();
  }

  dimensionsBarCodeLabel() {
    cy.get("#height-order").clear().type("25.4");
    cy.get("#height-specimen").clear().type("25.4");
    cy.get("#width-order").clear().type("76.2");
    cy.get("#width-specimen").clear().type("76.2");
    cy.get("#height-block").clear().type("25.4");
    cy.get("#height-slide").clear().type("25.4");
    cy.get("width-block").clear().type("76.4");
    cy.get("width-slide").clear().type("76.4");
  }

  saveChanges() {
    cy.get("#saveButton").should("be.visible").click();
  }
}

export default BarcodeConfigPage;
