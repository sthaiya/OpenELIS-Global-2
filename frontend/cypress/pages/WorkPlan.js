import HomePage from "./HomePage";

class WorkPlan {
  constructor() {}

  visit() {
    cy.visit("/WorkplanByTest");
  }
  getWorkPlanFilterTitle(tiles) {
    cy.contains("h3", tiles).should("be.visible");
  }

  selectDropdownOption(option) {
    cy.get("select#select-1").should("be.visible").select(option);
  }

  getPrintWorkPlanButton() {
    cy.contains("Print Workplan").should("be.visible");
  }
  getWorkPlanResultsTable() {
    cy.get('[data-cy="workplanResultsTable"]');
  }
}
export default WorkPlan;
