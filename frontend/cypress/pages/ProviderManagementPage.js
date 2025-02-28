class ProviderManagementPage {
  constructor() {}

  clickAddProviderButton() {
    cy.get("[data-cy='add-Button']").should("be.visible").click();
  }

  enterProviderLastName(lastName) {
    cy.get("#lastName").type(lastName);
  }
  enterProviderFirstName(firstName) {
    cy.get("lastName").type(firstName);
  }
  clickActiveDropdown() {
    cy.get("#isActive").select("Yes");
  }

  addProvider() {
    cy.contains("Add").click();
  }
}

export default ProviderManagementPage;
