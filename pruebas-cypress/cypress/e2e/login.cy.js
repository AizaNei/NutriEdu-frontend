// HU-02 · Inicio de sesión
// Casos del plan corregido: CP-007, CP-008, CP-009, CP-010
import login from '../pages/LoginPage';
import casos from '../fixtures/casos.json';

describe('HU-02 · Inicio de sesión', () => {
  beforeEach(() => {
    cy.simularBackend();
    cy.intercept('POST', '**/api/users/login').as('login');
  });

  it('CP-007 Login con credenciales correctas', () => {
    const c = casos['CP-007'];
    login.visitar();
    login.iniciarSesion(c.correo, c.password);

    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.location('pathname').should('eq', c.ruta);
    cy.contains('h1', c.titulo).should('be.visible');
    login.token().should('be.a', 'string').and('not.be.empty');
  });

  it('CP-008 Login con contraseña incorrecta', () => {
    const c = casos['CP-008'];
    login.visitar();
    login.iniciarSesion(c.correo, c.password);

    cy.wait('@login').its('response.statusCode').should('eq', 401);
    cy.location('pathname').should('eq', c.ruta);
    login.token().should('be.null');
    // HU-02 CA2: el mensaje no debe indicar cuál campo falló
    login.mensajeError().should('be.visible').invoke('text').then((texto) => {
      c.mensajesQueRevelanCampo.forEach((m) => expect(texto, 'mensaje genérico').not.to.contain(m));
    });
  });

  it('CP-009 Login con campos vacíos', () => {
    const c = casos['CP-009'];
    login.visitar();
    login.botonIniciarSesion().click();

    login.campoCorreo().then(($el) => expect($el[0].validity.valueMissing, 'correo obligatorio').to.eq(true));
    login.campoPassword().then(($el) => expect($el[0].validity.valueMissing, 'contraseña obligatoria').to.eq(true));
    cy.get('@login.all').should('have.length', 0);
    cy.location('pathname').should('eq', c.ruta);
  });

  it('CP-010 Acceso a ruta privada sin sesión', () => {
    const c = casos['CP-010'];
    cy.visit(c.rutaPrivada);

    cy.location('pathname').should('eq', c.ruta);
    cy.contains('h1', 'Planificador semanal').should('not.exist');
  });
});
