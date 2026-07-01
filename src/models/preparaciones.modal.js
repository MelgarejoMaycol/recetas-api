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

const actualizarPreparacion = async (id, numero_paso, descripcion) => {
    const consulta = `
        UPDATE preparaciones
        SET numero_paso = $1,
            descripcion = $2
        WHERE id = $3
        RETURNING id, receta_id, numero_paso, descripcion;
    `;
    const resultado = await pool.query(consulta, [numero_paso, descripcion, id]);
    return resultado.rows[0];
}

const eliminarPreparacion = async (id) => {
    const consulta = `
        DELETE FROM preparaciones
        WHERE id = $1
        RETURNING id, receta_id, numero_paso, descripcion;
    `;
    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0];
}

const preparacionPerteneceUsuario = async (id, usuario_id) => {
    const consulta = `
        SELECT p.id
        FROM preparaciones p
        JOIN recetas r ON p.receta_id = r.id
        WHERE p.id = $1 AND r.usuario_id = $2;
    `;
    const resultado = await pool.query(consulta, [id, usuario_id]);
    return Boolean(resultado.rows[0]);
}

const recetaPerteneceUsuario = async (receta_id, usuario_id) => {
    const consulta = `
        SELECT id
        FROM recetas
        WHERE id = $1 AND usuario_id = $2;
    `;
    const resultado = await pool.query(consulta, [receta_id, usuario_id]);
    return Boolean(resultado.rows[0]);
}

module.exports = {
    crearPreparacion,
    verPreparaciones,
    obtenerPreparacionPorReceta,
    obtenerPreparacionPorNumeroPaso,
    actualizarPreparacion,
    eliminarPreparacion,
    preparacionPerteneceUsuario,
    recetaPerteneceUsuario
};
