const swaggerJsdoc = require("swagger-jsdoc");

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Recetas API",
      version: "1.0.0",
      description: "API REST para usuarios, recetas, categorias, ingredientes, favoritos y comentarios.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        UsuarioRegistro: {
          type: "object",
          required: ["nombre", "email", "password"],
          properties: {
            nombre: { type: "string", example: "Maycol" },
            email: { type: "string", example: "maycol@gmail.com" },
            password: { type: "string", example: "123456" },
          },
        },
        Login: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "maycol@gmail.com" },
            password: { type: "string", example: "123456" },
          },
        },
        Receta: {
          type: "object",
          required: ["nombre", "categoria_id"],
          properties: {
            nombre: { type: "string", example: "Arroz con pollo" },
            descripcion: { type: "string", example: "Receta casera" },
            pais: { type: "string", example: "Colombia" },
            imagen_url: { type: "string", example: "https://example.com/imagen.png" },
            tiempo_preparacion: { type: "integer", example: 45 },
            porciones: { type: "integer", example: 4 },
            dificultad: { type: "string", example: "Facil" },
            categoria_id: { type: "integer", example: 1 },
          },
        },
        Nombre: {
          type: "object",
          required: ["nombre"],
          properties: {
            nombre: { type: "string", example: "Desayunos" },
          },
        },
        Ingrediente: {
          type: "object",
          required: ["nombre", "categoria_id"],
          properties: {
            nombre: { type: "string", example: "Arroz" },
            categoria_id: { type: "integer", example: 1 },
          },
        },
        Comentario: {
          type: "object",
          required: ["receta_id", "comentario"],
          properties: {
            receta_id: { type: "integer", example: 1 },
            comentario: { type: "string", example: "Muy buena receta" },
            calificacion: { type: "integer", example: 5 },
          },
        },
        Favorito: {
          type: "object",
          required: ["receta_id"],
          properties: {
            receta_id: { type: "integer", example: 1 },
          },
        },
        Preparacion: {
          type: "object",
          required: ["receta_id", "numero_paso", "descripcion"],
          properties: {
            receta_id: { type: "integer", example: 1 },
            numero_paso: { type: "integer", example: 1 },
            descripcion: { type: "string", example: "Mezclar los ingredientes" },
          },
        },
        RecetaIngrediente: {
          type: "object",
          required: ["receta_id", "ingrediente_id"],
          properties: {
            receta_id: { type: "integer", example: 1 },
            ingrediente_id: { type: "integer", example: 1 },
            cantidad: { type: "string", example: "1" },
            unidad: { type: "string", example: "taza" },
          },
        },
      },
      parameters: {
        Page: {
          in: "query",
          name: "page",
          schema: { type: "integer", minimum: 1 },
          required: false,
        },
        Limit: {
          in: "query",
          name: "limit",
          schema: { type: "integer", minimum: 1, maximum: 100 },
          required: false,
        },
      },
    },
    paths: {
      "/api/usuarios": {
        get: {
          tags: ["Usuarios"],
          summary: "Listar usuarios",
          parameters: [{ $ref: "#/components/parameters/Page" }, { $ref: "#/components/parameters/Limit" }],
          responses: { 200: { description: "Usuarios listados" } },
        },
        post: {
          tags: ["Usuarios"],
          summary: "Registrar usuario",
          requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/UsuarioRegistro" } } } },
          responses: { 201: { description: "Usuario creado" }, 400: { description: "Datos invalidos" } },
        },
      },
      "/api/usuarios/login": {
        post: {
          tags: ["Usuarios"],
          summary: "Iniciar sesion",
          requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Login" } } } },
          responses: { 200: { description: "Login correcto" }, 401: { description: "Credenciales incorrectas" } },
        },
      },
      "/api/recetas": {
        get: {
          tags: ["Recetas"],
          summary: "Listar, buscar y filtrar recetas",
          parameters: [
            { $ref: "#/components/parameters/Page" },
            { $ref: "#/components/parameters/Limit" },
            { in: "query", name: "q", schema: { type: "string" } },
            { in: "query", name: "categoria_id", schema: { type: "integer" } },
            { in: "query", name: "pais", schema: { type: "string" } },
            { in: "query", name: "dificultad", schema: { type: "string" } },
          ],
          responses: { 200: { description: "Recetas listadas" } },
        },
        post: {
          tags: ["Recetas"],
          summary: "Crear receta",
          security: [{ bearerAuth: [] }],
          requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Receta" } } } },
          responses: { 201: { description: "Receta creada" }, 401: { description: "Token requerido" } },
        },
      },
      "/api/recetas/{id}": {
        get: {
          tags: ["Recetas"],
          summary: "Obtener receta por ID",
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Receta encontrada" }, 404: { description: "No encontrada" } },
        },
        put: {
          tags: ["Recetas"],
          summary: "Actualizar receta propia",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
          requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Receta" } } } },
          responses: { 200: { description: "Receta actualizada" } },
        },
        delete: {
          tags: ["Recetas"],
          summary: "Eliminar receta propia",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Receta eliminada" } },
        },
      },
      "/api/recetas/mis-recetas/{usuario_id}": {
        get: {
          tags: ["Recetas"],
          summary: "Listar recetas del usuario autenticado",
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: "path", name: "usuario_id", required: true, schema: { type: "integer" } },
            { $ref: "#/components/parameters/Page" },
            { $ref: "#/components/parameters/Limit" },
          ],
          responses: { 200: { description: "Recetas del usuario" }, 403: { description: "Sin permiso" } },
        },
      },
    },
  },
  apis: [],
});

module.exports = swaggerSpec;
