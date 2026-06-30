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

const obtenerIngredientePorId = async (id) => {
  const ingrediente = await ingredientesModel.obtenerIngredientePorId(id);

  if (!ingrediente) {
    const error = new Error("Ingrediente no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return ingrediente;
};

const actualizarIngrediente = async (id, { nombre, categoria_id }) => {
  if (!nombre || !categoria_id) {
    const error = new Error("nombre y categoria_id son obligatorios");
    error.statusCode = 400;
    throw error;
  }

  const ingrediente = await ingredientesModel.actualizarIngrediente(id, nombre, categoria_id);

  if (!ingrediente) {
    const error = new Error("Ingrediente no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return ingrediente;
};

const eliminarIngrediente = async (id) => {
  const ingrediente = await ingredientesModel.eliminarIngrediente(id);

  if (!ingrediente) {
    const error = new Error("Ingrediente no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return ingrediente;
};

module.exports = {
  crearIngrediente,
  verIngredientes,
  obtenerIngredientePorId,
  actualizarIngrediente,
  eliminarIngrediente,
};
