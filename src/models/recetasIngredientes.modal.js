const pool = require("../config/db");

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

const verIngredientesPorReceta = async (receta_id) => {
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
        ORDER BY ri.id DESC;
    `;
    const valores = [receta_id];
    const resultado = await pool.query(consulta, valores);
    return resultado.rows;
}

module.exports = {
    crearRecetaIngrediente,
    verIngredientesPorReceta
};
