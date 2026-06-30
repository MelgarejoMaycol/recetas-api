const pool = require("../config/db");

const crearReceta = async (
    nombre,
    descripcion,
    pais,
    imagenUrl,
    tiempoPreparacion,
    porciones,
    dificultad,
    usuarioId,
    categoriaId
) => {
    const consulta = `
        INSERT INTO recetas (
            nombre,
            descripcion,
            pais,
            imagen_url,
            tiempo_preparacion,
            porciones,
            dificultad,
            usuario_id,
            categoria_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, nombre, descripcion, pais, imagen_url, tiempo_preparacion,
                  porciones, dificultad, usuario_id, categoria_id, fecha_creacion;
    `;
    const valores = [
        nombre,
        descripcion,
        pais,
        imagenUrl,
        tiempoPreparacion,
        porciones,
        dificultad,
        usuarioId,
        categoriaId
    ];
    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
}

const verRecetas = async () => {
    const consulta = `
        SELECT r.id, r.nombre, r.descripcion, r.pais, r.imagen_url,
               r.tiempo_preparacion, r.porciones, r.dificultad,
               r.usuario_id, r.categoria_id, r.fecha_creacion,
               u.nombre AS nombre_usuario, c.nombre AS nombre_categoria
        FROM recetas r
        JOIN usuarios u ON r.usuario_id = u.id
        JOIN categorias_recetas c ON r.categoria_id = c.id
        ORDER BY r.id DESC;
    `;
    const resultado = await pool.query(consulta);
    return resultado.rows;
};

const verMisRecetas = async (usuarioId) => {
    const consulta = `
        SELECT r.id, r.nombre, r.descripcion, r.pais, r.imagen_url,
               r.tiempo_preparacion, r.porciones, r.dificultad,
               r.usuario_id, r.categoria_id, r.fecha_creacion,
               u.nombre AS nombre_usuario, c.nombre AS nombre_categoria
        FROM recetas r
        JOIN usuarios u ON r.usuario_id = u.id
        JOIN categorias_recetas c ON r.categoria_id = c.id
        WHERE r.usuario_id = $1
        ORDER BY r.id DESC;
    `;
    const valores = [usuarioId];
    const resultado = await pool.query(consulta, valores);
    return resultado.rows;
};

module.exports = {
    crearReceta,
    verRecetas,
    verMisRecetas,
};
