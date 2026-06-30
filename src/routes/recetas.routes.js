const express = require("express");
const router = express.Router();
const upload = require("../config/cloudinary");
const recetasController = require("../controllers/recetas.controller");

router.post("/", upload.single("imagen"), recetasController.crearReceta);
router.get("/", recetasController.verRecetas);
router.get("/mis-recetas/:usuarioId", recetasController.verMisRecetas);

module.exports = router;
