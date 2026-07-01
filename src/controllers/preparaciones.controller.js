const preparacionesService = require("../services/preparaciones.service");

const crearPreparacion = async (req, res) => {
  try {
    const preparacion = await preparacionesService.crearPreparacion(req.body);
    res.status(201).json({
      mensaje: "Preparacion creada correctamente",
      preparacion,
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al crear preparacion",
      detalle: error.message,
    });
  }
};

const verPreparaciones = async (req, res) => {
  try {
    const preparaciones = await preparacionesService.verPreparaciones(req.query);
    res.json(preparaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtener preparaciones",
      detalle: error.message,
    });
  }
};

const obtenerPreparacionPorReceta = async (req, res) => {
  try {
    const { receta_id } = req.params;
    const preparaciones = await preparacionesService.obtenerPreparacionPorReceta(receta_id, req.query);
    res.json(preparaciones);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al obtener preparaciones de la receta",
      detalle: error.message,
    });
  }
};

const obtenerPreparacionPorNumeroPaso = async (req, res) => {
  try {
    const { receta_id, numero_paso } = req.params;
    const preparacion = await preparacionesService.obtenerPreparacionPorNumeroPaso(
      receta_id,
      numero_paso
    );
    res.json(preparacion || null);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al obtener preparacion por paso",
      detalle: error.message,
    });
  }
};

module.exports = {
  crearPreparacion,
  verPreparaciones,
  obtenerPreparacionPorReceta,
  obtenerPreparacionPorNumeroPaso,
};
