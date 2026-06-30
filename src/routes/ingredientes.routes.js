const express = require("express");
const router = express.Router();
const ingredientesController = require("../controllers/ingredientes.controller");

router.post("/", ingredientesController.crearIngrediente);
router.get("/", ingredientesController.verIngredientes);

module.exports = router;
