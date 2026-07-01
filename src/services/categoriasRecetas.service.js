const categoriasRecetasModel = require("../models/categoriasRecetas");

const crearCategoriaReceta = async ({ nombre }) => {
  if (!nombre) {
    const error = new Error("nombre es obligatorio");
    error.statusCode = 400;
    throw error;
  }

  return categoriasRecetasModel.crearCategoriaRecetas(nombre);
};

const verCategoriasRecetas = async (paginacion) => {
  return categoriasRecetasModel.verCategoriasRecetas(paginacion);
};

const obtenerCategoriaRecetaPorId = async (id) => {
  const categoria = await categoriasRecetasModel.obtenerCategoriaRecetaPorId(id);

  if (!categoria) {
    const error = new Error("Categoria de receta no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return categoria;
};

const actualizarCategoriaReceta = async (id, { nombre }) => {
  if (!nombre) {
    const error = new Error("nombre es obligatorio");
    error.statusCode = 400;
    throw error;
  }

  const categoria = await categoriasRecetasModel.actualizarCategoriaReceta(id, nombre);

  if (!categoria) {
    const error = new Error("Categoria de receta no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return categoria;
};

const eliminarCategoriaReceta = async (id) => {
  const categoria = await categoriasRecetasModel.eliminarCategoriaReceta(id);

  if (!categoria) {
    const error = new Error("Categoria de receta no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return categoria;
};

module.exports = {
  crearCategoriaReceta,
  verCategoriasRecetas,
  obtenerCategoriaRecetaPorId,
  actualizarCategoriaReceta,
  eliminarCategoriaReceta,
};
