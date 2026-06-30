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

const obtenerCategoriaIngredientePorId = async (id) => {
    const consulta = `
        SELECT id, nombre
        FROM categorias_ingredientes
        WHERE id = $1;
    `;
    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0];
};

const actualizarCategoriaIngrediente = async (id, nombre) => {
    const consulta = `
        UPDATE categorias_ingredientes
        SET nombre = $1
        WHERE id = $2
        RETURNING id, nombre;
    `;
    const resultado = await pool.query(consulta, [nombre, id]);
    return resultado.rows[0];
};

const eliminarCategoriaIngrediente = async (id) => {
    const consulta = `
        DELETE FROM categorias_ingredientes
        WHERE id = $1
        RETURNING id, nombre;
    `;
    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0];
};

module.exports = {
    crearCategoriaIngrediente,
    verCategoriasIngredientes,
    obtenerCategoriaIngredientePorId,
    actualizarCategoriaIngrediente,
    eliminarCategoriaIngrediente,
};
