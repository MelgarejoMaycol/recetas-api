const recetasServices = require("../services/recetas.service");

const crearReceta = async (req, res) => {
    try {
        const receta = await recetasServices.crearReceta(req.body, req.file);
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
        const recetasList = await recetasServices.verRecetas();
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
        const { usuario_id } = req.params;
        const misRecetas = await recetasServices.verMisRecetas(usuario_id);
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
    verMisRecetas
};

