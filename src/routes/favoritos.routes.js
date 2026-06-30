const express = require("express");
const router = express.Router();
const favoritosController = require("../controllers/favoritos.controller");

router.post("/", favoritosController.crearFavorito);
router.get("/usuario/:usuario_id", favoritosController.verFavoritosPorUsuario);
router.get("/usuario/:usuario_id/count", favoritosController.countFavoritosPorUsuario);
router.get("/receta/:receta_id/count", favoritosController.countFavoritosPorReceta);
router.delete(
  "/usuario/:usuario_id/receta/:receta_id",
  favoritosController.eliminarFavorito
);

module.exports = router;
