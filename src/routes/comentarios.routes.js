const express = require("express");
const router = express.Router();
const comentariosController = require("../controllers/comentarios.controller");
const { autenticar, autorizarMismoUsuario } = require("../middlewares/auth.middleware");

router.post("/", autenticar, comentariosController.crearComentario);
router.get("/mejores-recetas", comentariosController.verMejoresRecetas);
router.get("/receta/:receta_id", comentariosController.verComentarios);
router.put("/:id", autenticar, comentariosController.actualizarComentario);
router.delete("/:id", autenticar, comentariosController.eliminarComentario);
router.get(
  "/usuario/:usuario_id",
  autenticar,
  autorizarMismoUsuario("usuario_id"),
  comentariosController.verMisComentarios
);

module.exports = router;
