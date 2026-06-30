const pool = require("../config/db");

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

const obtenerUsuarios = async () => {
  const consulta = `
    SELECT id, nombre, email, fecha_creacion
    FROM usuarios
    ORDER BY id DESC;
  `;

  const resultado = await pool.query(consulta);

  return resultado.rows;
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
  buscarUsuarioPorEmail,
  actualizarPassword,
};
