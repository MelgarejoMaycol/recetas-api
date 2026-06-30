const usuarioModel = require("../models/usuario.model");

const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const usuario = await usuarioModel.crearUsuario(nombre, email, password);

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      usuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al crear usuario",
    });
  }
};

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioModel.obtenerUsuarios();

    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtener usuarios",
    });
  }
};

module.exports = {
  crearUsuario,
  obtenerUsuarios,
};