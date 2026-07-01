const categoriasRecetasService = require("../services/categoriasRecetas.service");

const crearCategoriaReceta = async (req, res) => {
  try {
    const categoria = await categoriasRecetasService.crearCategoriaReceta(req.body);
    res.status(201).json({
      mensaje: "Categoria de receta creada correctamente",
      categoria,
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al crear categoria de receta",
      detalle: error.message,
    });
  }
};

const verCategoriasRecetas = async (req, res) => {
  try {
    const categorias = await categoriasRecetasService.verCategoriasRecetas(req.query);
    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtener categorias de recetas",
      detalle: error.message,
    });
  }
};

const obtenerCategoriaRecetaPorId = async (req, res) => {
  try {
    const categoria = await categoriasRecetasService.obtenerCategoriaRecetaPorId(req.params.id);
    res.json(categoria);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al obtener categoria de receta",
      detalle: error.message,
    });
  }
};

const actualizarCategoriaReceta = async (req, res) => {
  try {
    const categoria = await categoriasRecetasService.actualizarCategoriaReceta(req.params.id, req.body);
    res.json({
      mensaje: "Categoria de receta actualizada correctamente",
      categoria,
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al actualizar categoria de receta",
      detalle: error.message,
    });
  }
};

const eliminarCategoriaReceta = async (req, res) => {
  try {
    const categoria = await categoriasRecetasService.eliminarCategoriaReceta(req.params.id);
    res.json({
      mensaje: "Categoria de receta eliminada correctamente",
      categoria,
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al eliminar categoria de receta",
      detalle: error.message,
    });
  }
};

module.exports = {
  crearCategoriaReceta,
  verCategoriasRecetas,
  obtenerCategoriaRecetaPorId,
  actualizarCategoriaReceta,
  eliminarCategoriaReceta,
};
