const usuarioModel = require("../models/usuario.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const crearUsuario = async ({ nombre, email, password }) => {
  if (!nombre || !email || !password) {
    const error = new Error("Nombre, email y password son obligatorios");
    error.statusCode = 400;
    throw error;
  }

  const nombreNormalizado = nombre.trim();
  const emailNormalizado = email.trim().toLowerCase();

  const usuarioExistente = await usuarioModel.buscarUsuarioPorEmail(emailNormalizado);

  if (usuarioExistente) {
    const error = new Error("El email ya esta registrado");
    error.statusCode = 409;
    throw error;
  }

  const passwordEncriptada = await bcrypt.hash(password, 10);

  try {
    return await usuarioModel.crearUsuario(nombreNormalizado, emailNormalizado, passwordEncriptada);
  } catch (error) {
    if (error.code === "23505") {
      const conflict = new Error("El email ya esta registrado");
      conflict.statusCode = 409;
      throw conflict;
    }
    throw error;
  }
};

const obtenerUsuarios = async (paginacion) => {
  return usuarioModel.obtenerUsuarios(paginacion);
};

const obtenerMiPerfil = async (usuario_id) => {
  const usuario = await usuarioModel.obtenerUsuarioPorId(usuario_id);

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return usuario;
};

const actualizarMiPerfil = async (usuario_id, { nombre, email }) => {
  const usuarioActual = await obtenerMiPerfil(usuario_id);
  const nuevoNombre = nombre ? nombre.trim() : usuarioActual.nombre;
  const nuevoEmail = email ? email.trim().toLowerCase() : usuarioActual.email;

  if (email && email !== usuarioActual.email) {
    const usuarioExistente = await usuarioModel.buscarUsuarioPorEmail(email);

    if (usuarioExistente && String(usuarioExistente.id) !== String(usuario_id)) {
      const error = new Error("El email ya esta registrado");
      error.statusCode = 409;
      throw error;
    }
  }

  return usuarioModel.actualizarDatos(usuario_id, nuevoNombre, nuevoEmail);
};

const loginUsuario = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error("Email y password son obligatorios");
    error.statusCode = 400;
    throw error;
  }

  const emailNormalizado = email.trim().toLowerCase();
  const usuario = await usuarioModel.buscarUsuarioPorEmail(emailNormalizado);

  if (!usuario) {
    const error = new Error("Credenciales incorrectas");
    error.statusCode = 401;
    throw error;
  }

  const passwordGuardada = usuario.password || "";
  const passwordEstaEncriptada = /^\$2[aby]\$/.test(passwordGuardada);
  const passwordValida = passwordEstaEncriptada
    ? await bcrypt.compare(password, passwordGuardada)
    : password === passwordGuardada;

  if (!passwordValida) {
    const error = new Error("Credenciales incorrectas");
    error.statusCode = 401;
    throw error;
  }

  if (!process.env.JWT_SECRET) {
    const error = new Error("JWT_SECRET no esta configurado");
    error.statusCode = 500;
    throw error;
  }

  if (!passwordEstaEncriptada) {
    const passwordEncriptada = await bcrypt.hash(password, 10);
    await usuarioModel.actualizarPassword(usuario.id, passwordEncriptada);
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );

  return {
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
    },
    token,
  };
};

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  obtenerMiPerfil,
  actualizarMiPerfil,
  loginUsuario,
};
