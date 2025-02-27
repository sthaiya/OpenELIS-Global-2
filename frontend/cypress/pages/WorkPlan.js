import HomePage from "./HomePage";

class WorkPlan {
  constructor() {}

  visit() {
    cy.visit("/WorkplanByTest");
  }
  getWorkPlanFilterTitle() {
    return cy.get("h3");
  }

  getTestTypeOrPanelSelector() {
    return cy.get("select#select-1");
  }

  getPrintWorkPlanButton() {
    return cy.contains("#print", "Print Workplan");
  }
  getWorkPlanResultsTable() {
    return cy.contains("table", '[data-cy="workplanResultsTable"]');
  }
}
export default WorkPlan;
