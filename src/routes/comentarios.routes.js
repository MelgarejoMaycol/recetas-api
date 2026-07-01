const express = require("express");
const router = express.Router();
const comentariosController = require("../controllers/comentarios.controller");
const { autenticar, autorizarMismoUsuario } = require("../middlewares/auth.middleware");
const { validators, validarBody, validarParams, validarQuery, paginacionRules, idParamRules } = require("../middlewares/validation.middleware");

const comentarioRules = [
  validators.required("receta_id"),
  validators.integer("receta_id", "receta_id", { min: 1 }),
  validators.required("comentario"),
  validators.string("comentario", "comentario", { min: 2, max: 1000 }),
  validators.integer("calificacion", "calificacion", { min: 1, max: 5 }),
];

const actualizarComentarioRules = [
  validators.required("comentario"),
  validators.string("comentario", "comentario", { min: 2, max: 1000 }),
  validators.integer("calificacion", "calificacion", { min: 1, max: 5 }),
];

router.post("/", autenticar, validarBody(comentarioRules), comentariosController.crearComentario);
router.get("/mejores-recetas", comentariosController.verMejoresRecetas);
router.get("/receta/:receta_id", validarParams(idParamRules("receta_id")), validarQuery(paginacionRules), comentariosController.verComentarios);
router.put("/:id", autenticar, validarParams(idParamRules("id")), validarBody(actualizarComentarioRules), comentariosController.actualizarComentario);
router.delete("/:id", autenticar, validarParams(idParamRules("id")), comentariosController.eliminarComentario);
router.get(
  "/usuario/:usuario_id",
  autenticar,
  validarParams(idParamRules("usuario_id")),
  validarQuery(paginacionRules),
  autorizarMismoUsuario("usuario_id"),
  comentariosController.verMisComentarios
);

module.exports = router;
