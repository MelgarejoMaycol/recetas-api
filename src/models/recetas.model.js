const pool = require("../config/db");
const { normalizarPaginacion, crearRespuestaPaginada } = require("../utils/pagination");

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

const camposReceta = `
    SELECT r.id, r.nombre, r.descripcion, r.pais, r.imagen_url,
           r.tiempo_preparacion, r.porciones, r.dificultad,
           r.usuario_id, r.categoria_id, r.fecha_creacion,
           u.nombre AS nombre_usuario, c.nombre AS nombre_categoria
    FROM recetas r
    JOIN usuarios u ON r.usuario_id = u.id
    JOIN categorias_recetas c ON r.categoria_id = c.id
`;

const verRecetas = async ({ q, categoria_id, pais, dificultad, page, limit } = {}) => {
    const condiciones = [];
    const valores = [];
    const paginacion = normalizarPaginacion({ page, limit });

    if (q) {
        valores.push(`%${q}%`);
        condiciones.push(`(r.nombre ILIKE $${valores.length} OR r.descripcion ILIKE $${valores.length})`);
    }

    if (categoria_id) {
        valores.push(categoria_id);
        condiciones.push(`r.categoria_id = $${valores.length}`);
    }

    if (pais) {
        valores.push(`%${pais}%`);
        condiciones.push(`r.pais ILIKE $${valores.length}`);
    }

    if (dificultad) {
        valores.push(dificultad);
        condiciones.push(`r.dificultad = $${valores.length}`);
    }

    const where = condiciones.length ? `WHERE ${condiciones.join(" AND ")}` : "";
    const valoresConsulta = [...valores, paginacion.limit, paginacion.offset];
    const consulta = `
        ${camposReceta}
        ${where}
        ORDER BY r.id DESC
        LIMIT $${valores.length + 1}
        OFFSET $${valores.length + 2};
    `;
    const consultaTotal = `
        SELECT COUNT(*) AS total
        FROM recetas r
        JOIN usuarios u ON r.usuario_id = u.id
        JOIN categorias_recetas c ON r.categoria_id = c.id
        ${where};
    `;
    const [resultado, total] = await Promise.all([
        pool.query(consulta, valoresConsulta),
        pool.query(consultaTotal, valores)
    ]);
    return crearRespuestaPaginada(
        resultado.rows,
        total.rows[0].total,
        paginacion.page,
        paginacion.limit
    );
};

const obtenerRecetaPorId = async (id) => {
    const consulta = `
        ${camposReceta}
        WHERE r.id = $1;
    `;
    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0];
};

const obtenerRecetaPorNombre = async (nombre, idExcluir = null) => {
    const valores = [nombre];
    const condicionExcluir = idExcluir ? "AND id <> $2" : "";

    if (idExcluir) {
        valores.push(idExcluir);
    }

    const consulta = `
        SELECT id, nombre
        FROM recetas
        WHERE LOWER(REGEXP_REPLACE(TRIM(nombre), '\\s+', ' ', 'g')) =
              LOWER(REGEXP_REPLACE(TRIM($1), '\\s+', ' ', 'g'))
        ${condicionExcluir}
        LIMIT 1;
    `;
    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
};

