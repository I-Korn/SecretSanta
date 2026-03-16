import { faker } from "@faker-js/faker";
import { LoginPage } from "../fixtures/pages/loginPage"; // импорт файла с классом LoginPage

//юзер после смены пароля не может зайти под старым
describe("santa login - UI and API", () => {
  const loginPage = new LoginPage(); //обращаемся к классу LoginPage
  const user = Cypress.env("users").userAuthor;

  it("user cannot login with old password - API, UI", () => {
    const newPassword = faker.internet.password(8);

    //кастомная команда смены пароля через API
    cy.changePasswordAPI(newPassword);

    //вход под новым паролем
    cy.visit("/login");
    loginPage.login(user.email, newPassword);

    //вход в профиль (тк там кнопка для разлогина) и разлогин
    cy.contains(user.name).click({ force: true });
    cy.contains("Выйти из профиля").click();

    //попытка залогиниться со старым паролем
    cy.visit("/login");
    loginPage.login(user.email, user.password);
    cy.contains("Неверное имя пользователя или пароль").should("exist");
  });

  //возвращаем старый пароль, чтобы тест сохранил работоспособность
  after(() => {
    cy.changePasswordAPI(user.password);
  });
});
