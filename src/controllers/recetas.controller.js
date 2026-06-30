const recetas = require("../models/recetas.model");

const crearReceta = async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            pais,
            imagenUrl,
            tiempoPreparacion,
            tiempo_preparacion,
            porciones,
            dificultad,
            usuarioId,
            usuario_id,
            categoriaId,
            categoria_id
        } = req.body;
        const imagenReceta = req.file?.path || imagenUrl || null;
        const receta = await recetas.crearReceta(
            nombre,
            descripcion,
            pais,
            imagenReceta,
            tiempoPreparacion || tiempo_preparacion || null,
            porciones || null,
            dificultad || null,
            usuarioId || usuario_id,
            categoriaId || categoria_id
        );
        res.status(201).json({
            mensaje: "Receta creada correctamente",
            receta,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al crear receta",
        });
    }
};

const verRecetas = async (req, res) => {
    try {
        const recetasList = await recetas.verRecetas();
        res.json(recetasList);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al obtener recetas",
        });
    }
};

const verMisRecetas = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const misRecetas = await recetas.verMisRecetas(usuarioId);
        res.json(misRecetas);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al obtener mis recetas",
        });
    }
};

module.exports = {
    crearReceta,
    verRecetas,
    verMisRecetas
};

