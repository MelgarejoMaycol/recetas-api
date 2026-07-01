const express = require("express");
const router = express.Router();
const ingredientesController = require("../controllers/ingredientes.controller");
const { autenticar } = require("../middlewares/auth.middleware");
const { validators, validarBody, validarParams, validarQuery, paginacionRules, idParamRules } = require("../middlewares/validation.middleware");

const ingredienteRules = [
  validators.required("nombre"),
  validators.string("nombre", "nombre", { min: 2, max: 120 }),
  validators.required("categoria_id"),
  validators.integer("categoria_id", "categoria_id", { min: 1 }),
];

router.get("/", validarQuery(paginacionRules), ingredientesController.verIngredientes);
router.get("/:id", validarParams(idParamRules("id")), ingredientesController.obtenerIngredientePorId);
router.post("/", autenticar, validarBody(ingredienteRules), ingredientesController.crearIngrediente);
router.put("/:id", autenticar, validarParams(idParamRules("id")), validarBody(ingredienteRules), ingredientesController.actualizarIngrediente);
router.delete("/:id", autenticar, validarParams(idParamRules("id")), ingredientesController.eliminarIngrediente);

module.exports = router;
