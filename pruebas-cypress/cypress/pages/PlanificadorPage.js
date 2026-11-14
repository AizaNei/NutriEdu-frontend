// Page Object: planificador semanal (/planner)
class PlanificadorPage {
  visitar() {
    cy.visit('/planner');
  }

  titulo() { return cy.contains('h1', 'Planificador semanal'); }
  selector(etiqueta) { return cy.contains('label', etiqueta).find('select'); }
  selectorReceta() { return this.selector('Receta'); }
  botonAgregar() { return cy.contains('button', /^\s*Agregar\s*$/); }
  botonGuardar() { return cy.contains('button', /Guardar cambios|Plan guardado|Guardando/); }
  mensaje() { return cy.get('[role="status"], [role="alert"]'); }
  ventanaConfirmacion() { return cy.get('[role="dialog"]'); }
  /** Bloque de un día dentro de "Tu semana" */
  dia(nombre) { return cy.get(`section[aria-labelledby="day-${nombre}"]`); }

  agregar({ receta, dia, comida }) {
    this.selectorReceta().select(receta);
    this.selector('Día').select(dia);
    this.selector('Comida').select(comida);
    this.botonAgregar().click();
  }

  guardar() {
    cy.contains('button', 'Guardar cambios').click();
  }
}

export default new PlanificadorPage();
