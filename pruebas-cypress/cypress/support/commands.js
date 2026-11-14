// Comandos personalizados de Cypress para NutriEdu
const { responder, crearEstado } = require('./servidor-simulado');

const cuentas = () => Cypress.expose('cuentas');

/**
 * Reemplaza el backend por el servidor simulado: toda petición a /api la responde Cypress
 * con las respuestas grabadas del backend real. Cada llamada empieza con un estado limpio.
 * Opciones: { plan: [{ recetaId, diaSemana, tipoComida }], sinRecetasSeguras: true }
 */
Cypress.Commands.add('simularBackend', (opciones = {}) => {
  const estado = crearEstado(opciones);
  cy.fixture('respuestas-api').then((fx) => {
    cy.intercept({ url: /^https?:\/\/[^/]+(\/[^?]*)?\/api\// }, (req) => {
      const r = responder(fx, estado, { method: req.method, url: req.url, headers: req.headers, body: req.body }, cuentas());
      if (r.sinDatos) Cypress.log({ name: 'SIN DATOS', message: `${req.method} ${req.url}` });
      req.reply({ statusCode: r.status, body: r.body });
    }).as('api');
  });
});

/**
 * Inicia sesión por la interfaz y guarda la sesión con cy.session:
 * cada prueba puede ejecutarse sola y no repite el login si ya hay sesión guardada.
 */
Cypress.Commands.add('iniciarSesion', (correo, password) => {
  cy.session(['sesion', correo], () => {
    cy.simularBackend();
    cy.visit('/login');
    cy.get('input[name="email"]').type(correo);
    cy.get('input[name="password"]').type(password, { log: false });
    cy.contains('button', 'Iniciar sesión').click();
    cy.location('pathname').should('match', /\/(recipes|profile)$/);
    cy.window().its('localStorage').invoke('getItem', 'token').should('be.a', 'string');
  });
});

Cypress.Commands.add('iniciarSesionComoLaura', () => {
  cy.iniciarSesion(cuentas().usuarioEmail, cuentas().usuarioPassword);
});
