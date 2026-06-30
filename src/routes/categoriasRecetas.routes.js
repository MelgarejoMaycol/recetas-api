const express = require("express");
const router = express.Router();
const categoriasRecetasController = require("../controllers/categoriasRecetas.controller");

router.post("/", categoriasRecetasController.crearCategoriaReceta);
router.get("/", categoriasRecetasController.verCategoriasRecetas);

module.exports = router;
