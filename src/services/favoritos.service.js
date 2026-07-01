const favoritosModel = require("../models/favoritos.modal");

const crearFavorito = async ({ usuario_id, receta_id }) => {
  if (!usuario_id || !receta_id) {
    const error = new Error("usuario_id y receta_id son obligatorios");
    error.statusCode = 400;
    throw error;
  }

  return favoritosModel.crearFavorito(usuario_id, receta_id);
};

const verFavoritosPorUsuario = async (usuario_id, paginacion) => {
  if (!usuario_id) {
    const error = new Error("usuario_id es obligatorio");
    error.statusCode = 400;
    throw error;
  }

  return favoritosModel.verFavoritosPorUsuario(usuario_id, paginacion);
};

const eliminarFavorito = async (usuario_id, receta_id) => {
  if (!usuario_id || !receta_id) {
    const error = new Error("usuario_id y receta_id son obligatorios");
    error.statusCode = 400;
    throw error;
  }

  return favoritosModel.eliminarFavorito(usuario_id, receta_id);
};

const countFavoritosPorReceta = async (receta_id) => {
  if (!receta_id) {
    const error = new Error("receta_id es obligatorio");
    error.statusCode = 400;
    throw error;
  }

  return favoritosModel.countFavoritosPorReceta(receta_id);
};

const countFavoritosPorUsuario = async (usuario_id) => {
  if (!usuario_id) {
    const error = new Error("usuario_id es obligatorio");
    error.statusCode = 400;
    throw error;
  }

  return favoritosModel.countFavoritosPorUsuario(usuario_id);
};

module.exports = {
  crearFavorito,
  verFavoritosPorUsuario,
  eliminarFavorito,
  countFavoritosPorReceta,
  countFavoritosPorUsuario,
};
