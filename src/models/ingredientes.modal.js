const pool = require("../config/db");
const { normalizarPaginacion, crearRespuestaPaginada } = require("../utils/pagination");

const crearIngrediente = async (nombre, categoria_id) => {
    const consulta = `
        INSERT INTO ingredientes (nombre, categoria_id)
        VALUES ($1, $2)
        RETURNING id, nombre, categoria_id;
    `;
    const valores = [nombre, categoria_id];
    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
}

const verIngredientes = async ({ page, limit } = {}) => {
    const paginacion = normalizarPaginacion({ page, limit });
    const consulta = `
        SELECT i.id, i.nombre, i.categoria_id,
               c.nombre AS nombre_categoria 
        FROM ingredientes i
        JOIN categorias_ingredientes c ON i.categoria_id = c.id
        ORDER BY i.id DESC
        LIMIT $1
        OFFSET $2;
    `;
    const consultaTotal = `
        SELECT COUNT(*) AS total
        FROM ingredientes i
        JOIN categorias_ingredientes c ON i.categoria_id = c.id;
    `;
    const [resultado, total] = await Promise.all([
        pool.query(consulta, [paginacion.limit, paginacion.offset]),
        pool.query(consultaTotal)
    ]);
    return crearRespuestaPaginada(resultado.rows, total.rows[0].total, paginacion.page, paginacion.limit);
}

const obtenerIngredientePorId = async (id) => {
    const consulta = `
        SELECT i.id, i.nombre, i.categoria_id,
               c.nombre AS nombre_categoria
        FROM ingredientes i
        JOIN categorias_ingredientes c ON i.categoria_id = c.id
        WHERE i.id = $1;
    `;
    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0];
}

const actualizarIngrediente = async (id, nombre, categoria_id) => {
    const consulta = `
        UPDATE ingredientes
        SET nombre = $1,
            categoria_id = $2
        WHERE id = $3
        RETURNING id, nombre, categoria_id;
    `;
    const resultado = await pool.query(consulta, [nombre, categoria_id, id]);
    return resultado.rows[0];
}

const eliminarIngrediente = async (id) => {
    const consulta = `
        DELETE FROM ingredientes
        WHERE id = $1
        RETURNING id, nombre, categoria_id;
    `;
    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0];
}

module.exports = {
    crearIngrediente,
    verIngredientes,
    obtenerIngredientePorId,
    actualizarIngrediente,
    eliminarIngrediente
};
