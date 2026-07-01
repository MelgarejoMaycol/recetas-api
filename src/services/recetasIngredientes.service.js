const recetasIngredientesModel = require("../models/recetasIngredientes.modal");

const crearRecetaIngrediente = async ({ receta_id, ingrediente_id, cantidad, unidad }) => {
  if (!receta_id || !ingrediente_id) {
    const error = new Error("receta_id e ingrediente_id son obligatorios");
    error.statusCode = 400;
    throw error;
  }

  return recetasIngredientesModel.crearRecetaIngrediente(
    receta_id,
    ingrediente_id,
    cantidad || null,
    unidad || null
  );
};

const crearRecetaIngredienteParaUsuario = async (usuario_id, datos) => {
  const { receta_id } = datos;
  const pertenece = await recetasIngredientesModel.recetaPerteneceUsuario(receta_id, usuario_id);

  if (!pertenece) {
    const error = new Error("La receta no pertenece al usuario");
    error.statusCode = 403;
    throw error;
  }

  return crearRecetaIngrediente(datos);
};

const verIngredientesPorReceta = async (receta_id, paginacion) => {
  if (!receta_id) {
    const error = new Error("receta_id es obligatorio");
    error.statusCode = 400;
    throw error;
  }

  return recetasIngredientesModel.verIngredientesPorReceta(receta_id, paginacion);
};

const actualizarRecetaIngrediente = async (id, usuario_id, { cantidad, unidad }) => {
  const pertenece = await recetasIngredientesModel.recetaIngredientePerteneceUsuario(id, usuario_id);

  if (!pertenece) {
    const error = new Error("Ingrediente de receta no encontrado o no pertenece al usuario");
    error.statusCode = 404;
    throw error;
  }

  return recetasIngredientesModel.actualizarRecetaIngrediente(id, cantidad || null, unidad || null);
};

const eliminarRecetaIngrediente = async (id, usuario_id) => {
  const pertenece = await recetasIngredientesModel.recetaIngredientePerteneceUsuario(id, usuario_id);

  if (!pertenece) {
    const error = new Error("Ingrediente de receta no encontrado o no pertenece al usuario");
    error.statusCode = 404;
    throw error;
  }

  return recetasIngredientesModel.eliminarRecetaIngrediente(id);
};

module.exports = {
  crearRecetaIngrediente,
  crearRecetaIngredienteParaUsuario,
  verIngredientesPorReceta,
  actualizarRecetaIngrediente,
  eliminarRecetaIngrediente,
};
