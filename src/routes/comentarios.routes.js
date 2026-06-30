const express = require("express");
const router = express.Router();
const comentariosController = require("../controllers/comentarios.controller");

router.post("/", comentariosController.crearComentario);
router.get("/mejores-recetas", comentariosController.verMejoresRecetas);
router.get("/receta/:receta_id", comentariosController.verComentarios);
router.get("/usuario/:usuario_id", comentariosController.verMisComentarios);

module.exports = router;
