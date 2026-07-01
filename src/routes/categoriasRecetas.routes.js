const express = require("express");
const router = express.Router();
const categoriasRecetasController = require("../controllers/categoriasRecetas.controller");
const { autenticar } = require("../middlewares/auth.middleware");
const { validators, validarBody, validarParams, validarQuery, paginacionRules, idParamRules } = require("../middlewares/validation.middleware");

const categoriaRules = [
  validators.required("nombre"),
  validators.string("nombre", "nombre", { min: 2, max: 100 }),
];

router.get("/", validarQuery(paginacionRules), categoriasRecetasController.verCategoriasRecetas);
router.get("/:id", validarParams(idParamRules("id")), categoriasRecetasController.obtenerCategoriaRecetaPorId);
router.post("/", autenticar, validarBody(categoriaRules), categoriasRecetasController.crearCategoriaReceta);
router.put("/:id", autenticar, validarParams(idParamRules("id")), validarBody(categoriaRules), categoriasRecetasController.actualizarCategoriaReceta);
router.delete("/:id", autenticar, validarParams(idParamRules("id")), categoriasRecetasController.eliminarCategoriaReceta);

module.exports = router;
