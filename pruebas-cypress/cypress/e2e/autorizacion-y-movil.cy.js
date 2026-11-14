// HU-17 y HU-19 · Autorización por rol y uso en móvil
// Casos del plan corregido: CP-051, CP-056
import casos from '../fixtures/casos.json';

describe('HU-17 · Autorización del panel administrativo', () => {
  it('CP-051 Usuario normal no accede al panel', () => {
    const c = casos['CP-051'];
    cy.iniciarSesionComoLaura();
    cy.simularBackend();
    cy.visit(c.ruta);

    cy.location('pathname').should('eq', c.redireccion);
    cy.contains('h1', 'Administración').should('not.exist');
  });
});

describe('HU-19 · Uso en pantalla de móvil', () => {
  it('CP-056 Uso en pantalla de móvil', () => {
    const c = casos['CP-056'];
    cy.viewport(c.ancho, c.alto);
    cy.iniciarSesionComoLaura();
    cy.simularBackend();

    c.paginas.forEach(({ ruta, titulo }) => {
      cy.visit(ruta);
      cy.contains('h1', titulo).should('be.visible');
      cy.document().then((doc) => {
        const { scrollWidth, clientWidth } = doc.documentElement;
        expect(scrollWidth, `sin desplazamiento horizontal en ${ruta}`).to.be.at.most(clientWidth);
      });
    });
  });
});
