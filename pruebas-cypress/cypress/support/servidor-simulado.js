// Servidor simulado de NutriEdu.
// Recibe cada petición que el frontend hace a /api y devuelve lo que respondería el backend real,
// usando las respuestas grabadas en cypress/fixtures/respuestas-api.json.
// Guarda un pequeño estado por prueba (cuentas registradas y plan semanal), así cada prueba
// empieza limpia y no depende de que otra se haya ejecutado antes.

function rutaApi(url) {
  const u = new URL(url);
  const path = u.pathname.replace(/^.*?\/api(?=\/)/, '');
  return { conQuery: path + u.search, sinQuery: path, query: u.searchParams };
}

function crearEstado(opciones = {}) {
  return {
    registrados: {},
    plan: (opciones.plan || []).map((p) => ({ ...p })),
    sinRecetasSeguras: Boolean(opciones.sinRecetasSeguras),
  };
}

function itemDelPlan(fx, p, i) {
  const r = fx.plantillas.recetasSeguras.find((x) => x.id === Number(p.recetaId)) || { nombre: `Receta ${p.recetaId}` };
  return {
    id: i + 1, dia_semana: p.diaSemana, tipo_comida: p.tipoComida, receta_id: Number(p.recetaId), receta_nombre: r.nombre,
    descripcion: r.descripcion, calorias: r.calorias, protein_g: r.protein_g, carbs_g: r.carbs_g, fat_g: r.fat_g,
    saturated_fat_g: r.saturated_fat_g, sugar_g: r.sugar_g, fiber_g: r.fiber_g, sodium_mg: r.sodium_mg,
    tiempo_preparacion: r.tiempo_preparacion, nivel_salud: r.nivel_salud,
  };
}

/**
 * @param fx      respuestas grabadas (fixture)
 * @param estado  estado de la prueba (ver crearEstado)
 * @param req     { method, url, headers, body }
 * @param cuentas { usuarioEmail, usuarioPassword, adminEmail, adminPassword }
 * @returns       { status, body, sinDatos? }
 */
function responder(fx, estado, req, cuentas) {
  const { conQuery, sinQuery, query } = rutaApi(req.url);
  const method = req.method.toUpperCase();
  const body = typeof req.body === 'string' && req.body ? JSON.parse(req.body) : req.body || {};
  const existe = (email) => email === cuentas.usuarioEmail || email === cuentas.adminEmail || Boolean(estado.registrados[email]);

  // ---- Rutas públicas ----
  if (method === 'POST' && sinQuery === '/users/register') {
    if (existe(body.email)) return { status: 400, body: fx.plantillas.correoDuplicado };
    estado.registrados[body.email] = body.password;
    return { status: 201, body: { message: 'Usuario creado', user: { id: fx.usuarios.nuevo.user.id, nombre: body.nombre, email: body.email } } };
  }
  if (method === 'POST' && sinQuery === '/users/login') {
    const email = String(body.email || '').trim().toLowerCase();
    if (email === cuentas.usuarioEmail && body.password === cuentas.usuarioPassword) return { status: 200, body: fx.usuarios.laura };
    if (email === cuentas.adminEmail && body.password === cuentas.adminPassword) return { status: 200, body: fx.usuarios.admin };
    if (estado.registrados[email] && estado.registrados[email] === body.password) {
      return { status: 200, body: { ...fx.usuarios.nuevo, user: { ...fx.usuarios.nuevo.user, email } } };
    }
    return existe(email) ? fx.loginFallido : { status: 401, body: { message: 'Usuario no encontrado' } };
  }

  // ---- Rutas privadas: exigen token, igual que el backend real ----
  const auth = req.headers.authorization || req.headers.Authorization || '';
  const actor = auth.replace(/^Bearer\s+/i, '').replace(/^token-/, '');
  const rutas = fx.rutas[actor];
  if (!rutas) return { status: 401, body: { message: 'Token requerido' } };
  const userId = fx.usuarios[actor].user.id;

  if (method === 'GET' && sinQuery === `/planner/${userId}`) {
    return { status: 200, body: estado.plan.map((p, i) => itemDelPlan(fx, p, i)) };
  }
  if (method === 'POST' && sinQuery === '/planner') {
    const plan = Array.isArray(body.plan) ? body.plan : [];
    const insegura = plan.some((p) => {
      const check = rutas[`GET /recipes/check/${p.recetaId}/${userId}`];
      return check && check.body && check.body.unsafeIngredients && check.body.unsafeIngredients.length > 0;
    });
    if (insegura) return { status: 400, body: { message: 'El plan contiene una receta incompatible con tus restricciones' } };
    estado.plan = plan.map((p) => ({ ...p }));
    return { status: 200, body: fx.plantillas.planGuardado };
  }
  if (method === 'GET' && sinQuery === `/planner/${userId}/shopping-list`) {
    return { status: 200, body: estado.plan.length ? fx.plantillas.listaComprasLlena : fx.plantillas.listaComprasVacia };
  }
  if (estado.sinRecetasSeguras && method === 'GET') {
    if (sinQuery === `/recipes/search/${userId}` && query.get('safe_only') === 'true') {
      return { status: 200, body: { recipes: [], pagination: { limit: Number(query.get('limit')), offset: 0, nextOffset: null, hasMore: false } } };
    }
    if (sinQuery === '/recipes/recommendations') {
      const grabada = rutas[`GET ${conQuery}`];
      return { status: 200, body: { ...(grabada ? grabada.body : {}), recipes: [] } };
    }
    if (sinQuery === `/recipes/safe/${userId}`) return { status: 200, body: [] };
  }

  const r = rutas[`${method} ${conQuery}`] || rutas[`${method} ${sinQuery}`];
  if (r) return { status: r.status, body: r.body };
  return { status: 404, body: { code: 'NOT_FOUND', message: `Sin datos simulados para ${method} ${conQuery}` }, sinDatos: true };
}

module.exports = { responder, crearEstado, rutaApi };
