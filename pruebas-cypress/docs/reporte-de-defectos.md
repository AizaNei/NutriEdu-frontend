# Reporte de defectos · NutriEdu

Defectos encontrados al automatizar el plan de pruebas corregido. Cada uno corresponde a una prueba de Cypress que falla porque el sistema no cumple el criterio de aceptación de la historia de usuario. Se reproducen también en el sistema real (backend con la base de datos de demostración).

| ID | Caso | Historia | Título | Severidad | Prioridad | Estado |
|---|---|---|---|---|---|---|
| BUG-01 | CP-034 | HU-10 | La búsqueda muestra recetas con ingredientes restringidos para el usuario | Alta | P1 | Abierto |
| BUG-02 | CP-046 | HU-15 | El planificador reemplaza el plan guardado sin pedir confirmación | Media | P3 | Abierto |
| BUG-03 | CP-008 | HU-02 | El login revela si el correo existe o si falló la contraseña | Media | P2 | Abierto |

## BUG-01 · La búsqueda muestra recetas con ingredientes restringidos para el usuario

- **Caso que falló:** CP-034 (HU-10)
- **Severidad / prioridad:** Alta / P1
- **Entorno:** Chrome (Cypress 16) / Windows 11 · frontend NutriEdu (Vite) · respuestas grabadas del backend real
- **Fecha de reporte:** 2026-11-14 · **Reportado por:** Neiver Fernandez Avila · **Estado:** Abierto

**Pasos para reproducir**

1. Iniciar sesión como laura@nutriedu.test (restricciones Gluten y Lactosa)
2. Abrir /recipes
3. Escribir 'avena' en el buscador 'Nombre o descripción'

**Resultado esperado:** No aparecen recetas con ingredientes restringidos; se muestra 'Sin coincidencias' (HU-10: la búsqueda devuelve solo recetas compatibles con el perfil).

**Resultado real:** Aparecen 'Avena con fresas y chía' (avena y leche) y 'Batido de banano y bebida de almendra' (avena), marcadas como 'Revisar ingredientes'. Causa: al escribir en el buscador, el frontend deja de enviar safe_only=true a GET /recipes/search y el backend devuelve todas las coincidencias.

**Evidencia:** cypress/screenshots/recetas.cy.js/ (captura automática de CP-034) y video de la ejecución en `cypress/videos/`.

## BUG-02 · El planificador reemplaza el plan guardado sin pedir confirmación

- **Caso que falló:** CP-046 (HU-15)
- **Severidad / prioridad:** Media / P3
- **Entorno:** Chrome (Cypress 16) / Windows 11 · frontend NutriEdu (Vite) · respuestas grabadas del backend real
- **Fecha de reporte:** 2026-11-14 · **Reportado por:** Neiver Fernandez Avila · **Estado:** Abierto

**Pasos para reproducir**

1. Iniciar sesión como laura@nutriedu.test con un plan guardado (Tortilla de espinaca, Lunes / Desayuno)
2. Abrir /planner
3. Agregar 'Crema de zanahoria' en Miércoles / Cena
4. Pulsar 'Guardar cambios'

**Resultado esperado:** Se muestra una ventana de confirmación antes de reemplazar el plan (HU-15, CA3).

**Resultado real:** El plan se guarda de inmediato y aparece 'Plan semanal guardado correctamente.' sin ninguna confirmación.

**Evidencia:** cypress/screenshots/planificador.cy.js/ (captura automática de CP-046) y video de la ejecución en `cypress/videos/`.

## BUG-03 · El login revela si el correo existe o si falló la contraseña

- **Caso que falló:** CP-008 (HU-02)
- **Severidad / prioridad:** Media / P2
- **Entorno:** Chrome (Cypress 16) / Windows 11 · frontend NutriEdu (Vite) · respuestas grabadas del backend real
- **Fecha de reporte:** 2026-11-14 · **Reportado por:** Neiver Fernandez Avila · **Estado:** Abierto

**Pasos para reproducir**

1. Abrir /login
2. Ingresar laura@nutriedu.test y la contraseña 'Incorrecta9'
3. Pulsar 'Iniciar sesión'

**Resultado esperado:** Mensaje genérico que no indica cuál campo falló (HU-02, CA2).

**Resultado real:** Se muestra 'Contraseña incorrecta' (y con un correo no registrado, 'Usuario no encontrado'), lo que permite saber qué correos están registrados.

**Evidencia:** cypress/screenshots/login.cy.js/ (captura automática de CP-008) y video de la ejecución en `cypress/videos/`.
