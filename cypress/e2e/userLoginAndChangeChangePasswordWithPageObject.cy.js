import { faker } from "@faker-js/faker";
import { LoginPage } from "../fixtures/pages/loginPage"; // импорт файла с классом LoginPage

//юзер после смены пароля не может зайти под старым
describe("santa login - UI", () => {
  const loginPage = new LoginPage(); //обращаемся к классу LoginPage
  const user = Cypress.env("users").userAuthor;
  const newPassword = faker.internet.password(8);

  it("User cannot login with old password after password change", () => {
    cy.visit("/login");
    loginPage.login(user.email, user.password); //вызов метода login из класса LoginPage и логинимся
    cy.contains(user.name).should("exist"); //проверка
    cy.changePassword(user.name, newPassword); //вызов кастомной команды смены пароля + логаут
    cy.visit("/login");
    loginPage.login(user.email, user.password); //попытка залогиниться со старым паролем
    cy.contains("Неверное имя пользователя или пароль").should("exist");
  });

  //возвращаем первоначальный пароль, чтобы тест сохранил работоспособность
  after(() => {
    cy.visit("/login");
    loginPage.login(user.email, newPassword);
    cy.changePassword(user.name, user.password);
  });
});
