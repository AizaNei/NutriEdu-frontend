// Page Object: detalle de una receta (/recipes/:id)
class DetalleRecetaPage {
  visitar(id) {
    cy.visit(`/recipes/${id}`);
  }

  titulo() { return cy.get('h1'); }
  /** Aviso de compatibilidad (verde si es compatible, rojo si hay ingredientes a revisar) */
  avisoCompatibilidad() { return cy.get('section[aria-labelledby="recipe-safety-title"]'); }
  dato(etiqueta) { return cy.contains(etiqueta).parent(); }
  seccionIngredientes() { return cy.contains('h2', 'Ingredientes'); }
  botonVerAlternativas() { return cy.contains('button', 'Ver alternativas'); }
  ventana() { return cy.get('[role="dialog"]'); }
  botonVolver() { return cy.contains('Volver a recetas'); }
}

export default new DetalleRecetaPage();
