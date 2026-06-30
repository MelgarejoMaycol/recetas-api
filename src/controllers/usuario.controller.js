const usuarioService = require("../services/usuario.service");

const crearUsuario = async (req, res) => {
  try {
    const usuario = await usuarioService.crearUsuario(req.body);

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      usuario,
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      mensaje: "Error al crear usuario",
      detalle: error.message,
    });
  }
};

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.obtenerUsuarios();

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
