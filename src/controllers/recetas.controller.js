const recetas = require("../models/recetas.model");

const crearReceta = async (req, res) => {
    try {
        const { nombre, descripcion, pais, imagenUrl, tiempoPreparacion, porciones, dificultad, usuarioId, categoriaId } = req.body;
        const imagenReceta = req.file?.path || imagenUrl || null;
        const receta = await recetas.crearReceta(nombre, descripcion, pais, imagenReceta, tiempoPreparacion, porciones, dificultad, usuarioId, categoriaId);
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

