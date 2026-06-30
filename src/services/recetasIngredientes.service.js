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

const verIngredientesPorReceta = async (receta_id) => {
  if (!receta_id) {
    const error = new Error("receta_id es obligatorio");
    error.statusCode = 400;
    throw error;
  }

  return recetasIngredientesModel.verIngredientesPorReceta(receta_id);
};

module.exports = {
  crearRecetaIngrediente,
  verIngredientesPorReceta,
};
