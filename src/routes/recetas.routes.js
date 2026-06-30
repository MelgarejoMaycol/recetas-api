const express = require("express");
const router = express.Router();
const upload = require("../config/cloudinary");
const recetasController = require("../controllers/recetas.controller");

const subirImagen = (req, res, next) => {
  upload.single("imagen")(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        mensaje: "Error al subir imagen",
        detalle: error.message,
      });
    }

    next();
  });
};

router.post("/", subirImagen, recetasController.crearReceta);
router.get("/", recetasController.verRecetas);
router.get("/mis-recetas/:usuario_id", recetasController.verMisRecetas);

module.exports = router;
