//используется в кастомной команде changePassword

export class AccountPage {
  elements = {
    newPasswordField: () => cy.get('input[name="password"]'),
    confirmPasswordField: () => cy.get('input[name="confirm_password"]'),
    submitButton: () => cy.get(".layout-row-end > .btn-service"),
    logoutButton: () => cy.contains("Выйти из профиля"),
  };
}
