const pool = require("../config/db");
const { normalizarPaginacion, crearRespuestaPaginada } = require("../utils/pagination");

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

const verCategoriasRecetas = async ({ page, limit } = {}) => {
    const paginacion = normalizarPaginacion({ page, limit });
    const consulta = `
        SELECT id, nombre
        FROM categorias_recetas
        ORDER BY id DESC
        LIMIT $1
        OFFSET $2;
    `;
    const consultaTotal = `SELECT COUNT(*) AS total FROM categorias_recetas;`;
    const [resultado, total] = await Promise.all([
        pool.query(consulta, [paginacion.limit, paginacion.offset]),
        pool.query(consultaTotal)
    ]);
    return crearRespuestaPaginada(resultado.rows, total.rows[0].total, paginacion.page, paginacion.limit);
};

const obtenerCategoriaRecetaPorId = async (id) => {
    const consulta = `
        SELECT id, nombre
        FROM categorias_recetas
        WHERE id = $1;
    `;
    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0];
};

const actualizarCategoriaReceta = async (id, nombre) => {
    const consulta = `
        UPDATE categorias_recetas
        SET nombre = $1
        WHERE id = $2
        RETURNING id, nombre;
    `;
    const resultado = await pool.query(consulta, [nombre, id]);
    return resultado.rows[0];
};

const eliminarCategoriaReceta = async (id) => {
    const consulta = `
        DELETE FROM categorias_recetas
        WHERE id = $1
        RETURNING id, nombre;
    `;
    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0];
};

module.exports = {
    crearCategoriaRecetas,
    verCategoriasRecetas,
    obtenerCategoriaRecetaPorId,
    actualizarCategoriaReceta,
    eliminarCategoriaReceta,
};
