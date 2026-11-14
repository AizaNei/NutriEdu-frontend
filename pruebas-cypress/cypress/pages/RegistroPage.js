// Page Object: pantalla de registro (/register)
class RegistroPage {
  visitar() {
    cy.visit('/register');
  }

  campoNombre() { return cy.get('input[name="nombre"]'); }
  campoCorreo() { return cy.get('input[name="email"]'); }
  campoPassword() { return cy.get('input[name="password"]'); }
  campoConfirmacion() { return cy.get('input[name="confirmPassword"]'); }
  botonRegistrarse() { return cy.contains('button', 'Registrarse'); }

  /** Lista de requisitos de la contraseña */
  requisitos() { return cy.get('#register-password-requirements'); }
  resumenRequisitos() { return this.requisitos().find('p').first(); }
  /** Marca de un requisito: '✓' si se cumple, '○' si no */
  marcaDeRequisito(texto) { return this.requisitos().contains('li', texto).find('span'); }

  /** Mensaje de estado (éxito o error) que muestra el formulario */
  mensaje() { return cy.get('[role="status"], [role="alert"]'); }

  llenar({ nombre, correo, password }) {
    if (nombre) this.campoNombre().type(nombre);
    if (correo) this.campoCorreo().type(correo);
    if (password) {
      this.campoPassword().type(password, { log: false, delay: 0 });
      this.campoConfirmacion().type(password, { log: false, delay: 0 });
    }
  }

  registrarse() {
    this.botonRegistrarse().click();
  }
}

export default new RegistroPage();
