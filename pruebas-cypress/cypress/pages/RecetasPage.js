// Page Object: catálogo y búsqueda de recetas (/recipes)
class RecetasPage {
  visitar() {
    cy.visit('/recipes');
  }

  titulo() { return cy.contains('h1', 'Recetas'); }
  /** Secciones de la página: "Recetas seguras", "Recomendadas para ti" o "Resultados" */
  seccion(nombre) { return cy.get(`section[aria-labelledby="section-${nombre.replaceAll(' ', '-').toLowerCase()}"]`); }
  seccionRecetasSeguras() { return this.seccion('Recetas seguras'); }
  seccionResultados() { return this.seccion('Resultados'); }

  /** Tarjeta de una receta dentro de una sección (la tarjeta es un botón) */
  tarjeta(seccion, nombreReceta) { return seccion.contains('button', nombreReceta); }
  estadoVacio(seccion) { return seccion.find('h3'); }

  buscador() { return cy.get('input[type="search"]'); }
  buscar(texto) { this.buscador().clear().type(texto); }

  abrirReceta(nombreReceta) {
    this.seccionRecetasSeguras().contains('h3', nombreReceta).click();
  }
}

export default new RecetasPage();
