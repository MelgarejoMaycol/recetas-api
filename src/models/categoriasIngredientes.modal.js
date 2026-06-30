const pool = require("../config/db");

const crearCategoriaIngrediente = async (nombre) => {
    const consulta = `
        INSERT INTO categorias_ingredientes (nombre)
        VALUES ($1)
        RETURNING id, nombre;
    `;
    const valores = [nombre];
    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
};

const verCategoriasIngredientes = async () => {
    const consulta = `
        SELECT id, nombre
        FROM categorias_ingredientes
        ORDER BY id DESC;
    `;
    const resultado = await pool.query(consulta);
    return resultado.rows;
};

module.exports = {
    crearCategoriaIngrediente,
    verCategoriasIngredientes,
};