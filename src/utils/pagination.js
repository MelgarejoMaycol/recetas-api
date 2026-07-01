const normalizarPaginacion = ({ page = 1, limit = 10 } = {}) => {
  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
  const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const offset = (pageNumber - 1) * limitNumber;

  return {
    page: pageNumber,
    limit: limitNumber,
    offset,
  };
};

const crearRespuestaPaginada = (data, total, page, limit) => {
  const totalNumber = Number(total) || 0;
  const totalPages = Math.ceil(totalNumber / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total: totalNumber,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

module.exports = {
  normalizarPaginacion,
  crearRespuestaPaginada,
};
