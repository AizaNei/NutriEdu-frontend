// Configuración de Cypress · pruebas automatizadas de NutriEdu
// Las pruebas abren el frontend de NutriEdu (npm run dev) y responden las llamadas a la API
// con el servidor simulado de cypress/support/servidor-simulado.js.
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1366,
    viewportHeight: 900,
    defaultCommandTimeout: 8000,
    video: true,
    screenshotOnRunFailure: true,
    retries: { runMode: 0, openMode: 0 },
  },
  // Reporte JUnit (XML) por archivo de pruebas: scripts/generar-reporte.js lo convierte en
  // reportes/reporte-ejecucion.html y llena la columna de resultados de la matriz de trazabilidad.
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'reportes/junit/resultado-[hash].xml',
    toConsole: false,
  },
  // Datos públicos de la demostración (no son secretos): cuentas que reconoce el servidor simulado
  expose: {
    cuentas: {
      usuarioEmail: 'laura@nutriedu.test',
      usuarioPassword: 'Nutri#Edu2026',
      adminEmail: 'admin@nutriedu.test',
      adminPassword: 'Admin#Nutri2026',
    },
  },
});
