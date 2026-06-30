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
    const categorias = await categoriasRecetasService.verCategoriasRecetas();
    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtener categorias de recetas",
      detalle: error.message,
    });
  }
};

module.exports = {
  crearCategoriaReceta,
  verCategoriasRecetas,
};
