const favoritosService = require("../services/favoritos.service");

const crearFavorito = async (req, res) => {
  try {
    const favorito = await favoritosService.crearFavorito({
      ...req.body,
      usuario_id: req.usuario.id,
    });
    res.status(201).json({
      mensaje: "Favorito creado correctamente",
      favorito,
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al crear favorito",
      detalle: error.message,
    });
  }
};

const verFavoritosPorUsuario = async (req, res) => {
  try {
    const favoritos = await favoritosService.verFavoritosPorUsuario(req.usuario.id);
    res.json(favoritos);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al obtener favoritos del usuario",
      detalle: error.message,
    });
  }
};

const eliminarFavorito = async (req, res) => {
  try {
    const { receta_id } = req.params;
    const favorito = await favoritosService.eliminarFavorito(req.usuario.id, receta_id);
    res.json({
      mensaje: favorito ? "Favorito eliminado correctamente" : "Favorito no encontrado",
      favorito: favorito || null,
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al eliminar favorito",
      detalle: error.message,
    });
  }
};

const countFavoritosPorReceta = async (req, res) => {
  try {
    const { receta_id } = req.params;
    const total = await favoritosService.countFavoritosPorReceta(receta_id);
    res.json({ total_favoritos: total });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al contar favoritos de la receta",
      detalle: error.message,
    });
  }
};

const countFavoritosPorUsuario = async (req, res) => {
  try {
    const total = await favoritosService.countFavoritosPorUsuario(req.usuario.id);
    res.json({ total_favoritos: total });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al contar favoritos del usuario",
      detalle: error.message,
    });
  }
};

module.exports = {
  crearFavorito,
  verFavoritosPorUsuario,
  eliminarFavorito,
  countFavoritosPorReceta,
  countFavoritosPorUsuario,
};
