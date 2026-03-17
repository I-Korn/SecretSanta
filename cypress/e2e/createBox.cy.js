import { faker } from "@faker-js/faker";
import { LoginPage } from "../fixtures/pages/loginPage";

const users = Cypress.env("users");
const createBoxPage = require("../fixtures/pages/createBoxPage.json");
const generalElements = require("../fixtures/pages/general.json");
const dashboardPage = require("../fixtures/pages/dashboardPage.json");
const invitePage = require("../fixtures/pages/invitePage.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const inviteeFirstPage = require("../fixtures/pages/inviteeFirstPage.json");

describe("User can create a box and run it", () => {
  // before-hook: пользователь-автор логинится
  // 1. Пользователь-автор создает коробку
  // 2. Ссылка-приглашение сохраняется в переменную
  // 3. Пользователь 2 заходит по ссылке-приглашению, логинится, заполняет анкету
  // 4. Пользователь 3 заходит по ссылке-приглашению, логинится, заполняет анкету
  // 5. Пользователь 4 заходит по ссылке-приглашению, логинится, заполняет анкету
  // 6. Пользователь-автор логинится и запускает жеребьевку
  // after-hook: возврат к исхоному состоянию - удаление коробки через метод API

  const loginPage = new LoginPage();
  const newBoxName = faker.word.noun(5);
  const wishes =
    faker.word.noun() + faker.word.adverb() + faker.word.adjective();
  const minAmount = 50;
  const maxAmount = 500;
  const currency = "Евро";
  let inviteLink;
  let boxID;

  before(() => {
    cy.visit("/login");
    loginPage.login(users.userAuthor.email, users.userAuthor.password);
  });

  it("1. userAuthor create a box", () => {
    cy.contains("Создать коробку").should("be.visible").click({ force: true });
    cy.get(createBoxPage.boxNameField).type(newBoxName);

    cy.get(createBoxPage.boxIdField) // достает ID коробки и сохраняет в переменную для последующего удаления коробки в after
      .invoke("val")
      .should("be.not.empty")
      .then((ID) => {
        boxID = ID;
      });

    cy.get(generalElements.arrowRight).click({ force: true });
    cy.get(createBoxPage.fivethIcon).click({ force: true });
    cy.get(generalElements.arrowRight).click({ force: true });
    cy.get(createBoxPage.giftPriceToggle).check({ force: true });
    cy.get(createBoxPage.minAmount).type(minAmount);
    cy.get(createBoxPage.maxAmount).type(maxAmount);
    cy.get(createBoxPage.currency).select(currency);
    cy.get(generalElements.arrowRight).click({ force: true });
    cy.contains("Доп. настройки").should("be.visible");
    cy.get(generalElements.arrowRight).click({ force: true });
    cy.get(dashboardPage.createdBoxName).should("have.text", newBoxName); //проверяем, что название созданной коробки есть на странице с коробками
    cy.get(".toggle-menu-item span") // еще одна проверка содержания страницы созданной коробки
      .invoke("text")
      .then((text) => {
        expect(text).to.include("Участники");
        expect(text).to.include("Моя карточка");
        expect(text).to.include("Подопечный");
      });
  });

  it("2. userAuthor add participants", () => {
    cy.get(generalElements.submitButton).click();
    cy.get(invitePage.inviteLink)
      .invoke("text")
      .then((link) => {
        inviteLink = link;
      });
    cy.clearCookies(); //очистка куков, чтобы по приглашению зайти под следующим участником коробки
  });

  it("3. approve as user2", () => {
    cy.visit(inviteLink);
    cy.get(generalElements.submitButton).click();
    cy.get(inviteeFirstPage.entranceButton).click();
    loginPage.login(users.user2.email, users.user2.password);
    cy.createParticipantsCard(wishes);
    cy.clearCookies();
  });

  it("4. approve as user3", () => {
    cy.visit(inviteLink);
    cy.get(generalElements.submitButton).click();
    cy.get(inviteeFirstPage.entranceButton).click();
    loginPage.login(users.user3.email, users.user3.password);
    cy.createParticipantsCard(wishes);
    cy.clearCookies();
  });

  it("5. approve as user4", () => {
    cy.visit(inviteLink);
    cy.get(generalElements.submitButton).click();
    cy.get(inviteeFirstPage.entranceButton).click();
    loginPage.login(users.user4.email, users.user4.password);
    cy.createParticipantsCard(wishes);
    cy.clearCookies();
  });

  it("6. user 1 logins and start box", () => {
    cy.visit("/login");
    loginPage.login(users.userAuthor.email, users.userAuthor.password);
    cy.get(boxPage.boxCard).click();
    cy.get(boxPage.goToStartButton).click({ force: true });
    cy.get(generalElements.submitButton).click();
    cy.get(boxPage.submitButton).click();
    cy.get(boxPage.successfullNotice)
      .invoke("text")
      .then((text) => {
        expect(text).to.include("Жеребьевка проведена");
      });
  });

  after(() => {
    if (!boxID) {
      // если boxID не сохранился - закончить тест без падения
      cy.log("No boxID found, skip cleanup");
      return;
    }

    cy.request({
      method: "DELETE",
      url: `/api/box/${boxID}`,
      auth: {
        username: users.userAuthor.email,
        password: users.userAuthor.password,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
