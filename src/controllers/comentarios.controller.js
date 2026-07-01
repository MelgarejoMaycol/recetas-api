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
    const comentarios = await comentariosService.verComentarios(receta_id, req.query);
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
    const comentarios = await comentariosService.verMisComentarios(req.usuario.id, req.query);
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

const actualizarComentario = async (req, res) => {
  try {
    const comentario = await comentariosService.actualizarComentario(
      req.params.id,
      req.usuario.id,
      req.body
    );
    res.json({
      mensaje: "Comentario actualizado correctamente",
      comentario,
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al actualizar comentario",
      detalle: error.message,
    });
  }
};

const eliminarComentario = async (req, res) => {
  try {
    const comentario = await comentariosService.eliminarComentario(req.params.id, req.usuario.id);
    res.json({
      mensaje: "Comentario eliminado correctamente",
      comentario,
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al eliminar comentario",
      detalle: error.message,
    });
  }
};

module.exports = {
  crearComentario,
  verComentarios,
  verMisComentarios,
  verMejoresRecetas,
  actualizarComentario,
  eliminarComentario,
};
