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

module.exports = {
  crearCategoriaIngrediente,
  verCategoriasIngredientes,
};
