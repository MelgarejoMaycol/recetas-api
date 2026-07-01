const express = require("express");
const router = express.Router();
const favoritosController = require("../controllers/favoritos.controller");
const { autenticar, autorizarMismoUsuario } = require("../middlewares/auth.middleware");
const { validators, validarBody, validarParams, validarQuery, paginacionRules, idParamRules } = require("../middlewares/validation.middleware");

const favoritoRules = [
  validators.required("receta_id"),
  validators.integer("receta_id", "receta_id", { min: 1 }),
];

router.post("/", autenticar, validarBody(favoritoRules), favoritosController.crearFavorito);
router.get(
  "/usuario/:usuario_id",
  autenticar,
  validarParams(idParamRules("usuario_id")),
  validarQuery(paginacionRules),
  autorizarMismoUsuario("usuario_id"),
  favoritosController.verFavoritosPorUsuario
);
router.get(
  "/usuario/:usuario_id/count",
  autenticar,
  validarParams(idParamRules("usuario_id")),
  autorizarMismoUsuario("usuario_id"),
  favoritosController.countFavoritosPorUsuario
);
router.get("/receta/:receta_id/count", validarParams(idParamRules("receta_id")), favoritosController.countFavoritosPorReceta);
router.delete(
  "/usuario/:usuario_id/receta/:receta_id",
  autenticar,
  validarParams([...idParamRules("usuario_id"), ...idParamRules("receta_id")]),
  autorizarMismoUsuario("usuario_id"),
  favoritosController.eliminarFavorito
);

module.exports = router;
