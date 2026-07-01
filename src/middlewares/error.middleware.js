const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, req, res, _next) => {
  const statusCode = error.statusCode || error.status || 500;
  const response = {
    mensaje: statusCode === 500 ? "Error interno del servidor" : error.message,
  };

  if (process.env.NODE_ENV !== "production") {
    response.detalle = error.message;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  notFound,
  errorHandler,
};
