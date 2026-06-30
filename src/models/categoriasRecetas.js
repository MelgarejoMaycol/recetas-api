const pool = require("../config/db");

const crearCategoriaRecetas = async (nombre) => {
    const consulta = `
        INSERT INTO categorias_recetas (nombre)
        VALUES ($1)
        RETURNING id, nombre;
    `;
    const valores = [nombre];
    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
};

const verCategoriasRecetas = async () => {
    const consulta = `
        SELECT id, nombre
        FROM categorias_recetas
        ORDER BY id DESC;
    `;
    const resultado = await pool.query(consulta);
    return resultado.rows;
};

module.exports = {
    crearCategoriaRecetas,
    verCategoriasRecetas,
};