# Pruebas automatizadas de NutriEdu con Cypress

Automatización del plan de pruebas corregido de **NutriEdu** (opción B del proyecto: 27 casos de varios módulos).

| Módulo | Casos automatizados | Archivo |
|---|---|---|
| HU-01 Registro | CP-001, CP-002, CP-003, CP-004, CP-005, CP-058, CP-059, CP-060 | `cypress/e2e/registro.cy.js` |
| HU-02 Inicio de sesión | CP-007, CP-008, CP-009, CP-010 | `cypress/e2e/login.cy.js` |
| HU-07, HU-09, HU-10 Recetas | CP-022, CP-023, CP-025, CP-030, CP-031, CP-032, CP-033, CP-034, CP-061 | `cypress/e2e/recetas.cy.js` |
| HU-15, HU-16 Planificador y compras | CP-045, CP-046, CP-047, CP-049 | `cypress/e2e/planificador.cy.js` |
| HU-17, HU-19 Autorización y móvil | CP-051, CP-056 | `cypress/e2e/autorizacion-y-movil.cy.js` |

Cobertura: 10 casos positivos, 13 negativos y 4 de valor límite (contraseña de 9, 10, 72 y 73 caracteres).

## Documentos de la entrega

| Documento | Archivo |
|---|---|
| Plan de pruebas corregido (Excel, con hoja "Tabla de cambios" y "Reporte de bugs") | `docs/Plan de pruebas NutriEdu - corregido.xlsx` |
| Plan de pruebas corregido (Markdown) | `docs/plan-de-pruebas-corregido.md` |
| Tabla de cambios: qué se corrigió, en qué caso y por qué | `docs/tabla-de-cambios.md` |
| Matriz de trazabilidad (se actualiza al ejecutar) | `docs/matriz-trazabilidad.md` |
| Reporte de defectos | `docs/reporte-de-defectos.md` |
| Reporte de ejecución (se genera al ejecutar) | `reportes/reporte-ejecucion.html` y `reportes/junit/*.xml` |
| Capturas y videos de la ejecución | `cypress/screenshots/` y `cypress/videos/` |

## 1. Requisitos

- **Node.js 22 o superior** (Cypress 16 lo exige). Comprueba con `node -v`.
- **Git** y **Google Chrome**.
- El **frontend de NutriEdu** corriendo en `http://localhost:5173`.

No se necesita base de datos ni backend: Cypress simula el servidor (ver la sección 5).

## 2. Instalación desde cero

En una terminal, levanta el frontend de NutriEdu y déjalo abierto:

```bash
git clone https://github.com/xrhon0s/NutriEdu-frontend.git
cd NutriEdu-frontend
npm install
npm run dev
```

En **otra** terminal, instala este proyecto de pruebas:

```bash
git clone <URL de este repositorio>
cd nutriedu-pruebas-cypress
npm install
```

`npm install` descarga Cypress (unos 500 MB) la primera vez.

## 3. Ejecutar las pruebas

**Toda la suite, con reporte** (recomendado para la entrega):

```bash
npm run pruebas
```

Al terminar muestra el resumen en la terminal y genera:
- `reportes/reporte-ejecucion.html`: abre este archivo en el navegador para ver cada prueba como aprobada o fallida.
- `docs/matriz-trazabilidad.md`: la columna "Resultado de la ejecución" queda llena.
- `cypress/videos/` y `cypress/screenshots/`: video por archivo y captura de cada prueba fallida.

Para ejecutarla en Chrome en vez de Electron: `npm run pruebas:chrome`.

**Modo visual** (para la sustentación en vivo):

```bash
npm run cy:open
```

Elige **E2E Testing → Chrome** y haz clic en un archivo de pruebas.

**Una sola prueba**: cada prueba es independiente. Para correr solo un archivo:

```bash
npx cypress run --spec cypress/e2e/login.cy.js
```

En modo visual, también se puede agregar `.only` a un `it(...)` mientras se explica.

### Resultado esperado

**24 pruebas aprobadas y 3 fallidas.** Las 3 fallas son **defectos reales** del sistema, documentados en `docs/reporte-de-defectos.md`:

