const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
require("./config/db");

const app = express();
const { apiLimiter } = require("./middlewares/security.middleware");
const { notFound, errorHandler } = require("./middlewares/error.middleware");
const swaggerSpec = require("./config/swagger");
const usuarioRoutes = require("./routes/usuario.routes");
const recetasRoutes = require("./routes/recetas.routes");
const categoriasRecetasRoutes = require("./routes/categoriasRecetas.routes");
const categoriasIngredientesRoutes = require("./routes/categoriasIngredientes.routes");
const ingredientesRoutes = require("./routes/ingredientes.routes");
const preparacionesRoutes = require("./routes/preparaciones.routes");
const comentariosRoutes = require("./routes/comentarios.routes");
const favoritosRoutes = require("./routes/favoritos.routes");
const recetasIngredientesRoutes = require("./routes/recetasIngredientes.routes");

app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
}));
app.use(apiLimiter);
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.json(swaggerSpec);
});

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/recetas", recetasRoutes);
app.use("/api/categorias-recetas", categoriasRecetasRoutes);
app.use("/api/categorias-ingredientes", categoriasIngredientesRoutes);
app.use("/api/ingredientes", ingredientesRoutes);
app.use("/api/preparaciones", preparacionesRoutes);
app.use("/api/comentarios", comentariosRoutes);
app.use("/api/favoritos", favoritosRoutes);
app.use("/api/recetas-ingredientes", recetasIngredientesRoutes);

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

app.get("/", (req, res) => {
  res.type("html").send(`<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Recetas API</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f5f7fb;
      --panel: #ffffff;
      --text: #172033;
      --muted: #5f6b7c;
      --primary: #0f766e;
      --primary-dark: #115e59;
      --line: #dce3ee;
      --soft: #e7f6f3;
      --accent: #f59e0b;
    }

    * {
      box-sizing: border-box;
    }

    body {
      min-height: 100vh;
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at 10% 10%, rgba(15, 118, 110, 0.12), transparent 28rem),
        linear-gradient(135deg, #f8fbff 0%, var(--bg) 55%, #edf4f7 100%);
    }

    main {
      width: min(1080px, calc(100% - 32px));
      margin: 0 auto;
      padding: 56px 0;
    }

    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.7fr);
      gap: 24px;
      align-items: stretch;
    }

    .panel {
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid var(--line);
      border-radius: 8px;
      box-shadow: 0 20px 50px rgba(23, 32, 51, 0.08);
    }

    .intro {
      padding: 36px;
    }

    .status {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 18px;
      padding: 8px 12px;
      border-radius: 999px;
      color: var(--primary-dark);
      background: var(--soft);
      font-weight: 700;
      font-size: 14px;
    }

    .status::before {
      width: 10px;
      height: 10px;
      content: "";
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.18);
    }

    h1 {
      margin: 0;
      font-size: clamp(36px, 6vw, 68px);
      line-height: 1;
      letter-spacing: 0;
    }

    p {
      margin: 16px 0 0;
      color: var(--muted);
      font-size: 17px;
      line-height: 1.6;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 28px;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      padding: 0 16px;
      border-radius: 8px;
      border: 1px solid var(--line);
      font-weight: 700;
    }

    .button.primary {
      color: #ffffff;
      background: var(--primary);
      border-color: var(--primary);
    }

    .button.secondary {
      color: var(--primary-dark);
      background: #ffffff;
    }

    .info {
      padding: 28px;
    }

    .info h2,
    .routes h2 {
      margin: 0 0 18px;
      font-size: 20px;
    }

    .metric {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 14px 0;
      border-top: 1px solid var(--line);
      color: var(--muted);
    }

    .metric:first-of-type {
      border-top: 0;
      padding-top: 0;
    }

    .metric strong {
      color: var(--text);
      text-align: right;
    }

    .routes {
      margin-top: 24px;
      padding: 28px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }

    .route {
      min-height: 92px;
      padding: 16px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #ffffff;
    }

    .route span {
      display: block;
      margin-bottom: 10px;
      color: var(--accent);
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
    }

    .route code {
      color: var(--primary-dark);
      font-size: 15px;
      word-break: break-word;
    }

    @media (max-width: 780px) {
      main {
        padding: 28px 0;
      }

      .hero,
      .grid {
        grid-template-columns: 1fr;
      }

      .intro,
      .info,
      .routes {
        padding: 24px;
      }
    }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <div class="panel intro">
        <div class="status">API activa</div>
        <h1>Recetas API</h1>
        <p>Servicio REST para gestionar recetas, usuarios, categorias, ingredientes, preparaciones, comentarios y favoritos.</p>
        <div class="actions">
          <a class="button primary" href="/api-docs">Ver documentacion</a>
          <a class="button secondary" href="/api-docs.json">OpenAPI JSON</a>
        </div>
      </div>

      <aside class="panel info" aria-label="Informacion de la API">
        <h2>Mas informacion</h2>
        <div class="metric">
          <span>Estado</span>
          <strong>Funcionando</strong>
        </div>
        <div class="metric">
          <span>Formato</span>
          <strong>JSON</strong>
        </div>
        <div class="metric">
          <span>Base</span>
          <strong>/api</strong>
        </div>
        <div class="metric">
          <span>Docs</span>
          <strong>Swagger</strong>
        </div>
      </aside>
    </section>

    <section class="panel routes">
      <h2>Rutas principales</h2>
      <div class="grid">
        <a class="route" href="/api/recetas"><span>Recetas</span><code>GET /api/recetas</code></a>
        <a class="route" href="/api/ingredientes"><span>Ingredientes</span><code>GET /api/ingredientes</code></a>
        <a class="route" href="/api/categorias-recetas"><span>Categorias</span><code>GET /api/categorias-recetas</code></a>
        <a class="route" href="/api/comentarios/mejores-recetas"><span>Comentarios</span><code>GET /api/comentarios/mejores-recetas</code></a>
        <a class="route" href="/api/usuarios"><span>Usuarios</span><code>GET /api/usuarios</code></a>
        <a class="route" href="/api-docs"><span>Referencia</span><code>GET /api-docs</code></a>
      </div>
    </section>
  </main>
</body>
</html>`);
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
