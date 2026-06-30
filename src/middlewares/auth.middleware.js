const jwt = require("jsonwebtoken");

const autenticar = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({
      mensaje: "Token requerido",
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      mensaje: "JWT_SECRET no esta configurado",
    });
  }

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "Token invalido o expirado",
    });
  }
};

const autorizarMismoUsuario = (paramName = "usuario_id") => {
  return (req, res, next) => {
    if (String(req.usuario.id) !== String(req.params[paramName])) {
      return res.status(403).json({
        mensaje: "No tienes permiso para acceder a estos datos",
      });
    }

    next();
  };
};

module.exports = {
  autenticar,
  autorizarMismoUsuario,
};
