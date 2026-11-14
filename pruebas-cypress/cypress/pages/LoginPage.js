// Page Object: pantalla de inicio de sesión (/login)
class LoginPage {
  visitar() {
    cy.visit('/login');
  }

  campoCorreo() { return cy.get('input[name="email"]'); }
  campoPassword() { return cy.get('input[name="password"]'); }
  botonIniciarSesion() { return cy.contains('button', 'Iniciar sesión'); }
  mensajeError() { return cy.get('[role="alert"]'); }

  iniciarSesion(correo, password) {
    if (correo) this.campoCorreo().type(correo);
    if (password) this.campoPassword().type(password, { log: false });
    this.botonIniciarSesion().click();
  }

  /** Token de sesión que la app guarda en el navegador */
  token() { return cy.window().its('localStorage').invoke('getItem', 'token'); }
}

export default new LoginPage();