| Prueba que falla | Defecto |
|---|---|
| CP-034 Búsqueda no devuelve recetas restringidas | BUG-01: la búsqueda muestra recetas con gluten o lactosa a una usuaria celíaca |
| CP-046 Confirmación al reemplazar el plan | BUG-02: el plan se reemplaza sin pedir confirmación |
| CP-008 Login con contraseña incorrecta | BUG-03: el mensaje revela si falló el correo o la contraseña |

Si el equipo de desarrollo corrige un defecto, la prueba correspondiente pasará sin cambiar el script.

## 4. Organización del código

```
cypress/
  e2e/                 Un archivo por módulo; cada prueba se llama con el ID del caso (p. ej. "CP-004 Contraseña de 9 caracteres")
  pages/               Page Objects: selectores y acciones de cada pantalla (RegistroPage, LoginPage, RecetasPage, ...)
  fixtures/
    casos.json         Datos de prueba de cada caso, con los mismos valores del plan corregido
    respuestas-api.json Respuestas grabadas del backend real de NutriEdu
  support/
    commands.js        Comandos propios: cy.simularBackend(), cy.iniciarSesion(), cy.iniciarSesionComoLaura()
    servidor-simulado.js Lógica del servidor simulado
docs/                  Plan corregido, tabla de cambios, matriz de trazabilidad, reporte de defectos
scripts/               ejecutar.js (corre la suite y el reporte) y generar-reporte.js
```

Decisiones de calidad:
- **Datos separados del código:** los scripts leen `cypress/fixtures/casos.json`; ningún valor del caso está escrito en el script.
- **Selectores estables:** atributos `name` de los campos, `aria-labelledby` de las secciones, `role` de mensajes y ventanas, y textos visibles. No se usan clases CSS ni posiciones.
- **Sin esperas fijas:** no hay `cy.wait(5000)`. Cypress reintenta cada aserción hasta que se cumple, y `cy.wait('@alias')` espera peticiones concretas.
- **Independencia:** cada prueba crea su propio estado del servidor simulado (`cy.simularBackend()`) y su propia sesión (`cy.session`), así que se puede ejecutar sola y en cualquier orden.
- **Aserciones del resultado esperado:** cada prueba verifica el texto exacto, la ruta, el estado de la pantalla o la petición enviada que dice el caso.

## 5. Servidor simulado

Las pruebas no necesitan PostgreSQL ni el backend. Cypress intercepta con `cy.intercept()` todas las peticiones del frontend a `/api` y responde con **respuestas grabadas del backend real** (`cypress/fixtures/respuestas-api.json`), tomadas con la base de datos de demostración (16 recetas; la usuaria Laura tiene restricciones Gluten y Lactosa).

El simulador (`cypress/support/servidor-simulado.js`) reproduce las reglas que se prueban: rechaza correos duplicados, exige token en las rutas privadas, guarda y devuelve el plan semanal y rechaza recetas no seguras en el plan.

Alcance: estas pruebas verifican el comportamiento de la **aplicación web** con las respuestas reales del servidor. Los casos que dependen de la base de datos o del correo electrónico (por ejemplo CP-006 o CP-011) quedan como pruebas manuales; la hoja "Casos de prueba" del Excel indica el motivo de cada uno.

Cuentas de demostración: `laura@nutriedu.test` / `Nutri#Edu2026` y `admin@nutriedu.test` / `Admin#Nutri2026`.

## 6. Problemas comunes

- **`cy.visit()` falla con ECONNREFUSED:** el frontend no está corriendo. Ejecuta `npm run dev` en `NutriEdu-frontend`.
- **Vite usa otro puerto** (lo muestra al arrancar): `CYPRESS_BASE_URL=http://localhost:5174 npm run pruebas` (en PowerShell: `$env:CYPRESS_BASE_URL="http://localhost:5174"; npm run pruebas`).
- **"SIN DATOS" en la lista de comandos de Cypress:** la página pidió algo que no está grabado (por ejemplo, si cambió el frontend). Hay que grabar esa respuesta y agregarla a `respuestas-api.json`.
- **Error de versión de Node:** Cypress 16 necesita Node 22 o superior.
