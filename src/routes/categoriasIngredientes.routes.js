const express = require("express");
const router = express.Router();
const categoriasIngredientesController = require("../controllers/categoriasIngredientes.controller");
const { autenticar } = require("../middlewares/auth.middleware");

router.get("/", categoriasIngredientesController.verCategoriasIngredientes);
router.get("/:id", categoriasIngredientesController.obtenerCategoriaIngredientePorId);
router.post("/", autenticar, categoriasIngredientesController.crearCategoriaIngrediente);
router.put("/:id", autenticar, categoriasIngredientesController.actualizarCategoriaIngrediente);
router.delete("/:id", autenticar, categoriasIngredientesController.eliminarCategoriaIngrediente);

module.exports = router;
