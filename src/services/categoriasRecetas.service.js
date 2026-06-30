const categoriasRecetasModel = require("../models/categoriasRecetas");

const crearCategoriaReceta = async ({ nombre }) => {
  if (!nombre) {
    const error = new Error("nombre es obligatorio");
    error.statusCode = 400;
    throw error;
  }

  return categoriasRecetasModel.crearCategoriaRecetas(nombre);
};

const verCategoriasRecetas = async () => {
  return categoriasRecetasModel.verCategoriasRecetas();
};

module.exports = {
  crearCategoriaReceta,
  verCategoriasRecetas,
};
