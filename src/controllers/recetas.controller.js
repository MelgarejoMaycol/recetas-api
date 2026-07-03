const recetasServices = require("../services/recetas.service");

const crearReceta = async (req, res) => {
    try {
        const receta = await recetasServices.crearReceta(
            {
                ...req.body,
                usuario_id: req.usuario.id,
            },
            req.file
        );
        res.status(201).json({
            mensaje: "Receta creada correctamente",
            receta,
        });
    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).json({
            mensaje: "Error al crear receta",
            detalle: error.message,
        });
    }
};

const verRecetas = async (req, res) => {
    try {
        const recetasList = await recetasServices.buscarRecetas(req.query);
        res.json(recetasList);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al obtener recetas",
        });
    }
};

const obtenerRecetaPorId = async (req, res) => {
    try {
        const receta = await recetasServices.obtenerRecetaPorId(req.params.id);
        res.json(receta);
    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).json({
            mensaje: "Error al obtener receta",
            detalle: error.message,
        });
    }
};

const verRecetasMasValoradas = async (req, res) => {
    try {
        const recetas = await recetasServices.verRecetasMasValoradas(req.query);
        res.json(recetas);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al obtener recetas mas valoradas",
        });
    }
};

const verRecetasRecientes = async (req, res) => {
    try {
        const recetas = await recetasServices.verRecetasRecientes(req.query);
        res.json(recetas);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al obtener recetas recientes",
        });
    }
};

const actualizarReceta = async (req, res) => {
    try {
        const receta = await recetasServices.actualizarReceta(
            req.params.id,
            req.usuario.id,
            req.body,
            req.file
        );
        res.json({
            mensaje: "Receta actualizada correctamente",
            receta,
        });
    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).json({
            mensaje: "Error al actualizar receta",
            detalle: error.message,
        });
    }
};

const eliminarReceta = async (req, res) => {
    try {
        const receta = await recetasServices.eliminarReceta(req.params.id, req.usuario.id);
        res.json({
            mensaje: "Receta eliminada correctamente",
            receta,
        });
    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).json({
            mensaje: "Error al eliminar receta",
            detalle: error.message,
        });
    }
};

const verMisRecetas = async (req, res) => {
    try {
        const misRecetas = await recetasServices.verMisRecetas(req.usuario.id, req.query);
        res.json(misRecetas);
    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).json({
            mensaje: "Error al obtener mis recetas",
            detalle: error.message,
        });
    }
};

module.exports = {
    crearReceta,
    verRecetas,
    obtenerRecetaPorId,
    verRecetasMasValoradas,
    verRecetasRecientes,
    actualizarReceta,
    eliminarReceta,
    verMisRecetas
};

