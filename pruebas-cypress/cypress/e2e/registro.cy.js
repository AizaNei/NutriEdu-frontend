// HU-01 · Registro de usuarios
// Casos del plan corregido: CP-001, CP-002, CP-003, CP-004, CP-005, CP-058, CP-059, CP-060
import registro from '../pages/RegistroPage';
import casos from '../fixtures/casos.json';

describe('HU-01 · Registro', () => {
  beforeEach(() => {
    cy.simularBackend();
    cy.intercept('POST', '**/api/users/register').as('registro');
    registro.visitar();
  });

  it('CP-001 Registro con datos válidos', () => {
    const c = casos['CP-001'];
    registro.llenar(c);
    registro.registrarse();

    cy.wait('@registro').its('response.statusCode').should('eq', 201);
    registro.mensaje().should('contain.text', c.mensaje);
    cy.location('pathname').should('eq', c.ruta);
  });

  it('CP-002 Registro con correo duplicado', () => {
    const c = casos['CP-002'];
    registro.llenar(c);
    registro.registrarse();

    cy.wait('@registro').its('response.statusCode').should('eq', 400);
    registro.mensaje().should('contain.text', c.mensaje);
    cy.location('pathname').should('eq', c.ruta);
  });

  it('CP-003 Registro con campos vacíos', () => {
    const c = casos['CP-003'];
    registro.botonRegistrarse().should('be.disabled');
    registro.campoNombre().then(($el) => expect($el[0].validity.valueMissing, 'nombre obligatorio').to.eq(true));
    registro.campoCorreo().then(($el) => expect($el[0].validity.valueMissing, 'correo obligatorio').to.eq(true));
    registro.campoPassword().then(($el) => expect($el[0].validity.valueMissing, 'contraseña obligatoria').to.eq(true));
    cy.get('@registro.all').should('have.length', 0);
    cy.location('pathname').should('eq', c.ruta);
  });

  it('CP-004 Contraseña de 9 caracteres (valor límite)', () => {
    const c = casos['CP-004'];
    expect(c.password, 'dato de prueba').to.have.length(9);
    registro.llenar(c);

    registro.marcaDeRequisito(c.requisito).should('have.text', '○');
    registro.resumenRequisitos().should('have.text', c.mensaje);
    registro.botonRegistrarse().should('be.disabled');
  });

  it('CP-058 Contraseña de exactamente 10 caracteres (valor límite)', () => {
    const c = casos['CP-058'];
    expect(c.password, 'dato de prueba').to.have.length(10);
    registro.llenar(c);

    registro.marcaDeRequisito('Al menos 10 caracteres').should('have.text', '✓');
    registro.resumenRequisitos().should('have.text', c.mensaje);
    registro.botonRegistrarse().should('be.enabled');
  });

  it('CP-059 Contraseña de exactamente 72 caracteres (valor límite)', () => {
    const c = casos['CP-059'];
    expect(c.password, 'dato de prueba').to.have.length(72);
    registro.llenar(c);

    registro.marcaDeRequisito('Máximo 72 caracteres').should('have.text', '✓');
    registro.resumenRequisitos().should('have.text', c.mensaje);
    registro.botonRegistrarse().should('be.enabled');
  });

  it('CP-060 Contraseña de 73 caracteres (valor límite)', () => {
    const c = casos['CP-060'];
    expect(c.password, 'dato de prueba').to.have.length(73);
    registro.llenar(c);

    // El campo tiene un límite de 72 caracteres: el carácter 73 no se escribe
    registro.campoPassword().invoke('val').should('have.length', c.longitudMaxima);
    registro.campoConfirmacion().invoke('val').should('have.length', c.longitudMaxima);
    registro.marcaDeRequisito(c.requisito).should('have.text', '✓');
  });

  it('CP-005 Registro con correo de formato inválido', () => {
    const c = casos['CP-005'];
    registro.llenar(c);
    registro.registrarse();

    registro.campoCorreo().then(($el) => {
      expect($el[0].validity.typeMismatch, 'formato de correo inválido').to.eq(true);
      expect($el[0].validationMessage, 'aviso del navegador').not.to.be.empty;
    });
    cy.get('@registro.all').should('have.length', 0);
    cy.location('pathname').should('eq', c.ruta);
  });
});
