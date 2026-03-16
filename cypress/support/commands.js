import { AccountPage } from "../fixtures/pages/accountPage"; // импорт файла с классом AccountPage
const generalElements = require("../fixtures/pages/general.json");
const inviteeBoxPage = require("../fixtures/pages/inviteeBoxPage.json");
const inviteeDashboard = require("../fixtures//pages/inviteeDashboard.json");
const users = Cypress.env("users");

//смена пароля на UI
Cypress.Commands.add("changePassword", (userName, newPassword) => {
  const accountPage = new AccountPage(); //обращаемся к классу AccountPage

  cy.contains(userName).click({ force: true });
  accountPage.elements.newPasswordField().type(newPassword);
  accountPage.elements.confirmPasswordField().type(newPassword);
  accountPage.elements.submitButton().click();
  accountPage.elements.logoutButton().click();
});

//смена пароля через API
Cypress.Commands.add("changePasswordAPI", (password) => {
  cy.request({
    method: "PUT",
    headers: {
      Cookie: users.userAuthor.authCookie,
    },
    url: "/api/account/password",
    body: { password: password },
  }).then((response) => {
    expect(response.status).to.eq(200);
  });
});

// создание карточки участника коробки (для теста CreateBox)
Cypress.Commands.add("createParticipantsCard", (wishes) => {
  cy.contains("Создать карточку участника").should("be.visible");
  cy.get(generalElements.submitButton).click({ force: true });
  cy.get(generalElements.arrowRight).click({ force: true });
  cy.get(generalElements.arrowRight).click({ force: true });
  cy.get(inviteeBoxPage.wishlistInpit).type(wishes);
  cy.get(generalElements.arrowRight).click({ force: true });
  cy.get(inviteeDashboard.noticeForInvitee)
    .invoke("text")
    .then((text) => {
      expect(text).to.contain("Это — анонимный чат с вашим Тайным Сантой");
    });
});
