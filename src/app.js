const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db");

const app = express();
const usuarioRoutes = require("./routes/usuario.routes");
const recetasRoutes = require("./routes/recetas.routes");

app.use(cors());
app.use(express.json());

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/recetas", recetasRoutes);

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