const verRecetasMasValoradas = async ({ page, limit } = {}) => {
    const paginacion = normalizarPaginacion({ page, limit });
    const consulta = `
        SELECT r.id, r.nombre, r.descripcion, r.pais, r.imagen_url,
               r.tiempo_preparacion, r.porciones, r.dificultad,
               r.usuario_id, r.categoria_id, r.fecha_creacion,
               u.nombre AS nombre_usuario, c.nombre AS nombre_categoria,
               ROUND(AVG(co.calificacion)::numeric, 2) AS calificacion_promedio,
               COUNT(co.calificacion)::int AS total_calificaciones
        FROM recetas r
        JOIN usuarios u ON r.usuario_id = u.id
        JOIN categorias_recetas c ON r.categoria_id = c.id
        JOIN comentarios co ON r.id = co.receta_id
        WHERE co.calificacion IS NOT NULL
        GROUP BY r.id, u.nombre, c.nombre
        ORDER BY calificacion_promedio DESC, total_calificaciones DESC, r.id DESC
        LIMIT $1
        OFFSET $2;
    `;
    const consultaTotal = `
        SELECT COUNT(*) AS total
        FROM (
            SELECT r.id
            FROM recetas r
            JOIN comentarios co ON r.id = co.receta_id
            WHERE co.calificacion IS NOT NULL
            GROUP BY r.id
        ) recetas_valoradas;
    `;
    const [resultado, total] = await Promise.all([
        pool.query(consulta, [paginacion.limit, paginacion.offset]),
        pool.query(consultaTotal)
    ]);
    return crearRespuestaPaginada(
        resultado.rows,
        total.rows[0].total,
        paginacion.page,
        paginacion.limit
    );
};

const verRecetasRecientes = async ({ page, limit } = {}) => {
    const paginacion = normalizarPaginacion({ page, limit });
    const consulta = `
        ${camposReceta}
        ORDER BY r.fecha_creacion DESC, r.id DESC
        LIMIT $1
        OFFSET $2;
    `;
    const consultaTotal = `SELECT COUNT(*) AS total FROM recetas;`;
    const [resultado, total] = await Promise.all([
        pool.query(consulta, [paginacion.limit, paginacion.offset]),
        pool.query(consultaTotal)
    ]);
    return crearRespuestaPaginada(
        resultado.rows,
        total.rows[0].total,
        paginacion.page,
        paginacion.limit
    );
};

const actualizarReceta = async (
    id,
    usuarioId,
    nombre,
    descripcion,
    pais,
    imagenUrl,
    tiempoPreparacion,
    porciones,
    dificultad,
    categoriaId
) => {
    const consulta = `
        UPDATE recetas
        SET nombre = $1,
            descripcion = $2,
            pais = $3,
            imagen_url = COALESCE($4, imagen_url),
            tiempo_preparacion = $5,
            porciones = $6,
            dificultad = $7,
            categoria_id = $8
        WHERE id = $9 AND usuario_id = $10
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
        categoriaId,
        id,
        usuarioId
    ];
    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
};

const eliminarReceta = async (id, usuarioId) => {
    const consulta = `
        DELETE FROM recetas
        WHERE id = $1 AND usuario_id = $2
        RETURNING id, nombre, usuario_id;
    `;
    const resultado = await pool.query(consulta, [id, usuarioId]);
    return resultado.rows[0];
};

const verMisRecetas = async (usuarioId, { page, limit } = {}) => {
    const paginacion = normalizarPaginacion({ page, limit });
    const consulta = `
        SELECT r.id, r.nombre, r.descripcion, r.pais, r.imagen_url,
               r.tiempo_preparacion, r.porciones, r.dificultad,
               r.usuario_id, r.categoria_id, r.fecha_creacion,
               u.nombre AS nombre_usuario, c.nombre AS nombre_categoria
        FROM recetas r
        JOIN usuarios u ON r.usuario_id = u.id
        JOIN categorias_recetas c ON r.categoria_id = c.id
        WHERE r.usuario_id = $1
        ORDER BY r.id DESC
        LIMIT $2
        OFFSET $3;
    `;
    const consultaTotal = `
        SELECT COUNT(*) AS total
        FROM recetas
        WHERE usuario_id = $1;
    `;
    const [resultado, total] = await Promise.all([
        pool.query(consulta, [usuarioId, paginacion.limit, paginacion.offset]),
        pool.query(consultaTotal, [usuarioId])
    ]);
    return crearRespuestaPaginada(
        resultado.rows,
        total.rows[0].total,
        paginacion.page,
        paginacion.limit
    );
};

module.exports = {
    crearReceta,
    verRecetas,
    obtenerRecetaPorId,
    obtenerRecetaPorNombre,
    verRecetasMasValoradas,
    verRecetasRecientes,
    actualizarReceta,
    eliminarReceta,
    verMisRecetas,
};
