import HomePage from "./HomePage";

class WorkPlan {
  constructor() {}

  visit() {
    cy.visit("/WorkplanByTest");
  }
  getWorkPlanFilterTitle(tiles) {
    cy.get("h3").should("be.visible").conatains(tiles);
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
