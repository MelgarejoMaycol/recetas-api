# Recetas API

API REST para gestionar recetas, usuarios, categorias, ingredientes, preparaciones, comentarios y favoritos.

Proyecto creado por **Maycol Melgarejo**  
Contacto: **mfmelgarejo04@gmail.com**

## URL de Produccion

```text
https://recetas-api-j4p8.onrender.com
```

## Documentacion Swagger

```text
https://recetas-api-j4p8.onrender.com/api-docs
```

JSON de OpenAPI:

```text
https://recetas-api-j4p8.onrender.com/api-docs.json
```

## Tecnologias

- Node.js
- Express
- PostgreSQL
- JWT
- bcrypt
- Multer
- Cloudinary
- Helmet
- Express Rate Limit
- Swagger

## Instalacion Local

Clonar el repositorio:

```bash
git clone https://github.com/MelgarejoMaycol/recetas-api.git
cd recetas-api
```

Instalar dependencias:

```bash
npm install
```

Crear el archivo `.env` usando como base `.env.example`:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Ejecutar en desarrollo:

```bash
npm run dev
```

Ejecutar en produccion/local:

```bash
npm start
```

La API local queda disponible en:

```text
http://localhost:3000
```

## Variables de Entorno

```env
PORT=3000
CORS_ORIGIN=*

DB_HOST=HOST-BASEDEDATOS.COM
DB_PORT=5432
DB_NAME=NOMBRE-BASEDEDATOS
DB_USER=USUARIO-BASEDEDATOS
DB_PASSWORD=CONTRASENA-BASEDEDATOS
DB_SSL=true

CLOUDINARY_CLOUD_NAME=NOMBRE-CLOUDINARY
CLOUDINARY_API_KEY=API-KEY-CLOUDINARY
CLOUDINARY_API_SECRET=API-SECRET-CLOUDINARY

JWT_SECRET=CAMBIA-ESTE-SECRETO
JWT_EXPIRES_IN=1d
```

## Scripts Disponibles

```bash
npm start
```

Inicia el servidor con `node src/server.js`.

```bash
npm run dev
```

Inicia el servidor con `nodemon`.

```bash
npm run check
```

Valida sintaxis basica de archivos principales.

```bash
npm run test:smoke
```

Ejecuta una prueba rapida de rutas principales, Swagger, seguridad y validaciones.

## Autenticacion

Las rutas privadas usan JWT.

Primero se debe iniciar sesion:

```http
POST /api/usuarios/login
```

Body:

```json
{
  "email": "usuario@email.com",
  "password": "123456"
}
```

Respuesta:

```json
{
  "mensaje": "Login correcto",
  "usuario": {
    "id": 1,
    "nombre": "Usuario",
    "email": "usuario@email.com"
  },
  "token": "TOKEN_JWT"
}
```

Luego se envia el token en las rutas privadas:

```http
Authorization: Bearer TOKEN_JWT
```

## Formato de Paginacion

Los listados paginados aceptan:

```text
?page=1&limit=10
```

Respuesta:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

## Endpoints

Base local:

```text
http://localhost:3000
```

Base produccion:

```text
https://recetas-api-j4p8.onrender.com
```

### Sistema

| Metodo | Endpoint | Privado | Descripcion |
|---|---|---:|---|
| GET | `/` | No | Verifica que la API esta funcionando |
| GET | `/api-docs` | No | Documentacion Swagger |
| GET | `/api-docs.json` | No | Documento OpenAPI en JSON |

### Usuarios

| Metodo | Endpoint | Privado | Descripcion |
|---|---|---:|---|
| POST | `/api/usuarios` | No | Registrar usuario |
| GET | `/api/usuarios?page=1&limit=10` | No | Listar usuarios publicos, solo muestra `nombre` |
| GET | `/api/usuarios/me` | Si | Ver informacion personal del usuario logueado |
| PUT | `/api/usuarios/me` | Si | Actualizar informacion personal del usuario logueado |
| POST | `/api/usuarios/login` | No | Iniciar sesion |

El listado publico de usuarios no muestra correo ni password. La respuesta solo incluye nombres:

