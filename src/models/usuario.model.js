const pool = require("../config/db");
const { normalizarPaginacion, crearRespuestaPaginada } = require("../utils/pagination");

const crearUsuario = async (nombre, email, password) => {
  const consulta = `
    INSERT INTO usuarios (nombre, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, nombre, email, fecha_creacion;
  `;

  const valores = [nombre, email, password];

  const resultado = await pool.query(consulta, valores);

  return resultado.rows[0];
};

const obtenerUsuarios = async ({ page, limit } = {}) => {
  const paginacion = normalizarPaginacion({ page, limit });
  const consulta = `
    SELECT nombre
    FROM usuarios
    ORDER BY id DESC
    LIMIT $1
    OFFSET $2;
  `;
  const consultaTotal = `SELECT COUNT(*) AS total FROM usuarios;`;

  const [resultado, total] = await Promise.all([
    pool.query(consulta, [paginacion.limit, paginacion.offset]),
    pool.query(consultaTotal),
  ]);

  return crearRespuestaPaginada(resultado.rows, total.rows[0].total, paginacion.page, paginacion.limit);
};

const obtenerUsuarioPorId = async (id) => {
  const consulta = `
    SELECT id, nombre, email, fecha_creacion
    FROM usuarios
    WHERE id = $1;
  `;

  const resultado = await pool.query(consulta, [id]);

  return resultado.rows[0];
};

const actualizarDatos = async (id, nombre, email) => {
  const consulta = `
    UPDATE usuarios
    SET nombre = $1, email = $2
    WHERE id = $3
    RETURNING id, nombre, email, fecha_creacion;
  `;
  const valores = [nombre, email, id];
  const resultado = await pool.query(consulta, valores);
   
  return resultado.rows[0];
};

const buscarUsuarioPorEmail = async (email) => {
  const consulta = `
    SELECT id, nombre, email, password
    FROM usuarios
    WHERE email = $1;
  `;

  const resultado = await pool.query(consulta, [email]);

  return resultado.rows[0];
};

const actualizarPassword = async (id, password) => {
  const consulta = `
    UPDATE usuarios
    SET password = $1
    WHERE id = $2
    RETURNING id, nombre, email, fecha_creacion;
  `;

  const resultado = await pool.query(consulta, [password, id]);

  return resultado.rows[0];
};

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  buscarUsuarioPorEmail,
  actualizarPassword,
  actualizarDatos,
};
