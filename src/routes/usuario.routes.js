const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuario.controller");

router.post("/", usuarioController.crearUsuario);
router.get("/", usuarioController.obtenerUsuarios);
router.post("/login", usuarioController.loginUsuario);

module.exports = router;