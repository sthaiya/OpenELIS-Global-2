class DashBoardPage {
  addOrder(Program) {
    cy.fixture("Order").then((order) => {
      cy.get("#search-radio-1")
        .click();
      cy.get("#local_search").click();
      cy.get('label.cds--radio-button__label')
        .first()
        .find('span.cds--radio-button__appearance')
        .click();
      cy.get(".forwardButton").click();
      cy.get("#additionalQuestionsSelect").select(Program);
      cy.get(".forwardButton").click();
      cy.get("#sampleId_0").select("Serum");
      cy.get("#panel_0_1").click();
      cy.get(".forwardButton").click();
      cy.contains('a.cds--link', 'Generate').click();
      cy.wait(1000);

      cy.get("#labNo")
        .invoke("val")
        .then((labNoValue) => {
          if (labNoValue) {
            const data = { labNo: labNoValue };
            cy.writeFile("cypress/fixtures/DashBoard.json", data);
          } else {
            cy.log("labNoValue is empty or undefined");
          }
        });

      cy.get("#siteName").type(order.siteName);
      cy.contains('.suggestions', order.siteName).click();
      cy.get("#requesterId").type(order.requester.firstName);
      cy.contains('.suggestions', order.requester.firstName).click();
      cy.wait(200);
      //cy.get("#requesterFirstName").type(order.requester.firstName);
      //cy.get("#requesterLastName").type(order.requester.firstName);
      cy.contains('button.forwardButton', 'Submit').should("be.visible").click();
    });
  }

  checkForHeader(title) {
    cy.get("section > h3").should("have.text", title);
  }

  enterDetails() {
    cy.get(
      ":nth-child(14) > .gridBoundary > :nth-child(1) > .cds--form-item > .cds--text-area__wrapper > .cds--text-area",
    ).type("Test");
    cy.get(
      ":nth-child(2) > .cds--form-item > .cds--text-area__wrapper > .cds--text-area",
    ).type("Test");
  }

  validateOrderStatus(orderNumber, childIndex) {
    cy.get(":nth-child(2) > .cds--link").click();
    cy.get(":nth-child(1) > .tile-value").should("have.text", "0");
    cy.get(`:nth-child(${childIndex}) > .tile-value`).should("have.text", "1");
    cy.get("#statusFilter").select("Completed");
    cy.get("tbody > tr > :nth-child(4)").should("have.text", "John");
  }

  validatePreStatus(order) {
    cy.get(":nth-child(1) > .tile-value").should("have.text", "1");
    cy.get("tbody > tr > :nth-child(4)").should("have.text", "John");
    cy.get("tbody > tr > :nth-child(6)").click();
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
