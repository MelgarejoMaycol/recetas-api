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

const buscarRecetas = async (filtros) => {
    return recetasModel.verRecetas(filtros);
};

const obtenerRecetaPorId = async (id) => {
    if (!id) {
        const error = new Error("id es obligatorio");
        error.statusCode = 400;
        throw error;
    }

    const receta = await recetasModel.obtenerRecetaPorId(id);

    if (!receta) {
        const error = new Error("Receta no encontrada");
        error.statusCode = 404;
        throw error;
    }

    return receta;
};

const actualizarReceta = async (id, usuario_id, datos, archivo) => {
    const recetaActual = await obtenerRecetaPorId(id);

    const {
        nombre = recetaActual.nombre,
        descripcion = recetaActual.descripcion,
        pais = recetaActual.pais,
        imagen_url,
        tiempo_preparacion = recetaActual.tiempo_preparacion,
        porciones = recetaActual.porciones,
        dificultad = recetaActual.dificultad,
        categoria_id = recetaActual.categoria_id
    } = datos;

    const imagenReceta = archivo?.path || imagen_url || null;
    const receta = await recetasModel.actualizarReceta(
        id,
        usuario_id,
        nombre,
        descripcion,
        pais,
        imagenReceta,
        tiempo_preparacion,
        porciones,
        dificultad,
        categoria_id
    );

    if (!receta) {
        const error = new Error("Receta no encontrada o no pertenece al usuario");
        error.statusCode = 404;
        throw error;
    }

    return receta;
};

const eliminarReceta = async (id, usuario_id) => {
    if (!id) {
        const error = new Error("id es obligatorio");
        error.statusCode = 400;
        throw error;
    }

    const receta = await recetasModel.eliminarReceta(id, usuario_id);

    if (!receta) {
        const error = new Error("Receta no encontrada o no pertenece al usuario");
        error.statusCode = 404;
        throw error;
    }

    return receta;
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
    buscarRecetas,
    obtenerRecetaPorId,
    actualizarReceta,
    eliminarReceta,
    verMisRecetas
};
