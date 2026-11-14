// Lee los resultados JUnit de Cypress (reportes/junit/*.xml) y genera:
//   reportes/reporte-ejecucion.html  → reporte de ejecución con el resultado de cada prueba
//   docs/matriz-trazabilidad.md      → matriz: ID del caso, criterio, archivo y script, resultado
// No necesita dependencias adicionales.
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const dirJunit = path.join(raiz, 'reportes', 'junit');
const traz = JSON.parse(fs.readFileSync(path.join(raiz, 'docs', 'trazabilidad.json'), 'utf8'));

const desescapar = (s) => s.replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const escapar = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---- Leer resultados ----
const resultados = {};
const archivos = fs.existsSync(dirJunit) ? fs.readdirSync(dirJunit).filter((f) => f.endsWith('.xml')) : [];
for (const f of archivos) {
  const xml = fs.readFileSync(path.join(dirJunit, f), 'utf8');
  const spec = (xml.match(/file="([^"]+)"/) || [])[1] || '';
  const re = /<testcase\b([^>]*?)(\/>|>([\s\S]*?)<\/testcase>)/g;
  let m;
  while ((m = re.exec(xml))) {
    const attrs = m[1];
    const nombre = desescapar((attrs.match(/\bname="([^"]*)"/) || [])[1] || '');
    const tiempo = Number((attrs.match(/\btime="([^"]*)"/) || [])[1] || 0);
    const id = (nombre.match(/CP-\d{3}/) || [])[0];
    if (!id) continue;
    const cuerpo = m[3] || '';
    const fallo = cuerpo.match(/<failure\b[^>]*?message="([^"]*)"/);
    const omitida = /<skipped/.test(cuerpo);
    resultados[id] = {
      estado: fallo ? 'Fallida' : omitida ? 'Omitida' : 'Aprobada',
      mensaje: fallo ? desescapar(fallo[1]) : '',
      tiempo, spec,
    };
  }
}

const fecha = new Date();
const fechaTexto = fecha.toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' });
const filas = traz.map((t) => ({ ...t, r: resultados[t.id] }));
const cuenta = (e) => filas.filter((f) => f.r && f.r.estado === e).length;
const total = filas.length, aprobadas = cuenta('Aprobada'), fallidas = cuenta('Fallida'), sinEjecutar = filas.filter((f) => !f.r).length;
const etiqueta = (f) => (!f.r ? 'Sin ejecutar' : f.r.estado === 'Fallida' && f.bug ? `Fallida (${f.bug})` : f.r.estado);

// ---- Matriz de trazabilidad ----
let md = '# Matriz de trazabilidad · NutriEdu\n\n';
md += `Última ejecución: ${archivos.length ? fechaTexto : 'sin ejecutar'} · ${aprobadas} aprobadas, ${fallidas} fallidas${sinEjecutar ? `, ${sinEjecutar} sin ejecutar` : ''} de ${total} casos automatizados.\n\n`;
md += 'Este archivo lo genera `npm run reporte` a partir de `docs/trazabilidad.json` y de los resultados de Cypress. Las fallas marcadas con BUG están en [reporte-de-defectos.md](reporte-de-defectos.md).\n\n';
md += '| ID del caso | Escenario o criterio de aceptación | Archivo y nombre del script | Resultado de la ejecución |\n|---|---|---|---|\n';
for (const f of filas) md += `| ${f.id} | ${f.criterio} | \`${f.archivo}\` › ${f.script} | ${etiqueta(f)} |\n`;
fs.writeFileSync(path.join(raiz, 'docs', 'matriz-trazabilidad.md'), md);

// ---- Reporte HTML ----
const color = { Aprobada: '#15803d', Fallida: '#b91c1c', Omitida: '#a16207', 'Sin ejecutar': '#6b7280' };
const filasHtml = filas.map((f) => {
  const est = f.r ? f.r.estado : 'Sin ejecutar';
  return `<tr><td><b>${f.id}</b></td><td>${escapar(f.titulo)}<div class="m">${escapar(f.criterio)}</div></td><td>${escapar(f.tipo)}</td><td><code>${escapar(f.archivo)}</code></td>
<td><span class="e" style="background:${color[est]}">${est}</span>${f.bug && est === 'Fallida' ? ` <b>${f.bug}</b>` : ''}${f.r && f.r.mensaje ? `<div class="m err">${escapar(f.r.mensaje)}</div>` : ''}</td><td>${f.r ? f.r.tiempo.toFixed(2) + ' s' : '—'}</td></tr>`;
}).join('\n');
const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Reporte de ejecución · NutriEdu</title>
<style>body{font-family:Segoe UI,Arial,sans-serif;margin:32px;color:#17211b}h1{margin:0}.s{display:flex;gap:16px;margin:20px 0}.c{padding:14px 20px;border-radius:10px;background:#f1f5f2}.c b{display:block;font-size:28px}
table{border-collapse:collapse;width:100%;font-size:14px}th,td{border-bottom:1px solid #e2e8e4;padding:8px;text-align:left;vertical-align:top}th{background:#0f2a1c;color:#fff}
.e{color:#fff;border-radius:999px;padding:2px 10px;font-weight:600}.m{color:#5e6e64;font-size:12px;margin-top:4px}.err{color:#b91c1c;white-space:pre-wrap}code{font-size:12px}</style></head><body>
<h1>Reporte de ejecución · NutriEdu</h1><p>Cypress · ${escapar(fechaTexto)} · ${archivos.length} archivos de pruebas</p>
<div class="s"><div class="c"><b>${total}</b>casos automatizados</div><div class="c" style="color:#15803d"><b>${aprobadas}</b>aprobadas</div><div class="c" style="color:#b91c1c"><b>${fallidas}</b>fallidas</div>${sinEjecutar ? `<div class="c"><b>${sinEjecutar}</b>sin ejecutar</div>` : ''}</div>
<table><tr><th>ID</th><th>Caso y criterio</th><th>Tipo</th><th>Archivo</th><th>Resultado</th><th>Tiempo</th></tr>${filasHtml}</table>
<p class="m">Capturas: cypress/screenshots · Videos: cypress/videos · Defectos: docs/reporte-de-defectos.md</p></body></html>`;
fs.mkdirSync(path.join(raiz, 'reportes'), { recursive: true });
fs.writeFileSync(path.join(raiz, 'reportes', 'reporte-ejecucion.html'), html);

console.log(`\nReporte: ${aprobadas} aprobadas, ${fallidas} fallidas${sinEjecutar ? `, ${sinEjecutar} sin ejecutar` : ''} de ${total}.`);
console.log('  reportes/reporte-ejecucion.html');
console.log('  docs/matriz-trazabilidad.md');
