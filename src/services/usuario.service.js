const usuarioModel = require("../models/usuario.model");

const crearUsuario = async ({ nombre, email, password }) => {
  if (!nombre || !email || !password) {
    const error = new Error("Nombre, email y password son obligatorios");
    error.statusCode = 400;
    throw error;
  }

  return usuarioModel.crearUsuario(nombre, email, password);
};

const obtenerUsuarios = async () => {
  return usuarioModel.obtenerUsuarios();
};

module.exports = {
  crearUsuario,
  obtenerUsuarios,
};