```json
{
  "data": [
    {
      "nombre": "Maycol"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

Registro:

```json
{
  "nombre": "Maycol",
  "email": "maycol@email.com",
  "password": "123456"
}
```

Login:

```json
{
  "email": "maycol@email.com",
  "password": "123456"
}
```

Ver informacion personal:

```http
GET /api/usuarios/me
Authorization: Bearer TOKEN_JWT
```

Respuesta:

```json
{
  "id": 1,
  "nombre": "Maycol",
  "email": "maycol@email.com",
  "fecha_creacion": "2026-07-01T00:00:00.000Z"
}
```

Actualizar informacion personal:

```http
PUT /api/usuarios/me
Authorization: Bearer TOKEN_JWT
```

Body:

```json
{
  "nombre": "Maycol Melgarejo",
  "email": "maycol.nuevo@email.com"
}
```

La contraseña nunca se devuelve en las respuestas de la API.

### Recetas

| Metodo | Endpoint | Privado | Descripcion |
|---|---|---:|---|
| GET | `/api/recetas?page=1&limit=10` | No | Listar recetas |
| GET | `/api/recetas/:id` | No | Obtener receta por ID |
| GET | `/api/recetas/mis-recetas/:usuario_id?page=1&limit=10` | Si | Ver recetas del usuario logueado |
| POST | `/api/recetas` | Si | Crear receta |
| PUT | `/api/recetas/:id` | Si | Actualizar receta propia |
| DELETE | `/api/recetas/:id` | Si | Eliminar receta propia |

Filtros disponibles:

```text
/api/recetas?q=arroz&categoria_id=1&pais=Colombia&dificultad=Facil&page=1&limit=10
```

Crear receta con JSON:

```json
{
  "nombre": "Arroz con pollo",
  "descripcion": "Receta casera",
  "pais": "Colombia",
  "imagen_url": "https://example.com/imagen.jpg",
  "tiempo_preparacion": 45,
  "porciones": 4,
  "dificultad": "Facil",
  "categoria_id": 1
}
```

Crear receta con imagen desde Postman:

- Metodo: `POST`
- URL: `/api/recetas`
- Authorization: `Bearer TOKEN_JWT`
- Body: `form-data`
- Campos:
  - `nombre`: texto
  - `descripcion`: texto
  - `pais`: texto
  - `tiempo_preparacion`: texto/numero
  - `porciones`: texto/numero
  - `dificultad`: texto
  - `categoria_id`: texto/numero
  - `imagen`: archivo

El campo del archivo debe llamarse exactamente:

```text
imagen
```

### Categorias de Recetas

| Metodo | Endpoint | Privado | Descripcion |
|---|---|---:|---|
| GET | `/api/categorias-recetas?page=1&limit=10` | No | Listar categorias |
| GET | `/api/categorias-recetas/:id` | No | Obtener categoria por ID |
| POST | `/api/categorias-recetas` | Si | Crear categoria |
| PUT | `/api/categorias-recetas/:id` | Si | Actualizar categoria |
| DELETE | `/api/categorias-recetas/:id` | Si | Eliminar categoria |

Body:

```json
{
  "nombre": "Almuerzos"
}
```

### Categorias de Ingredientes

| Metodo | Endpoint | Privado | Descripcion |
|---|---|---:|---|
| GET | `/api/categorias-ingredientes?page=1&limit=10` | No | Listar categorias |
| GET | `/api/categorias-ingredientes/:id` | No | Obtener categoria por ID |
| POST | `/api/categorias-ingredientes` | Si | Crear categoria |
| PUT | `/api/categorias-ingredientes/:id` | Si | Actualizar categoria |
| DELETE | `/api/categorias-ingredientes/:id` | Si | Eliminar categoria |

Body:

```json
{
  "nombre": "Verduras"
}
```

### Ingredientes

| Metodo | Endpoint | Privado | Descripcion |
|---|---|---:|---|
| GET | `/api/ingredientes?page=1&limit=10` | No | Listar ingredientes |
| GET | `/api/ingredientes/:id` | No | Obtener ingrediente por ID |
| POST | `/api/ingredientes` | Si | Crear ingrediente |
| PUT | `/api/ingredientes/:id` | Si | Actualizar ingrediente |
| DELETE | `/api/ingredientes/:id` | Si | Eliminar ingrediente |

Body:

```json
{
  "nombre": "Tomate",
  "categoria_id": 1
}
```

### Preparaciones

| Metodo | Endpoint | Privado | Descripcion |
|---|---|---:|---|
| GET | `/api/preparaciones?page=1&limit=10` | No | Listar preparaciones |
| GET | `/api/preparaciones/receta/:receta_id?page=1&limit=10` | No | Ver pasos de una receta |
| GET | `/api/preparaciones/receta/:receta_id/paso/:numero_paso` | No | Ver un paso especifico |
| POST | `/api/preparaciones` | Si | Crear preparacion para una receta propia |
| PUT | `/api/preparaciones/:id` | Si | Actualizar preparacion propia |
| DELETE | `/api/preparaciones/:id` | Si | Eliminar preparacion propia |

Body:

```json
{
  "receta_id": 1,
  "numero_paso": 1,
  "descripcion": "Lavar y cortar los ingredientes"
}
```

### Receta Ingredientes

| Metodo | Endpoint | Privado | Descripcion |
|---|---|---:|---|
| GET | `/api/recetas-ingredientes/receta/:receta_id?page=1&limit=10` | No | Listar ingredientes de una receta |
| POST | `/api/recetas-ingredientes` | Si | Agregar ingrediente a receta propia |
| PUT | `/api/recetas-ingredientes/:id` | Si | Actualizar cantidad/unidad |
| DELETE | `/api/recetas-ingredientes/:id` | Si | Eliminar ingrediente de receta propia |

Body:

```json
{
  "receta_id": 1,
  "ingrediente_id": 2,
  "cantidad": "1",
  "unidad": "taza"
}
```

### Comentarios

| Metodo | Endpoint | Privado | Descripcion |
|---|---|---:|---|
| POST | `/api/comentarios` | Si | Crear comentario |
| GET | `/api/comentarios/mejores-recetas` | No | Ver mejores recetas por calificacion |
| GET | `/api/comentarios/receta/:receta_id?page=1&limit=10` | No | Ver comentarios de una receta |
| GET | `/api/comentarios/usuario/:usuario_id?page=1&limit=10` | Si | Ver comentarios del usuario logueado |
| PUT | `/api/comentarios/:id` | Si | Actualizar comentario propio |
| DELETE | `/api/comentarios/:id` | Si | Eliminar comentario propio |

Body:

```json
{
  "receta_id": 1,
  "comentario": "Muy buena receta",
  "calificacion": 5
}
```

### Favoritos

| Metodo | Endpoint | Privado | Descripcion |
|---|---|---:|---|
| POST | `/api/favoritos` | Si | Agregar receta a favoritos |
| GET | `/api/favoritos/usuario/:usuario_id?page=1&limit=10` | Si | Ver favoritos del usuario logueado |
| GET | `/api/favoritos/usuario/:usuario_id/count` | Si | Contar favoritos del usuario |
| GET | `/api/favoritos/receta/:receta_id/count` | No | Contar favoritos de una receta |
| DELETE | `/api/favoritos/usuario/:usuario_id/receta/:receta_id` | Si | Eliminar favorito |

Body:

```json
{
  "receta_id": 1
}
```

## Codigos de Respuesta Comunes

| Codigo | Significado |
|---:|---|
| 200 | Solicitud correcta |
| 201 | Recurso creado |
| 400 | Datos invalidos |
| 401 | Token requerido, invalido o expirado |
| 403 | Sin permiso para acceder a esos datos |
| 404 | Recurso o ruta no encontrada |
| 409 | Conflicto, por ejemplo email ya registrado |
| 500 | Error interno del servidor |

## Seguridad

La API incluye:

- Autenticacion con JWT.
- Passwords encriptados con bcrypt.
- Rutas privadas protegidas.
- Validaciones formales de body, params y query.
- Helmet para headers de seguridad.
- Rate limit basico de 100 peticiones por ventana.
- `.env` ignorado por Git.
- `.env.example` incluido como plantilla segura.

## Pruebas

Ejecutar validacion basica:

```bash
npm run check
```

Ejecutar smoke test:

```bash
npm run test:smoke
```

Verificar vulnerabilidades:

```bash
npm audit --audit-level=high
```

## Despliegue en Render

Comandos recomendados:

Build Command:

```bash
npm install
```

Start Command:

```bash
npm start
```

Tambien funciona:

```bash
node index.js
```

Configurar en Render las mismas variables de entorno del archivo `.env.example`.

Nota: si la API esta desplegada en un plan gratuito o con ahorro de recursos, puede apagarse o quedar en reposo despues de un tiempo sin uso. Al abrir el enlace principal o hacer una nueva peticion, el servicio puede tardar unos segundos en responder mientras vuelve a iniciar.

## Autor

Creado por **Maycol Melgarejo**  
Email: **mfmelgarejo04@gmail.com**
