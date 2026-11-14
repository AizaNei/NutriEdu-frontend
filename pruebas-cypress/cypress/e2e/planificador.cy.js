// HU-15 y HU-16 · Planificador semanal y lista de compras
// Casos del plan corregido: CP-045, CP-046, CP-047, CP-049
import planificador from '../pages/PlanificadorPage';
import listaCompras from '../pages/ListaComprasPage';
import casos from '../fixtures/casos.json';

describe('HU-15 · Planificador semanal', () => {
  beforeEach(() => {
    cy.iniciarSesionComoLaura();
  });

  it('CP-045 Guardar plan semanal', () => {
    const c = casos['CP-045'];
    cy.simularBackend({ plan: [] });
    cy.intercept('POST', '**/api/planner').as('guardarPlan');
    planificador.visitar();

    c.comidas.forEach((comida) => planificador.agregar(comida));
    planificador.guardar();

    cy.wait('@guardarPlan').its('request.body.plan').should('have.length', c.comidas.length);
    planificador.mensaje().should('contain', c.mensaje);
    planificador.botonGuardar().should('contain', c.boton);

    cy.reload();
    c.comidas.forEach(({ receta, dia, comida }) => {
      planificador.dia(dia).should('contain', comida).and('contain', receta);
    });
  });

  it('CP-046 Confirmación al reemplazar el plan', () => {
    const c = casos['CP-046'];
    cy.simularBackend({ plan: c.planExistente });
    cy.intercept('POST', '**/api/planner').as('guardarPlan');
    planificador.visitar();
    planificador.botonGuardar().should('contain', 'Plan guardado');

    planificador.agregar(c.nueva);
    planificador.guardar();

    // HU-15 CA3: antes de reemplazar el plan se pide confirmación
    planificador.ventanaConfirmacion().should('be.visible');
    cy.get('@guardarPlan.all').should('have.length', 0);
  });

  it('CP-047 El planificador no ofrece recetas no seguras', () => {
    const c = casos['CP-047'];
    cy.simularBackend();
    planificador.visitar();

    planificador.selectorReceta().find('option').should('contain', c.recetaSegura);
    planificador.selectorReceta().find('option').should('not.contain', c.recetaNoSegura);
  });
});

describe('HU-16 · Lista de compras', () => {
  it('CP-049 Lista de compras con plan vacío', () => {
    const c = casos['CP-049'];
    cy.iniciarSesionComoLaura();
    cy.simularBackend({ plan: [] });
    listaCompras.visitar();

    listaCompras.estadoVacioTitulo().should('have.text', c.titulo);
    listaCompras.estadoVacioDescripcion().should('have.text', c.descripcion);
    listaCompras.errores().should('not.exist');
  });
});
