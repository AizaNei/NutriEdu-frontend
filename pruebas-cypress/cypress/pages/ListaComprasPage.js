// Page Object: lista de compras (/shopping-list)
class ListaComprasPage {
  visitar() {
    cy.visit('/shopping-list');
  }

  titulo() { return cy.contains('h1', 'Lista de compras'); }
  estadoVacioTitulo() { return cy.contains('h3', 'Tu lista está vacía'); }
  estadoVacioDescripcion() { return this.estadoVacioTitulo().next('p'); }
  errores() { return cy.get('[role="alert"]'); }
}

export default new ListaComprasPage();
