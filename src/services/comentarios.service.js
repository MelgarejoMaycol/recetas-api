const comentariosModel = require("../models/comentarios.modal");

const crearComentario = async ({ receta_id, usuario_id, comentario, calificacion }) => {
  if (!receta_id || !usuario_id || !comentario) {
    const error = new Error("receta_id, usuario_id y comentario son obligatorios");
    error.statusCode = 400;
    throw error;
  }

  return comentariosModel.comentarios(receta_id, usuario_id, comentario, calificacion || null);
};

const verComentarios = async (receta_id, paginacion) => {
  if (!receta_id) {
    const error = new Error("receta_id es obligatorio");
    error.statusCode = 400;
    throw error;
  }

  return comentariosModel.verComentarios(receta_id, paginacion);
};

const verMisComentarios = async (usuario_id, paginacion) => {
  if (!usuario_id) {
    const error = new Error("usuario_id es obligatorio");
    error.statusCode = 400;
    throw error;
  }

  return comentariosModel.verMisComentarios(usuario_id, paginacion);
};

const verMejoresRecetas = async () => {
  return comentariosModel.verMejoresRecetas();
};

const actualizarComentario = async (id, usuario_id, { comentario, calificacion }) => {
  if (!comentario) {
    const error = new Error("comentario es obligatorio");
    error.statusCode = 400;
    throw error;
  }

  const comentarioActualizado = await comentariosModel.actualizarComentario(
    id,
    usuario_id,
    comentario,
    calificacion || null
  );

  if (!comentarioActualizado) {
    const error = new Error("Comentario no encontrado o no pertenece al usuario");
    error.statusCode = 404;
    throw error;
  }

  return comentarioActualizado;
};

const eliminarComentario = async (id, usuario_id) => {
  const comentario = await comentariosModel.eliminarComentario(id, usuario_id);

  if (!comentario) {
    const error = new Error("Comentario no encontrado o no pertenece al usuario");
    error.statusCode = 404;
    throw error;
  }

  return comentario;
};

module.exports = {
  crearComentario,
  verComentarios,
  verMisComentarios,
  verMejoresRecetas,
  actualizarComentario,
  eliminarComentario,
};
