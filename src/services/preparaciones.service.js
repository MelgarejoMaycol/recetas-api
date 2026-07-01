const preparacionesModel = require("../models/preparaciones.modal");

const crearPreparacion = async ({ receta_id, numero_paso, descripcion }) => {
  if (!receta_id || !numero_paso || !descripcion) {
    const error = new Error("receta_id, numero_paso y descripcion son obligatorios");
    error.statusCode = 400;
    throw error;
  }

  return preparacionesModel.crearPreparacion(receta_id, numero_paso, descripcion);
};

const verPreparaciones = async (paginacion) => {
  return preparacionesModel.verPreparaciones(paginacion);
};

const obtenerPreparacionPorReceta = async (receta_id, paginacion) => {
  if (!receta_id) {
    const error = new Error("receta_id es obligatorio");
    error.statusCode = 400;
    throw error;
  }

  return preparacionesModel.obtenerPreparacionPorReceta(receta_id, paginacion);
};

const obtenerPreparacionPorNumeroPaso = async (receta_id, numero_paso) => {
  if (!receta_id || !numero_paso) {
    const error = new Error("receta_id y numero_paso son obligatorios");
    error.statusCode = 400;
    throw error;
  }

  return preparacionesModel.obtenerPreparacionPorNumeroPaso(receta_id, numero_paso);
};

module.exports = {
  crearPreparacion,
  verPreparaciones,
  obtenerPreparacionPorReceta,
  obtenerPreparacionPorNumeroPaso,
};
