const express = require("express");
const router = express.Router();
const recetasIngredientesController = require("../controllers/recetasIngredientes.controller");
const { autenticar } = require("../middlewares/auth.middleware");
const { validators, validarBody, validarParams, validarQuery, paginacionRules, idParamRules } = require("../middlewares/validation.middleware");

const recetaIngredienteRules = [
  validators.required("receta_id"),
  validators.integer("receta_id", "receta_id", { min: 1 }),
  validators.required("ingrediente_id"),
  validators.integer("ingrediente_id", "ingrediente_id", { min: 1 }),
  validators.string("cantidad", "cantidad", { min: 1, max: 50 }),
  validators.string("unidad", "unidad", { min: 1, max: 50 }),
];

const actualizarRecetaIngredienteRules = [
  validators.string("cantidad", "cantidad", { min: 1, max: 50 }),
  validators.string("unidad", "unidad", { min: 1, max: 50 }),
];

router.get("/receta/:receta_id", validarParams(idParamRules("receta_id")), validarQuery(paginacionRules), recetasIngredientesController.verIngredientesPorReceta);
router.post("/", autenticar, validarBody(recetaIngredienteRules), recetasIngredientesController.crearRecetaIngrediente);
router.put("/:id", autenticar, validarParams(idParamRules("id")), validarBody(actualizarRecetaIngredienteRules), recetasIngredientesController.actualizarRecetaIngrediente);
router.delete("/:id", autenticar, validarParams(idParamRules("id")), recetasIngredientesController.eliminarRecetaIngrediente);

module.exports = router;
