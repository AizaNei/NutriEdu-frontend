// Ejecuta toda la suite y genera el reporte, aunque haya pruebas fallidas.
// Uso: npm run pruebas            (navegador Electron, sin ventana)
//      npm run pruebas:chrome     (Chrome)
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
for (const carpeta of ['reportes/junit', 'cypress/screenshots', 'cypress/videos']) {
  fs.rmSync(path.join(raiz, carpeta), { recursive: true, force: true });
}

const extra = process.argv.slice(2);
const cypress = spawnSync('npx', ['cypress', 'run', '--e2e', ...extra], { cwd: raiz, stdio: 'inherit', shell: true });

const reporte = spawnSync(process.execPath, [path.join(__dirname, 'generar-reporte.js')], { cwd: raiz, stdio: 'inherit' });
process.exit(cypress.status ?? reporte.status ?? 1);
