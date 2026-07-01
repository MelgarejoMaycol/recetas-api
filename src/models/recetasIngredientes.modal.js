const pool = require("../config/db");
const { normalizarPaginacion, crearRespuestaPaginada } = require("../utils/pagination");

const crearRecetaIngrediente = async (receta_id, ingrediente_id, cantidad, unidad) => {
    const consulta = `
        INSERT INTO receta_ingredientes (receta_id, ingrediente_id, cantidad, unidad)
        VALUES ($1, $2, $3, $4)
        RETURNING id, receta_id, ingrediente_id, cantidad, unidad;
    `;
    const valores = [receta_id, ingrediente_id, cantidad, unidad];
    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
}

const verIngredientesPorReceta = async (receta_id, { page, limit } = {}) => {
    const paginacion = normalizarPaginacion({ page, limit });
    const consulta = `
        SELECT ri.id, ri.cantidad, ri.unidad,
               i.id AS ingrediente_id, i.nombre AS nombre_ingrediente,
               c.id AS categoria_id, c.nombre AS nombre_categoria,
                r.id AS receta_id, r.nombre AS nombre_receta,
                u.id AS usuario_id, u.nombre AS nombre_usuario,
                cat.id AS categoria_receta_id, cat.nombre AS nombre_categoria_receta
        FROM receta_ingredientes ri
        JOIN ingredientes i ON ri.ingrediente_id = i.id
        JOIN categorias_ingredientes c ON i.categoria_id = c.id
        JOIN recetas r ON ri.receta_id = r.id
        JOIN usuarios u ON r.usuario_id = u.id
        JOIN categorias_recetas cat ON r.categoria_id = cat.id
        WHERE ri.receta_id = $1
        ORDER BY ri.id DESC
        LIMIT $2
        OFFSET $3;
    `;
    const consultaTotal = `SELECT COUNT(*) AS total FROM receta_ingredientes WHERE receta_id = $1;`;
    const [resultado, total] = await Promise.all([
        pool.query(consulta, [receta_id, paginacion.limit, paginacion.offset]),
        pool.query(consultaTotal, [receta_id])
    ]);
    return crearRespuestaPaginada(resultado.rows, total.rows[0].total, paginacion.page, paginacion.limit);
}

const actualizarRecetaIngrediente = async (id, cantidad, unidad) => {
    const consulta = `
        UPDATE receta_ingredientes
        SET cantidad = $1,
            unidad = $2
        WHERE id = $3
        RETURNING id, receta_id, ingrediente_id, cantidad, unidad;
    `;
    const resultado = await pool.query(consulta, [cantidad, unidad, id]);
    return resultado.rows[0];
}

const eliminarRecetaIngrediente = async (id) => {
    const consulta = `
        DELETE FROM receta_ingredientes
        WHERE id = $1
        RETURNING id, receta_id, ingrediente_id, cantidad, unidad;
    `;
    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0];
}

const recetaIngredientePerteneceUsuario = async (id, usuario_id) => {
    const consulta = `
        SELECT ri.id
        FROM receta_ingredientes ri
        JOIN recetas r ON ri.receta_id = r.id
        WHERE ri.id = $1 AND r.usuario_id = $2;
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
    crearRecetaIngrediente,
    verIngredientesPorReceta,
    actualizarRecetaIngrediente,
    eliminarRecetaIngrediente,
    recetaIngredientePerteneceUsuario,
    recetaPerteneceUsuario
};
