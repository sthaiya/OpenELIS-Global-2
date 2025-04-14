class OrganizationManagementPage {
  constructor() {}

  clickAddOrganization() {
    cy.get("[data-cy='add-button']").should("be.visible").click();
  }

  addOrgName() {
    cy.get("#org-name").should("be.visible").type("279 - CAMES MAN");
  }

  addParentOrg() {
    cy.get("#parentOrgName").should("be.visible").type("MULAGO");
  }

  saveOrganization() {
    cy.get("#saveButton").should("be.visible").click();
  }
}

export default OrganizationManagementPage;
