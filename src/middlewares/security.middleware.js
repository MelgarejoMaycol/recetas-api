const rateLimit = require("express-rate-limit");

const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX, 10) || 200;
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000;

const isLocalRequest = (req) => {
  const ip = req.ip || req.socket?.remoteAddress || "";
  return ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(ip);
};

const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  limit: RATE_LIMIT_MAX,
  skip: isLocalRequest,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    mensaje: "Demasiadas peticiones, intenta nuevamente mas tarde",
  },
});

module.exports = {
  apiLimiter,
  isLocalRequest,
};
