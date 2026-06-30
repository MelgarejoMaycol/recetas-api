const comentariosModel = require("../models/comentarios.modal");

const crearComentario = async ({ receta_id, usuario_id, comentario, calificacion }) => {
  if (!receta_id || !usuario_id || !comentario) {
    const error = new Error("receta_id, usuario_id y comentario son obligatorios");
    error.statusCode = 400;
    throw error;
  }

  return comentariosModel.comentarios(receta_id, usuario_id, comentario, calificacion || null);
};

const verComentarios = async (receta_id) => {
  if (!receta_id) {
    const error = new Error("receta_id es obligatorio");
    error.statusCode = 400;
    throw error;
  }

  return comentariosModel.verComentarios(receta_id);
};

const verMisComentarios = async (usuario_id) => {
  if (!usuario_id) {
    const error = new Error("usuario_id es obligatorio");
    error.statusCode = 400;
    throw error;
  }

  return comentariosModel.verMisComentarios(usuario_id);
};

const verMejoresRecetas = async () => {
  return comentariosModel.verMejoresRecetas();
};

module.exports = {
  crearComentario,
  verComentarios,
  verMisComentarios,
  verMejoresRecetas,
};
