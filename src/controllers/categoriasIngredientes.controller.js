const categoriasIngredientesService = require("../services/categoriasIngredientes.service");

const crearCategoriaIngrediente = async (req, res) => {
  try {
    const categoria = await categoriasIngredientesService.crearCategoriaIngrediente(req.body);
    res.status(201).json({
      mensaje: "Categoria de ingrediente creada correctamente",
      categoria,
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al crear categoria de ingrediente",
      detalle: error.message,
    });
  }
};

const verCategoriasIngredientes = async (req, res) => {
  try {
    const categorias = await categoriasIngredientesService.verCategoriasIngredientes();
    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtener categorias de ingredientes",
      detalle: error.message,
    });
  }
};

const obtenerCategoriaIngredientePorId = async (req, res) => {
  try {
    const categoria = await categoriasIngredientesService.obtenerCategoriaIngredientePorId(req.params.id);
    res.json(categoria);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al obtener categoria de ingrediente",
      detalle: error.message,
    });
  }
};

const actualizarCategoriaIngrediente = async (req, res) => {
  try {
    const categoria = await categoriasIngredientesService.actualizarCategoriaIngrediente(req.params.id, req.body);
    res.json({
      mensaje: "Categoria de ingrediente actualizada correctamente",
      categoria,
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al actualizar categoria de ingrediente",
      detalle: error.message,
    });
  }
};

const eliminarCategoriaIngrediente = async (req, res) => {
  try {
    const categoria = await categoriasIngredientesService.eliminarCategoriaIngrediente(req.params.id);
    res.json({
      mensaje: "Categoria de ingrediente eliminada correctamente",
      categoria,
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al eliminar categoria de ingrediente",
      detalle: error.message,
    });
  }
};

module.exports = {
  crearCategoriaIngrediente,
  verCategoriasIngredientes,
  obtenerCategoriaIngredientePorId,
  actualizarCategoriaIngrediente,
  eliminarCategoriaIngrediente,
};
