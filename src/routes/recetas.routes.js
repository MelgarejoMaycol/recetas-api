const express = require("express");
const router = express.Router();
const upload = require("../config/cloudinary");
const recetasController = require("../controllers/recetas.controller");
const { autenticar, autorizarMismoUsuario } = require("../middlewares/auth.middleware");
const {
  validators,
  validarBody,
  validarParams,
  validarQuery,
  paginacionRules,
  idParamRules,
} = require("../middlewares/validation.middleware");

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

const recetaRules = [
  validators.required("nombre"),
  validators.string("nombre", "nombre", { min: 2, max: 150 }),
  validators.string("descripcion", "descripcion", { min: 1, max: 2000 }),
  validators.string("pais", "pais", { min: 2, max: 100 }),
  validators.url("imagen_url", "imagen_url"),
  validators.integer("tiempo_preparacion", "tiempo_preparacion", { min: 1 }),
  validators.integer("porciones", "porciones", { min: 1 }),
  validators.string("dificultad", "dificultad", { min: 2, max: 50 }),
  validators.required("categoria_id"),
  validators.integer("categoria_id", "categoria_id", { min: 1 }),
];

const actualizarRecetaRules = [
  validators.string("nombre", "nombre", { min: 2, max: 150 }),
  validators.string("descripcion", "descripcion", { min: 1, max: 2000 }),
  validators.string("pais", "pais", { min: 2, max: 100 }),
  validators.url("imagen_url", "imagen_url"),
  validators.integer("tiempo_preparacion", "tiempo_preparacion", { min: 1 }),
  validators.integer("porciones", "porciones", { min: 1 }),
  validators.string("dificultad", "dificultad", { min: 2, max: 50 }),
  validators.integer("categoria_id", "categoria_id", { min: 1 }),
];

const recetasQueryRules = [
  ...paginacionRules,
  validators.integer("categoria_id", "categoria_id", { min: 1 }),
  validators.string("q", "q", { min: 1, max: 100 }),
  validators.string("pais", "pais", { min: 1, max: 100 }),
  validators.string("dificultad", "dificultad", { min: 1, max: 50 }),
];

router.get("/", validarQuery(recetasQueryRules), recetasController.verRecetas);
router.get(
  "/mis-recetas/:usuario_id",
  autenticar,
  validarParams(idParamRules("usuario_id")),
  validarQuery(paginacionRules),
  autorizarMismoUsuario("usuario_id"),
  recetasController.verMisRecetas
);
router.get("/:id", validarParams(idParamRules("id")), recetasController.obtenerRecetaPorId);
router.post("/", autenticar, subirImagen, validarBody(recetaRules), recetasController.crearReceta);
router.put(
  "/:id",
  autenticar,
  validarParams(idParamRules("id")),
  subirImagen,
  validarBody(actualizarRecetaRules),
  recetasController.actualizarReceta
);
router.delete("/:id", autenticar, validarParams(idParamRules("id")), recetasController.eliminarReceta);

module.exports = router;
