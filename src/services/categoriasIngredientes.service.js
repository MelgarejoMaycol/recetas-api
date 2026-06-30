const categoriasIngredientesModel = require("../models/categoriasIngredientes.modal");

const crearCategoriaIngrediente = async ({ nombre }) => {
  if (!nombre) {
    const error = new Error("nombre es obligatorio");
    error.statusCode = 400;
    throw error;
  }

  return categoriasIngredientesModel.crearCategoriaIngrediente(nombre);
};

const verCategoriasIngredientes = async () => {
  return categoriasIngredientesModel.verCategoriasIngredientes();
};

const obtenerCategoriaIngredientePorId = async (id) => {
  const categoria = await categoriasIngredientesModel.obtenerCategoriaIngredientePorId(id);

  if (!categoria) {
    const error = new Error("Categoria de ingrediente no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return categoria;
};

const actualizarCategoriaIngrediente = async (id, { nombre }) => {
  if (!nombre) {
    const error = new Error("nombre es obligatorio");
    error.statusCode = 400;
    throw error;
  }

  const categoria = await categoriasIngredientesModel.actualizarCategoriaIngrediente(id, nombre);

  if (!categoria) {
    const error = new Error("Categoria de ingrediente no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return categoria;
};

const eliminarCategoriaIngrediente = async (id) => {
  const categoria = await categoriasIngredientesModel.eliminarCategoriaIngrediente(id);

  if (!categoria) {
    const error = new Error("Categoria de ingrediente no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return categoria;
};

module.exports = {
  crearCategoriaIngrediente,
  verCategoriasIngredientes,
  obtenerCategoriaIngredientePorId,
  actualizarCategoriaIngrediente,
  eliminarCategoriaIngrediente,
};
