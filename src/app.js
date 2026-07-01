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
  res.send("API de recetas funcionando");
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
