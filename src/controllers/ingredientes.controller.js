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

const obtenerIngredientePorId = async (req, res) => {
  try {
    const ingrediente = await ingredientesService.obtenerIngredientePorId(req.params.id);
    res.json(ingrediente);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al obtener ingrediente",
      detalle: error.message,
    });
  }
};

const actualizarIngrediente = async (req, res) => {
  try {
    const ingrediente = await ingredientesService.actualizarIngrediente(req.params.id, req.body);
    res.json({
      mensaje: "Ingrediente actualizado correctamente",
      ingrediente,
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al actualizar ingrediente",
      detalle: error.message,
    });
  }
};

const eliminarIngrediente = async (req, res) => {
  try {
    const ingrediente = await ingredientesService.eliminarIngrediente(req.params.id);
    res.json({
      mensaje: "Ingrediente eliminado correctamente",
      ingrediente,
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al eliminar ingrediente",
      detalle: error.message,
    });
  }
};

module.exports = {
  crearIngrediente,
  verIngredientes,
  obtenerIngredientePorId,
  actualizarIngrediente,
  eliminarIngrediente,
};
