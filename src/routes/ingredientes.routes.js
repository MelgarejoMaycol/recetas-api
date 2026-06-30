const express = require("express");
const router = express.Router();
const ingredientesController = require("../controllers/ingredientes.controller");
const { autenticar } = require("../middlewares/auth.middleware");

router.get("/", ingredientesController.verIngredientes);
router.get("/:id", ingredientesController.obtenerIngredientePorId);
router.post("/", autenticar, ingredientesController.crearIngrediente);
router.put("/:id", autenticar, ingredientesController.actualizarIngrediente);
router.delete("/:id", autenticar, ingredientesController.eliminarIngrediente);

module.exports = router;
