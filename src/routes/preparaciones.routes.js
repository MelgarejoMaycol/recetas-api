const express = require("express");
const router = express.Router();
const preparacionesController = require("../controllers/preparaciones.controller");
const { validators, validarBody, validarParams, validarQuery, paginacionRules, idParamRules } = require("../middlewares/validation.middleware");
const { autenticar } = require("../middlewares/auth.middleware");

const preparacionRules = [
  validators.required("receta_id"),
  validators.integer("receta_id", "receta_id", { min: 1 }),
  validators.required("numero_paso"),
  validators.integer("numero_paso", "numero_paso", { min: 1 }),
  validators.required("descripcion"),
  validators.string("descripcion", "descripcion", { min: 2, max: 2000 }),
];

const actualizarPreparacionRules = [
  validators.required("numero_paso"),
  validators.integer("numero_paso", "numero_paso", { min: 1 }),
  validators.required("descripcion"),
  validators.string("descripcion", "descripcion", { min: 2, max: 2000 }),
];

router.post("/", autenticar, validarBody(preparacionRules), preparacionesController.crearPreparacion);
router.get("/", validarQuery(paginacionRules), preparacionesController.verPreparaciones);
router.get("/receta/:receta_id", validarParams(idParamRules("receta_id")), validarQuery(paginacionRules), preparacionesController.obtenerPreparacionPorReceta);
router.get(
  "/receta/:receta_id/paso/:numero_paso",
  validarParams([...idParamRules("receta_id"), ...idParamRules("numero_paso")]),
  preparacionesController.obtenerPreparacionPorNumeroPaso
);
router.put("/:id", autenticar, validarParams(idParamRules("id")), validarBody(actualizarPreparacionRules), preparacionesController.actualizarPreparacion);
router.delete("/:id", autenticar, validarParams(idParamRules("id")), preparacionesController.eliminarPreparacion);

module.exports = router;
