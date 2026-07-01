const preparacionesModel = require("../models/preparaciones.modal");

const crearPreparacion = async ({ receta_id, numero_paso, descripcion }) => {
  if (!receta_id || !numero_paso || !descripcion) {
    const error = new Error("receta_id, numero_paso y descripcion son obligatorios");
    error.statusCode = 400;
    throw error;
  }

  return preparacionesModel.crearPreparacion(receta_id, numero_paso, descripcion);
};

const crearPreparacionParaUsuario = async (usuario_id, datos) => {
  const pertenece = await preparacionesModel.recetaPerteneceUsuario(datos.receta_id, usuario_id);

  if (!pertenece) {
    const error = new Error("La receta no pertenece al usuario");
    error.statusCode = 403;
    throw error;
  }

  return crearPreparacion(datos);
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

const actualizarPreparacion = async (id, usuario_id, { numero_paso, descripcion }) => {
  if (!numero_paso || !descripcion) {
    const error = new Error("numero_paso y descripcion son obligatorios");
    error.statusCode = 400;
    throw error;
  }

  const pertenece = await preparacionesModel.preparacionPerteneceUsuario(id, usuario_id);

  if (!pertenece) {
    const error = new Error("Preparacion no encontrada o no pertenece al usuario");
    error.statusCode = 404;
    throw error;
  }

  return preparacionesModel.actualizarPreparacion(id, numero_paso, descripcion);
};

const eliminarPreparacion = async (id, usuario_id) => {
  const pertenece = await preparacionesModel.preparacionPerteneceUsuario(id, usuario_id);

  if (!pertenece) {
    const error = new Error("Preparacion no encontrada o no pertenece al usuario");
    error.statusCode = 404;
    throw error;
  }

  return preparacionesModel.eliminarPreparacion(id);
};

module.exports = {
  crearPreparacion,
  crearPreparacionParaUsuario,
  verPreparaciones,
  obtenerPreparacionPorReceta,
  obtenerPreparacionPorNumeroPaso,
  actualizarPreparacion,
  eliminarPreparacion,
};
