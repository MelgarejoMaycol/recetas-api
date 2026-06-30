const pool = require("../config/db");

const comentarios = async (receta_id, usuario_id, comentario, calificacion) => {
    const consulta = `
        INSERT INTO comentarios (receta_id, usuario_id, comentario, calificacion)
        VALUES ($1, $2, $3, $4)
        RETURNING id, receta_id, usuario_id, comentario, calificacion, fecha_creacion;
    `;
    const valores = [receta_id, usuario_id, comentario, calificacion];
    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
}

const verComentarios = async (receta_id) => {
    const consulta = `
        SELECT c.id, c.receta_id, c.usuario_id, c.comentario, c.calificacion, c.fecha_creacion,
               u.nombre AS nombre_usuario
        FROM comentarios c
        JOIN usuarios u ON c.usuario_id = u.id
        WHERE c.receta_id = $1
        ORDER BY c.id DESC;
    `;
    const valores = [receta_id];
    const resultado = await pool.query(consulta, valores);
    return resultado.rows;
}

const verMisComentarios = async (usuario_id) => {
    const consulta = `
        SELECT c.id, c.receta_id, c.usuario_id, c.comentario, c.calificacion, c.fecha_creacion,
               r.nombre AS nombre_receta
        FROM comentarios c
        JOIN recetas r ON c.receta_id = r.id
        WHERE c.usuario_id = $1
        ORDER BY c.id DESC;
    `;
    const valores = [usuario_id];
    const resultado = await pool.query(consulta, valores);
    return resultado.rows;
}

const verMejoresRecetas = async () => {
    const consulta = `
        SELECT r.id, r.nombre, r.descripcion, r.pais, r.imagen_url,
               r.tiempo_preparacion, r.porciones, r.dificultad,
               r.usuario_id, r.categoria_id,
               u.nombre AS nombre_usuario, c.nombre AS nombre_categoria,
               AVG(co.calificacion) AS calificacion_promedio
        FROM recetas r
        JOIN usuarios u ON r.usuario_id = u.id
        JOIN categorias_recetas c ON r.categoria_id = c.id
        LEFT JOIN comentarios co ON r.id = co.receta_id
        GROUP BY r.id, u.nombre, c.nombre
        ORDER BY calificacion_promedio DESC
        LIMIT 5;
    `;
    const resultado = await pool.query(consulta);
    return resultado.rows;
}

module.exports = {
    comentarios,
    verComentarios,
    verMisComentarios,
    verMejoresRecetas
};
