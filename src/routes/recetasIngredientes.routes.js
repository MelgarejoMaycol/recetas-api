const express = require("express");
const router = express.Router();
const recetasIngredientesController = require("../controllers/recetasIngredientes.controller");
const { autenticar } = require("../middlewares/auth.middleware");

router.get("/receta/:receta_id", recetasIngredientesController.verIngredientesPorReceta);
router.post("/", autenticar, recetasIngredientesController.crearRecetaIngrediente);
router.put("/:id", autenticar, recetasIngredientesController.actualizarRecetaIngrediente);
router.delete("/:id", autenticar, recetasIngredientesController.eliminarRecetaIngrediente);

module.exports = router;
