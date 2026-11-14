// HU-07, HU-09 y HU-10 · Filtrado, detalle y búsqueda de recetas
// Casos del plan corregido: CP-022, CP-023, CP-025, CP-030, CP-031, CP-032, CP-033, CP-034, CP-061
import recetas from '../pages/RecetasPage';
import detalle from '../pages/DetalleRecetaPage';
import casos from '../fixtures/casos.json';

describe('HU-07 · Filtrado de recetas seguras', () => {
  beforeEach(() => {
    cy.iniciarSesionComoLaura();
    cy.simularBackend();
  });

  it('CP-022 Receta con ingrediente restringido se excluye', () => {
    const c = casos['CP-022'];
    recetas.visitar();
    recetas.seccionRecetasSeguras().find('button').should('have.length.greaterThan', 0);
    recetas.seccionRecetasSeguras().should('not.contain', c.recetaNoSegura);
  });

  it('CP-023 Receta segura se muestra', () => {
    const c = casos['CP-023'];
    recetas.visitar();
    recetas.tarjeta(recetas.seccionRecetasSeguras(), c.recetaSegura)
      .should('be.visible')
      .and('contain', c.etiqueta);
  });

  it('CP-025 Estado vacío cuando ninguna receta es compatible', () => {
    const c = casos['CP-025'];
    cy.simularBackend({ sinRecetasSeguras: true });
    recetas.visitar();
    recetas.estadoVacio(recetas.seccionRecetasSeguras()).should('have.text', c.titulo);
    recetas.seccionRecetasSeguras().should('contain', c.descripcion);
    recetas.seccionRecetasSeguras().find('[role="alert"]').should('not.exist');
  });
});

describe('HU-09 · Detalle de receta', () => {
  beforeEach(() => {
    cy.iniciarSesionComoLaura();
    cy.simularBackend();
  });

  it('CP-030 Detalle de receta segura', () => {
    const c = casos['CP-030'];
    recetas.visitar();
    recetas.abrirReceta(c.receta);

    cy.location('pathname').should('match', /^\/recipes\/\d+$/);
    detalle.titulo().should('have.text', c.receta);
    cy.contains(c.descripcion).should('be.visible');
    detalle.dato('Calorías').should('contain', c.calorias);
    detalle.dato('Preparación').should('contain', c.preparacion);
    detalle.dato('Nivel de salud').should('contain', c.nivel);
    detalle.seccionIngredientes().should('be.visible');
    detalle.avisoCompatibilidad().should('contain', c.aviso);
  });

  it('CP-031 Advertencia de ingrediente no seguro', () => {
    const c = casos['CP-031'];
    detalle.visitar(c.id);

    detalle.titulo().should('have.text', c.receta);
    detalle.avisoCompatibilidad().should('contain', c.aviso).and('contain', c.ingredientes);
    detalle.botonVerAlternativas().click();
    detalle.ventana().should('be.visible').and('contain', c.ventana);
  });

  it('CP-032 Receta inexistente', () => {
    const c = casos['CP-032'];
    detalle.visitar(c.id);

    cy.contains(c.mensaje).should('be.visible');
    detalle.botonVolver().should('be.visible');
  });
});

describe('HU-10 · Búsqueda de recetas', () => {
  beforeEach(() => {
    cy.iniciarSesionComoLaura();
    cy.simularBackend();
    recetas.visitar();
  });

  it('CP-033 Búsqueda con coincidencias', () => {
    const c = casos['CP-033'];
    recetas.buscar(c.texto);
    recetas.tarjeta(recetas.seccionResultados(), c.receta).should('be.visible');
  });

  it('CP-034 Búsqueda no devuelve recetas restringidas', () => {
    const c = casos['CP-034'];
    recetas.buscar(c.texto);
    recetas.seccionResultados().should('be.visible');
    c.recetasRestringidas.forEach((nombre) => recetas.seccionResultados().should('not.contain', nombre));
    recetas.estadoVacio(recetas.seccionResultados()).should('have.text', c.vacio);
  });

  it('CP-061 Búsqueda sin coincidencias', () => {
    const c = casos['CP-061'];
    recetas.buscar(c.texto);
    recetas.estadoVacio(recetas.seccionResultados()).should('have.text', c.vacio);
    recetas.seccionResultados().contains('button', c.boton).should('be.visible');
  });
});
