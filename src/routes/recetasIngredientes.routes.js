const express = require("express");
const router = express.Router();
const recetasIngredientesController = require("../controllers/recetasIngredientes.controller");

router.post("/", recetasIngredientesController.crearRecetaIngrediente);
router.get("/receta/:receta_id", recetasIngredientesController.verIngredientesPorReceta);

module.exports = router;
