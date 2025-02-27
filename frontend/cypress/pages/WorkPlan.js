import HomePage from "./HomePage";

class WorkPlan {
  constructor() {}

  visit() {
    cy.visit("/WorkplanByTest");
  }
  getWorkPlanFilterTitle() {
    cy.get("h3");
  }

  getTestTypeOrPanelSelector() {
    cy.get("select#select-1");
  }

  getPrintWorkPlanButton() {
    cy.contains("Print Workplan");
  }
  getWorkPlanResultsTable() {
    cy.get('[data-cy="workplanResultsTable"]');
  }
}
export default WorkPlan;
