import { faker } from "@faker-js/faker";
import { LoginPage } from "../fixtures/pages/loginPage";

//юзер после смены пароля не может зайти под старым
describe("santa login - UI", () => {
  const loginPage = new LoginPage();
  const newPassword = faker.internet.password(8);

  it("User cannot login with old password after password change", () => {
    cy.visit("/login");
    loginPage.login(user.email, user.password);
    cy.contains(user.name).should("exist");
    cy.changePassword(user.name, newPassword);
    cy.visit("/login");
    loginPage.login(user.email, user.password);
    cy.contains("Неверное имя пользователя или пароль").should("exist");
  });

  //возвращаем первоначальный пароль, чтобы тест сохранил работоспособность
  after(() => {
    cy.visit("/login");
    loginPage.login(user.email, newPassword);
    cy.changePassword(user.name, user.password);
  });
});
