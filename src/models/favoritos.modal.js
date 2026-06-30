const pool = require("../config/db");

const crearFavorito = async (usuario_id, receta_id) => {
    const consulta = `
        INSERT INTO favoritos (usuario_id, receta_id)
        VALUES ($1, $2)
        RETURNING id, usuario_id, receta_id;
    `;
    const valores = [usuario_id, receta_id];
    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
}

const verFavoritosPorUsuario = async (usuario_id) => {
    const consulta = `
        SELECT f.id, f.usuario_id, f.receta_id,
               r.nombre AS nombre_receta
        FROM favoritos f
        JOIN recetas r ON f.receta_id = r.id
        WHERE f.usuario_id = $1
        ORDER BY f.id DESC;
    `;
    const valores = [usuario_id];
    const resultado = await pool.query(consulta, valores);
    return resultado.rows;
}

const eliminarFavorito = async (usuario_id, receta_id) => {
    const consulta = `
        DELETE FROM favoritos
        WHERE usuario_id = $1 AND receta_id = $2
        RETURNING id, usuario_id, receta_id;
    `;
    const valores = [usuario_id, receta_id];
    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
}

const countFavoritosPorReceta = async (receta_id) => {
    const consulta = `
        SELECT COUNT(*) AS total_favoritos
        FROM favoritos
        WHERE receta_id = $1;
    `;
    const valores = [receta_id];
    const resultado = await pool.query(consulta, valores);
    return parseInt(resultado.rows[0].total_favoritos, 10);
}

const countFavoritosPorUsuario = async (usuario_id) => {
    const consulta = `
        SELECT COUNT(*) AS total_favoritos
        FROM favoritos
        WHERE usuario_id = $1;
    `;
    const valores = [usuario_id];
    const resultado = await pool.query(consulta, valores);
    return parseInt(resultado.rows[0].total_favoritos, 10);
}

module.exports = {
    crearFavorito,
    verFavoritosPorUsuario,
    eliminarFavorito,
    countFavoritosPorReceta,
    countFavoritosPorUsuario
};