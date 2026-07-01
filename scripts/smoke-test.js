require("dotenv").config();

const http = require("http");
const app = require("../src/app");
const pool = require("../src/config/db");

const request = async (baseUrl, path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let body = null;

  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  return { response, body };
};

const assertStatus = ({ response, body }, expected, label) => {
  if (response.status !== expected) {
    throw new Error(`${label}: esperaba ${expected}, recibio ${response.status}. ${JSON.stringify(body)}`);
  }
};

const main = async () => {
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    assertStatus(await request(baseUrl, "/"), 200, "GET /");
    assertStatus(await request(baseUrl, "/api-docs.json"), 200, "GET /api-docs.json");
    assertStatus(await request(baseUrl, "/ruta-inexistente"), 404, "GET 404");

    const recetas = await request(baseUrl, "/api/recetas?page=1&limit=1");
    assertStatus(recetas, 200, "GET /api/recetas");

    if (!recetas.body || !recetas.body.pagination) {
      throw new Error("GET /api/recetas no devolvio paginacion");
    }

    const invalid = await request(baseUrl, "/api/recetas?page=0");
    assertStatus(invalid, 400, "Validacion de query");

    const protectedRoute = await request(baseUrl, "/api/preparaciones", {
      method: "POST",
      body: JSON.stringify({
        receta_id: 1,
        numero_paso: 1,
        descripcion: "Paso de prueba",
      }),
    });
    assertStatus(protectedRoute, 401, "Ruta protegida sin token");

    const securityResponse = await fetch(`${baseUrl}/api/recetas?page=1&limit=1`);
    if (!securityResponse.headers.get("x-content-type-options")) {
      throw new Error("Helmet no agrego x-content-type-options");
    }

    if (!securityResponse.headers.get("ratelimit-limit") && !securityResponse.headers.get("x-ratelimit-limit")) {
      throw new Error("Rate limit no agrego headers");
    }

    console.log("Smoke tests OK");
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await pool.end();
  }
};

main().catch(async (error) => {
  console.error(error.message);
  try {
    await pool.end();
  } catch {}
  process.exit(1);
});
