const express = require("express");
const router = express.Router();
const favoritosController = require("../controllers/favoritos.controller");
const { autenticar, autorizarMismoUsuario } = require("../middlewares/auth.middleware");

router.post("/", autenticar, favoritosController.crearFavorito);
router.get(
  "/usuario/:usuario_id",
  autenticar,
  autorizarMismoUsuario("usuario_id"),
  favoritosController.verFavoritosPorUsuario
);
router.get(
  "/usuario/:usuario_id/count",
  autenticar,
  autorizarMismoUsuario("usuario_id"),
  favoritosController.countFavoritosPorUsuario
);
router.get("/receta/:receta_id/count", favoritosController.countFavoritosPorReceta);
router.delete(
  "/usuario/:usuario_id/receta/:receta_id",
  autenticar,
  autorizarMismoUsuario("usuario_id"),
  favoritosController.eliminarFavorito
);

module.exports = router;
