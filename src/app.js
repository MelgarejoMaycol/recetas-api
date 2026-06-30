const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db");

const app = express();
const usuarioRoutes = require("./routes/usuario.routes");
const recetasRoutes = require("./routes/recetas.routes");
const categoriasRecetasRoutes = require("./routes/categoriasRecetas.routes");
const categoriasIngredientesRoutes = require("./routes/categoriasIngredientes.routes");
const ingredientesRoutes = require("./routes/ingredientes.routes");
const preparacionesRoutes = require("./routes/preparaciones.routes");
const comentariosRoutes = require("./routes/comentarios.routes");
const favoritosRoutes = require("./routes/favoritos.routes");
const recetasIngredientesRoutes = require("./routes/recetasIngredientes.routes");

app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
