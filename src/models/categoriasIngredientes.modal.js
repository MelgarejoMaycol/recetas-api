const pool = require("../config/db");
const { normalizarPaginacion, crearRespuestaPaginada } = require("../utils/pagination");

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

const verCategoriasIngredientes = async ({ page, limit } = {}) => {
    const paginacion = normalizarPaginacion({ page, limit });
    const consulta = `
        SELECT id, nombre
        FROM categorias_ingredientes
        ORDER BY id DESC
        LIMIT $1
        OFFSET $2;
    `;
    const consultaTotal = `SELECT COUNT(*) AS total FROM categorias_ingredientes;`;
    const [resultado, total] = await Promise.all([
        pool.query(consulta, [paginacion.limit, paginacion.offset]),
        pool.query(consultaTotal)
    ]);
    return crearRespuestaPaginada(resultado.rows, total.rows[0].total, paginacion.page, paginacion.limit);
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
