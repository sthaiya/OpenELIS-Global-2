import HomePage from "./HomePage";
import TestProperties from "../common/TestProperties";

class LoginPage {
  // Centralized selectors
  selectors = {
    username: "#loginName",
    password: "#password",
    loginButton: "[data-cy='loginButton']",
    userIcon: "#user-Icon",
    logoutButton: "[data-cy='logOut']",
    changePasswordButton: "[data-cy='changePassword']",
    currentPassword: "#current-password",
    newPassword: "#new-password",
    repeatNewPassword: "#repeat-new-password",
    submitNewPasswordButton: "[data-cy='submitNewPassword']",
    exitPasswordResetButton: "[data-cy='exitPasswordReset']",
  };

  testProperties = new TestProperties();

  visit() {
    cy.visit("/login");
  }

  // Getter methods for elements
  getUsernameElement() {
    return cy.get(this.selectors.username);
  }

  getPasswordElement() {
    return cy.get(this.selectors.password);
  }

  // Helper method to type into a field
  typeIntoField(selector, value) {
    cy.get(selector).should("be.visible").clear().type(value);
  }

  // Helper method to click a button
  clickButton(selector) {
    cy.get(selector).should("be.visible").click();
  }

  // Enter username
  enterUsername(value) {
    this.typeIntoField(this.selectors.username, value);
  }

  // Enter password
  enterPassword(value) {
    this.typeIntoField(this.selectors.password, value);
  }

  // Click the login button
  signIn() {
    this.clickButton(this.selectors.loginButton);
  }

  // Sign out
  signOut() {
    this.clickButton(this.selectors.userIcon);
    this.clickButton(this.selectors.logoutButton);
  }

  // Change password flow
  changingPassword() {
    this.clickButton(this.selectors.changePasswordButton);
  }

  enterCurrentPassword(value) {
    this.typeIntoField(this.selectors.currentPassword, value);
  }

  enterNewPassword(value) {
    this.typeIntoField(this.selectors.newPassword, value);
  }

  repeatNewPassword(value) {
    this.typeIntoField(this.selectors.repeatNewPassword, value);
  }

  submitNewPassword() {
    this.clickButton(this.selectors.submitNewPasswordButton);
  }

  clickExitPasswordReset() {
    this.clickButton(this.selectors.exitPasswordResetButton);
  }

  // Clear username and password inputs
  clearInputs() {
    this.getUsernameElement().clear();
    this.getPasswordElement().clear();
  }

  // Navigate to the home page
  goToHomePage() {
    cy.url().then((url) => {
      if (url.includes("/login")) {
        this.enterUsername(this.testProperties.getUsername());
        this.enterPassword(this.testProperties.getPassword());
        this.signIn();
      }
    });
    return new HomePage();
  }
}

export default LoginPage;
