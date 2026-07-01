const pool = require("../config/db");
const { normalizarPaginacion, crearRespuestaPaginada } = require("../utils/pagination");

const crearPreparacion = async (receta_id, numero_paso, descripcion) => {
    const consulta = `
        INSERT INTO preparaciones (receta_id, numero_paso, descripcion)
        VALUES ($1, $2, $3)
        RETURNING id, receta_id, numero_paso, descripcion;
    `;
    const valores = [receta_id, numero_paso, descripcion];
    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
}

const verPreparaciones = async ({ page, limit } = {}) => {
    const paginacion = normalizarPaginacion({ page, limit });
    const consulta = `
        SELECT id, receta_id, numero_paso, descripcion
        FROM preparaciones
        ORDER BY receta_id ASC, numero_paso ASC
        LIMIT $1
        OFFSET $2;
    `;
    const consultaTotal = `SELECT COUNT(*) AS total FROM preparaciones;`;
    const [resultado, total] = await Promise.all([
        pool.query(consulta, [paginacion.limit, paginacion.offset]),
        pool.query(consultaTotal)
    ]);
    return crearRespuestaPaginada(resultado.rows, total.rows[0].total, paginacion.page, paginacion.limit);
}

const obtenerPreparacionPorReceta = async (receta_id, { page, limit } = {}) => {
    const paginacion = normalizarPaginacion({ page, limit });
    const consulta = `
        SELECT id, receta_id, numero_paso, descripcion
        FROM preparaciones p
        WHERE receta_id = $1
        ORDER BY numero_paso ASC
        LIMIT $2
        OFFSET $3;
    `;
    const consultaTotal = `SELECT COUNT(*) AS total FROM preparaciones WHERE receta_id = $1;`;
    const [resultado, total] = await Promise.all([
        pool.query(consulta, [receta_id, paginacion.limit, paginacion.offset]),
        pool.query(consultaTotal, [receta_id])
    ]);
    return crearRespuestaPaginada(resultado.rows, total.rows[0].total, paginacion.page, paginacion.limit);
}

const obtenerPreparacionPorNumeroPaso = async (receta_id, numero_paso) => {
    const consulta = `
        SELECT id, receta_id, numero_paso, descripcion
        FROM preparaciones
        WHERE receta_id = $1 AND numero_paso = $2;
    `;
    const valores = [receta_id, numero_paso];
    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
}

module.exports = {
    crearPreparacion,
    verPreparaciones,
    obtenerPreparacionPorReceta,
    obtenerPreparacionPorNumeroPaso
};
