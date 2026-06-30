const comentariosService = require("../services/comentarios.service");

const crearComentario = async (req, res) => {
  try {
    const comentario = await comentariosService.crearComentario({
      ...req.body,
      usuario_id: req.usuario.id,
    });
    res.status(201).json({
      mensaje: "Comentario creado correctamente",
      comentario,
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al crear comentario",
      detalle: error.message,
    });
  }
};

const verComentarios = async (req, res) => {
  try {
    const { receta_id } = req.params;
    const comentarios = await comentariosService.verComentarios(receta_id);
    res.json(comentarios);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al obtener comentarios",
      detalle: error.message,
    });
  }
};

const verMisComentarios = async (req, res) => {
  try {
    const comentarios = await comentariosService.verMisComentarios(req.usuario.id);
    res.json(comentarios);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al obtener comentarios del usuario",
      detalle: error.message,
    });
  }
};

const verMejoresRecetas = async (req, res) => {
  try {
    const recetas = await comentariosService.verMejoresRecetas();
    res.json(recetas);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtener mejores recetas",
      detalle: error.message,
    });
  }
};

module.exports = {
  crearComentario,
  verComentarios,
  verMisComentarios,
  verMejoresRecetas,
};
