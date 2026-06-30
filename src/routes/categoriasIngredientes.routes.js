const express = require("express");
const router = express.Router();
const categoriasIngredientesController = require("../controllers/categoriasIngredientes.controller");

router.post("/", categoriasIngredientesController.crearCategoriaIngrediente);
router.get("/", categoriasIngredientesController.verCategoriasIngredientes);

module.exports = router;
