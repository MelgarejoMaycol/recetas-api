const recetasIngredientesService = require("../services/recetasIngredientes.service");

const crearRecetaIngrediente = async (req, res) => {
  try {
    const recetaIngrediente = await recetasIngredientesService.crearRecetaIngrediente(req.body);
    res.status(201).json({
      mensaje: "Ingrediente agregado a la receta correctamente",
      recetaIngrediente,
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al agregar ingrediente a la receta",
      detalle: error.message,
    });
  }
};

const verIngredientesPorReceta = async (req, res) => {
  try {
    const { receta_id } = req.params;
    const ingredientes = await recetasIngredientesService.verIngredientesPorReceta(receta_id);
    res.json(ingredientes);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al obtener ingredientes de la receta",
      detalle: error.message,
    });
  }
};

module.exports = {
  crearRecetaIngrediente,
  verIngredientesPorReceta,
};
