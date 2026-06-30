const recetasModel = require("../models/recetas.model");

const crearReceta = async (datos, archivo) => {
    const {
        nombre,
        descripcion,
        pais,
        imagen_url,
        tiempo_preparacion,
        porciones,
        dificultad,
        usuario_id,
        categoria_id
    } = datos;

    const imagenReceta = archivo?.path || imagen_url || null;

    if (!nombre || !usuario_id || !categoria_id) {
        const error = new Error("Nombre, usuario_id y categoria_id son obligatorios");
        error.statusCode = 400;
        throw error;
    }

    return recetasModel.crearReceta(
        nombre,
        descripcion || null,
        pais || null,
        imagenReceta,
        tiempo_preparacion || null,
        porciones || null,
        dificultad || null,
        usuario_id,
        categoria_id
    );
};

const verRecetas = async () => {
    return recetasModel.verRecetas();
};

const verMisRecetas = async (usuario_id) => {
    if (!usuario_id) {
        const error = new Error("usuario_id es obligatorio");
        error.statusCode = 400;
        throw error;
    }

    return recetasModel.verMisRecetas(usuario_id);
};

module.exports = {
    crearReceta,
    verRecetas,
    verMisRecetas
};
