const express = require("express");
const router = express.Router();
const preparacionesController = require("../controllers/preparaciones.controller");

router.post("/", preparacionesController.crearPreparacion);
router.get("/", preparacionesController.verPreparaciones);
router.get("/receta/:receta_id", preparacionesController.obtenerPreparacionPorReceta);
router.get(
  "/receta/:receta_id/paso/:numero_paso",
  preparacionesController.obtenerPreparacionPorNumeroPaso
);

module.exports = router;
