const express = require("express");
const router = express.Router();

const recetasController = require("../controllers/recetas.controller");

router.post("/", recetasController.crearReceta);
router.get("/", recetasController.obtenerRecetas);
router.get("/mis-recetas/:usuarioId", recetasController.verMisRecetas);

module.exports = router;