const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuario.controller");
const { validators, validarBody, validarQuery, paginacionRules } = require("../middlewares/validation.middleware");

const usuarioRules = [
  validators.required("nombre"),
  validators.string("nombre", "nombre", { min: 2, max: 100 }),
  validators.required("email"),
  validators.email("email"),
  validators.required("password"),
  validators.string("password", "password", { min: 6, max: 100 }),
];

const loginRules = [
  validators.required("email"),
  validators.email("email"),
  validators.required("password"),
  validators.string("password", "password", { min: 6, max: 100 }),
];

router.post("/", validarBody(usuarioRules), usuarioController.crearUsuario);
router.get("/", validarQuery(paginacionRules), usuarioController.obtenerUsuarios);
router.post("/login", validarBody(loginRules), usuarioController.loginUsuario);

module.exports = router;
