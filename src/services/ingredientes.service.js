const ingredientesModel = require("../models/ingredientes.modal");

const crearIngrediente = async ({ nombre, categoria_id }) => {
  if (!nombre || !categoria_id) {
    const error = new Error("nombre y categoria_id son obligatorios");
    error.statusCode = 400;
    throw error;
  }

  return ingredientesModel.crearIngrediente(nombre, categoria_id);
};

const verIngredientes = async () => {
  return ingredientesModel.verIngredientes();
};

module.exports = {
  crearIngrediente,
  verIngredientes,
};
