const express = require("express");
const router = express.Router();
const categoriasIngredientesController = require("../controllers/categoriasIngredientes.controller");
const { autenticar } = require("../middlewares/auth.middleware");
const { validators, validarBody, validarParams, validarQuery, paginacionRules, idParamRules } = require("../middlewares/validation.middleware");

const categoriaRules = [
  validators.required("nombre"),
  validators.string("nombre", "nombre", { min: 2, max: 100 }),
];

router.get("/", validarQuery(paginacionRules), categoriasIngredientesController.verCategoriasIngredientes);
router.get("/:id", validarParams(idParamRules("id")), categoriasIngredientesController.obtenerCategoriaIngredientePorId);
router.post("/", autenticar, validarBody(categoriaRules), categoriasIngredientesController.crearCategoriaIngrediente);
router.put("/:id", autenticar, validarParams(idParamRules("id")), validarBody(categoriaRules), categoriasIngredientesController.actualizarCategoriaIngrediente);
router.delete("/:id", autenticar, validarParams(idParamRules("id")), categoriasIngredientesController.eliminarCategoriaIngrediente);

module.exports = router;
