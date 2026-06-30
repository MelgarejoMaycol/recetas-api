const pool = require("../config/db");

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

const verIngredientes = async () => {
    const consulta = `
        SELECT i.id, i.nombre, i.categoria_id,
               c.nombre AS nombre_categoria 
        FROM ingredientes i
        JOIN categorias_ingredientes c ON i.categoria_id = c.id
        ORDER BY i.id DESC;
    `;
    const resultado = await pool.query(consulta);
    return resultado.rows;
}

module.exports = {
    crearIngrediente,
    verIngredientes
};