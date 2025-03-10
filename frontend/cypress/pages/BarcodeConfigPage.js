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
}

export default BarcodeConfigPage;
