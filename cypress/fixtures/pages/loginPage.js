export class LoginPage {
  elements = {
    loginField: () => cy.get('input[name="email"]'),
    passwordField: () => cy.get('input[name="password"]'),
    loginButton: () => cy.get(".btn-main"),
  };

  login(login, password) {
    // метод, который вз/действует с элементами
    this.elements.loginField().type(login);
    this.elements.passwordField().type(password);
    this.elements.loginButton().click({ force: true });
  }
}

// пошаговый процесс логина:
//     inputLogin(login) {
//         this.elements.loginField().type(login);
//             };

//     inputPassword(password) {
//         this.elements.passwordField().type(password);
//             };

//     submitLogin() {
//         this.elements.loginButton().click();
//     }
//
