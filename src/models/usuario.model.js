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

module.exports = {
  crearUsuario,
  obtenerUsuarios,
};