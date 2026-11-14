# Matriz de trazabilidad · NutriEdu

Última ejecución: 14 de noviembre de 2026 a las 2:23 p. m. · 24 aprobadas, 3 fallidas de 27 casos automatizados.

Este archivo lo genera `npm run reporte` a partir de `docs/trazabilidad.json` y de los resultados de Cypress. Las fallas marcadas con BUG están en [reporte-de-defectos.md](reporte-de-defectos.md).

| ID del caso | Escenario o criterio de aceptación | Archivo y nombre del script | Resultado de la ejecución |
|---|---|---|---|
| CP-001 | HU-01: con datos válidos se crea la cuenta. | `cypress/e2e/registro.cy.js` › CP-001 Registro con datos válidos | Aprobada |
| CP-002 | HU-01: si el correo ya está registrado, se muestra un error y no se crea otra cuenta. | `cypress/e2e/registro.cy.js` › CP-002 Registro con correo duplicado | Aprobada |
| CP-003 | HU-01: nombre, correo y contraseña son obligatorios. | `cypress/e2e/registro.cy.js` › CP-003 Registro con campos vacíos | Aprobada |
| CP-004 | HU-01: política de contraseña, mínimo 10 caracteres (9 = límite - 1). | `cypress/e2e/registro.cy.js` › CP-004 Contraseña de 9 caracteres (valor límite) | Aprobada |
| CP-005 | HU-01: el correo debe tener un formato válido. | `cypress/e2e/registro.cy.js` › CP-005 Registro con correo de formato inválido | Aprobada |
| CP-007 | HU-02: con credenciales correctas se permite el acceso y se genera un token JWT. | `cypress/e2e/login.cy.js` › CP-007 Login con credenciales correctas | Aprobada |
| CP-008 | HU-02: con contraseña incorrecta se muestra un error sin indicar cuál campo falló. | `cypress/e2e/login.cy.js` › CP-008 Login con contraseña incorrecta | Fallida (BUG-03) |
| CP-009 | HU-02: los campos obligatorios no pueden quedar vacíos. | `cypress/e2e/login.cy.js` › CP-009 Login con campos vacíos | Aprobada |
| CP-010 | HU-02: las rutas privadas rechazan accesos sin sesión. | `cypress/e2e/login.cy.js` › CP-010 Acceso a ruta privada sin sesión | Aprobada |
| CP-022 | HU-07: toda receta con un ingrediente restringido se excluye del listado. | `cypress/e2e/recetas.cy.js` › CP-022 Receta con ingrediente restringido se excluye | Aprobada |
| CP-023 | HU-07: las recetas sin ingredientes restringidos se muestran. | `cypress/e2e/recetas.cy.js` › CP-023 Receta segura se muestra | Aprobada |
| CP-025 | HU-07: si ninguna receta es compatible, se muestra un estado vacío con mensaje claro. | `cypress/e2e/recetas.cy.js` › CP-025 Estado vacío cuando ninguna receta es compatible | Aprobada |
| CP-030 | HU-09: el detalle muestra nombre, descripción, calorías, tiempo, nivel de salud e ingredientes. | `cypress/e2e/recetas.cy.js` › CP-030 Detalle de receta segura | Aprobada |
| CP-031 | HU-09: si hay ingredientes no seguros, se muestra una advertencia con sustitutos. | `cypress/e2e/recetas.cy.js` › CP-031 Advertencia de ingrediente no seguro | Aprobada |
| CP-032 | HU-09: si el ID de receta no existe, se muestra un mensaje de error. | `cypress/e2e/recetas.cy.js` › CP-032 Receta inexistente | Aprobada |
| CP-033 | HU-10: la búsqueda devuelve coincidencias sin distinguir mayúsculas. | `cypress/e2e/recetas.cy.js` › CP-033 Búsqueda con coincidencias | Aprobada |
| CP-034 | HU-10: la búsqueda devuelve solo recetas compatibles con el perfil. | `cypress/e2e/recetas.cy.js` › CP-034 Búsqueda no devuelve recetas restringidas | Fallida (BUG-01) |
| CP-045 | HU-15: al guardar, el plan queda almacenado y se recupera al volver. | `cypress/e2e/planificador.cy.js` › CP-045 Guardar plan semanal | Aprobada |
| CP-046 | HU-15: al reemplazar un plan existente se pide confirmación. | `cypress/e2e/planificador.cy.js` › CP-046 Confirmación al reemplazar el plan | Fallida (BUG-02) |
| CP-047 | HU-15: solo se pueden asignar recetas compatibles con el perfil. | `cypress/e2e/planificador.cy.js` › CP-047 El planificador no ofrece recetas no seguras | Aprobada |
| CP-049 | HU-16: si el plan está vacío, se informa que no hay ingredientes. | `cypress/e2e/planificador.cy.js` › CP-049 Lista de compras con plan vacío | Aprobada |
| CP-051 | HU-17: solo el rol administrador accede al panel. | `cypress/e2e/autorizacion-y-movil.cy.js` › CP-051 Usuario normal no accede al panel | Aprobada |
| CP-056 | HU-19: la interfaz se adapta a pantallas de móvil. | `cypress/e2e/autorizacion-y-movil.cy.js` › CP-056 Uso en pantalla de móvil | Aprobada |
| CP-058 | HU-01: política de contraseña, mínimo 10 caracteres (10 = límite). | `cypress/e2e/registro.cy.js` › CP-058 Contraseña de exactamente 10 caracteres (valor límite) | Aprobada |
| CP-059 | HU-01: política de contraseña, máximo 72 caracteres (72 = límite). | `cypress/e2e/registro.cy.js` › CP-059 Contraseña de exactamente 72 caracteres (valor límite) | Aprobada |
| CP-060 | HU-01: política de contraseña, máximo 72 caracteres (73 = límite + 1, el campo no lo acepta). | `cypress/e2e/registro.cy.js` › CP-060 Contraseña de 73 caracteres (valor límite) | Aprobada |
| CP-061 | HU-10: si no hay coincidencias, se muestra un estado vacío. | `cypress/e2e/recetas.cy.js` › CP-061 Búsqueda sin coincidencias | Aprobada |
