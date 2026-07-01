const isBlank = (value) => value === undefined || value === null || value === "";

const validators = {
  required: (field, label = field) => (source) =>
    isBlank(source[field]) ? `${label} es obligatorio` : null,

  string: (field, label = field, { min = 1, max = 255 } = {}) => (source) => {
    const value = source[field];
    if (isBlank(value)) return null;
    if (typeof value !== "string") return `${label} debe ser texto`;
    const trimmed = value.trim();
    if (trimmed.length < min) return `${label} debe tener al menos ${min} caracteres`;
    if (trimmed.length > max) return `${label} no debe superar ${max} caracteres`;
    return null;
  },

  email: (field, label = field) => (source) => {
    const value = source[field];
    if (isBlank(value)) return null;
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
    return valid ? null : `${label} debe ser un email valido`;
  },

  integer: (field, label = field, { min, max } = {}) => (source) => {
    const value = source[field];
    if (isBlank(value)) return null;
    const number = Number(value);
    if (!Number.isInteger(number)) return `${label} debe ser un numero entero`;
    if (min !== undefined && number < min) return `${label} debe ser mayor o igual a ${min}`;
    if (max !== undefined && number > max) return `${label} debe ser menor o igual a ${max}`;
    return null;
  },

  enum: (field, values, label = field) => (source) => {
    const value = source[field];
    if (isBlank(value)) return null;
    return values.includes(value) ? null : `${label} debe ser uno de: ${values.join(", ")}`;
  },

  url: (field, label = field) => (source) => {
    const value = source[field];
    if (isBlank(value)) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return `${label} debe ser una URL valida`;
    }
  },
};

const validar = (rules, sourceName = "body") => {
  return (req, res, next) => {
    const source = req[sourceName] || {};
    const errores = rules
      .map((rule) => rule(source, req))
      .filter(Boolean);

    if (errores.length) {
      return res.status(400).json({
        mensaje: "Datos invalidos",
        errores,
      });
    }

    next();
  };
};

const validarBody = (rules) => validar(rules, "body");
const validarParams = (rules) => validar(rules, "params");
const validarQuery = (rules) => validar(rules, "query");

const paginacionRules = [
  validators.integer("page", "page", { min: 1 }),
  validators.integer("limit", "limit", { min: 1, max: 100 }),
];

const idParamRules = (field = "id") => [
  validators.required(field, field),
  validators.integer(field, field, { min: 1 }),
];

module.exports = {
  validators,
  validar,
  validarBody,
  validarParams,
  validarQuery,
  paginacionRules,
  idParamRules,
};
