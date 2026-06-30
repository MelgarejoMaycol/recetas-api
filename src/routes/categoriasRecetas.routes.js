const express = require("express");
const router = express.Router();
const categoriasRecetasController = require("../controllers/categoriasRecetas.controller");
const { autenticar } = require("../middlewares/auth.middleware");

router.get("/", categoriasRecetasController.verCategoriasRecetas);
router.get("/:id", categoriasRecetasController.obtenerCategoriaRecetaPorId);
router.post("/", autenticar, categoriasRecetasController.crearCategoriaReceta);
router.put("/:id", autenticar, categoriasRecetasController.actualizarCategoriaReceta);
router.delete("/:id", autenticar, categoriasRecetasController.eliminarCategoriaReceta);

module.exports = router;
