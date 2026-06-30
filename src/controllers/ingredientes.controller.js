const ingredientesService = require("../services/ingredientes.service");

const crearIngrediente = async (req, res) => {
  try {
    const ingrediente = await ingredientesService.crearIngrediente(req.body);
    res.status(201).json({
      mensaje: "Ingrediente creado correctamente",
      ingrediente,
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al crear ingrediente",
      detalle: error.message,
    });
  }
};

const verIngredientes = async (req, res) => {
  try {
    const ingredientes = await ingredientesService.verIngredientes();
    res.json(ingredientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtener ingredientes",
      detalle: error.message,
    });
  }
};

module.exports = {
  crearIngrediente,
  verIngredientes,
};
