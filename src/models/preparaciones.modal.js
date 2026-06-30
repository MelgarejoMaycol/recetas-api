const pool = require("../config/db");

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

const verPreparaciones = async () => {
    const consulta = `
        SELECT id, receta_id, numero_paso, descripcion
        FROM preparaciones
        ORDER BY receta_id ASC, numero_paso ASC;
    `;
    const resultado = await pool.query(consulta);
    return resultado.rows;
}

const obtenerPreparacionPorReceta = async (receta_id) => {
    const consulta = `
        SELECT id, receta_id, numero_paso, descripcion
        FROM preparaciones p
        WHERE receta_id = $1
        ORDER BY numero_paso ASC;
    `;
    const valores = [receta_id];
    const resultado = await pool.query(consulta, valores);
    return resultado.rows;
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
