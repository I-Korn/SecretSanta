import { faker } from "@faker-js/faker";
import { LoginPage } from "../fixtures/pages/loginPage";

//юзер после смены пароля не может зайти под старым
describe("santa login - UI and API", () => {
  const loginPage = new LoginPage();
  const user = Cypress.env("users").userAuthor;

  it("user cannot login with old password - API, UI", () => {
    const newPassword = faker.internet.password(8);

    cy.changePasswordAPI(newPassword);

    cy.visit("/login");
    loginPage.login(user.email, newPassword);

    cy.contains(user.name).click({ force: true });
    cy.contains("Выйти из профиля").click();

    cy.visit("/login");
    loginPage.login(user.email, user.password);
    cy.contains("Неверное имя пользователя или пароль").should("exist");
  });

  //возвращаем старый пароль, чтобы тест сохранил работоспособность
  after(() => {
    cy.changePasswordAPI(user.password);
  });
});
