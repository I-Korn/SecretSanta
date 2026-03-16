import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { LoginPage } from "../../fixtures/pages/loginPage";
const user = Cypress.env("users").userAuthor;

Given("user is on secret sanra login page", function () {
  cy.visit("/login");
});

When("user logs in", function () {
  const loginPage = new LoginPage();

  loginPage.login(user.email, user.password);
});

Then("user is on dashboard page", function () {
  cy.contains("Создать коробку").should("be.visible");
});
