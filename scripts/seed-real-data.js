const bcrypt = require("bcrypt");
const { setTimeout: sleep } = require("timers/promises");
const pool = require("../src/config/db");

const API_BASE_URL = process.env.THEMEALDB_BASE_URL || "https://www.themealdb.com/api/json/v1/1";
const RECIPE_LIMIT = Number.parseInt(process.env.SEED_RECIPE_LIMIT || "200", 10);
const REQUEST_CONCURRENCY = Number.parseInt(process.env.SEED_REQUEST_CONCURRENCY || "3", 10);
const REQUEST_RETRIES = Number.parseInt(process.env.SEED_REQUEST_RETRIES || "4", 10);
const DEFAULT_PASSWORD = process.env.SEED_USER_PASSWORD || "Recetas123";
const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

const seedUsers = [
  { nombre: "Laura Martinez", email: "laura.martinez@seed.recetas.local" },
  { nombre: "Carlos Ramirez", email: "carlos.ramirez@seed.recetas.local" },
  { nombre: "Ana Gomez", email: "ana.gomez@seed.recetas.local" },
  { nombre: "Diego Torres", email: "diego.torres@seed.recetas.local" },
  { nombre: "Valentina Rojas", email: "valentina.rojas@seed.recetas.local" },
  { nombre: "Mateo Herrera", email: "mateo.herrera@seed.recetas.local" },
  { nombre: "Sofia Castillo", email: "sofia.castillo@seed.recetas.local" },
  { nombre: "Andres Vargas", email: "andres.vargas@seed.recetas.local" },
];

const comentariosSeed = [
  "La prepare en casa y quedo muy buena.",
  "Excelente receta para compartir en familia.",
  "Los pasos estan claros y el resultado vale la pena.",
  "Me gusto mucho el balance de sabores.",
  "Queda perfecta siguiendo las cantidades indicadas.",
  "Buena opcion para variar el menu de la semana.",
];

const ingredientCategoryRules = [
  { categoria: "Carnes", words: ["beef", "pork", "lamb", "chicken", "turkey", "bacon", "ham", "sausage", "duck"] },
  { categoria: "Pescados y Mariscos", words: ["fish", "salmon", "tuna", "cod", "shrimp", "prawn", "crab", "mussels", "squid"] },
  { categoria: "Lacteos", words: ["milk", "cheese", "cream", "butter", "yogurt", "parmesan", "mozzarella", "cheddar"] },
  { categoria: "Verduras", words: ["onion", "tomato", "pepper", "carrot", "lettuce", "spinach", "cabbage", "potato", "garlic"] },
  { categoria: "Frutas", words: ["apple", "banana", "lemon", "lime", "orange", "strawberry", "mango", "pineapple"] },
  { categoria: "Cereales y Harinas", words: ["flour", "rice", "pasta", "noodle", "bread", "oats", "corn", "tortilla"] },
  { categoria: "Hierbas y Especias", words: ["salt", "pepper", "cumin", "paprika", "cinnamon", "basil", "parsley", "thyme", "oregano"] },
  { categoria: "Aceites y Salsas", words: ["oil", "sauce", "vinegar", "mustard", "ketchup", "mayonnaise", "soy"] },
];

const dificultadPorIndice = ["Facil", "Media", "Dificil"];

const normalizeRecipeName = (name) => name.trim().replace(/\s+/g, " ").toLowerCase();

const fetchJson = async (url) => {
  for (let attempt = 1; attempt <= REQUEST_RETRIES + 1; attempt += 1) {
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    }

    if ((response.status === 429 || response.status >= 500) && attempt <= REQUEST_RETRIES) {
      const retryAfter = Number.parseInt(response.headers.get("retry-after") || "0", 10);
      const waitMs = retryAfter > 0 ? retryAfter * 1000 : 1000 * attempt * attempt;
      await sleep(waitMs);
      continue;
    }

    throw new Error(`Error consultando ${url}: ${response.status} ${response.statusText}`);
  }

  throw new Error(`No se pudo consultar ${url}`);
};

const mapLimit = async (items, limit, mapper) => {
  const results = new Array(items.length);
  let nextIndex = 0;

  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  });

  await Promise.all(workers);
  return results;
};

const upsertByName = async (client, table, nombre) => {
  const result = await client.query(
    `INSERT INTO ${table} (nombre)
     VALUES ($1)
     ON CONFLICT (nombre) DO UPDATE SET nombre = EXCLUDED.nombre
     RETURNING id, nombre;`,
    [nombre]
  );
  return result.rows[0];
};

const getIngredientCategory = (ingredientName) => {
  const normalized = ingredientName.toLowerCase();
  const rule = ingredientCategoryRules.find((item) => item.words.some((word) => normalized.includes(word)));
  return rule ? rule.categoria : "General";
};

const splitInstructions = (instructions) => {
  if (!instructions) return [];
  const normalized = instructions.replace(/\r/g, "\n").replace(/\n{2,}/g, "\n");
  const pieces = normalized
    .split(/\n+|(?<=[.!?])\s+(?=[A-Z])/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 8);

  if (pieces.length <= 8) return pieces;
  return pieces.slice(0, 8);
};

const getIngredients = (meal) => {
  const ingredients = [];
  for (let index = 1; index <= 20; index += 1) {
    const name = meal[`strIngredient${index}`] ? meal[`strIngredient${index}`].trim() : "";
    const measure = meal[`strMeasure${index}`] ? meal[`strMeasure${index}`].trim() : "";
    if (name) {
      ingredients.push({
        nombre: name,
        cantidad: measure || null,
        unidad: null,
      });
    }
  }
  return ingredients;
};

const ensureUsers = async (client) => {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const users = [];

  for (const user of seedUsers) {
    const result = await client.query(
      `INSERT INTO usuarios (nombre, email, password)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET nombre = EXCLUDED.nombre
       RETURNING id, nombre, email;`,
      [user.nombre, user.email, passwordHash]
    );
    users.push(result.rows[0]);
  }

  return users;
};

const collectMealIds = async () => {
  const mealsById = new Map();

  const mealsByLetter = await mapLimit(ALPHABET, REQUEST_CONCURRENCY, async (letter) => {
    const payload = await fetchJson(`${API_BASE_URL}/search.php?f=${letter}`);
    return (payload.meals || []).map((meal) => ({
      id: meal.idMeal,
      category: meal.strCategory || "General",
    }));
  });

  for (const meal of mealsByLetter.flat()) {
    mealsById.set(meal.id, meal);
  }

  const categoriesPayload = await fetchJson(`${API_BASE_URL}/categories.php`);
  const categories = categoriesPayload.categories || [];
  const categoryMeals = await mapLimit(categories, REQUEST_CONCURRENCY, async (category) => {
    const payload = await fetchJson(`${API_BASE_URL}/filter.php?c=${encodeURIComponent(category.strCategory)}`);
    return (payload.meals || []).map((meal) => ({
      id: meal.idMeal,
      category: category.strCategory,
    }));
  });

  for (const meal of categoryMeals.flat()) {
    if (!mealsById.has(meal.id)) {
      mealsById.set(meal.id, meal);
    }
  }

  return Array.from(mealsById.values()).slice(0, RECIPE_LIMIT);
};

const getMealDetails = async (mealId) => {
  const payload = await fetchJson(`${API_BASE_URL}/lookup.php?i=${encodeURIComponent(mealId)}`);
  return payload.meals && payload.meals[0] ? payload.meals[0] : null;
};

const findOrCreateIngredient = async (client, ingredientName, categoryId) => {
  const existing = await client.query(
    `SELECT id, nombre, categoria_id
     FROM ingredientes
     WHERE LOWER(nombre) = LOWER($1)
     LIMIT 1;`,
    [ingredientName]
  );

  if (existing.rows[0]) return existing.rows[0];

  const inserted = await client.query(
    `INSERT INTO ingredientes (nombre, categoria_id)
     VALUES ($1, $2)
     RETURNING id, nombre, categoria_id;`,
    [ingredientName, categoryId]
  );

  return inserted.rows[0];
};

const findOrCreateRecipe = async (client, meal, userId, categoryId, index) => {
  const existing = await client.query(
    `SELECT id, nombre
     FROM recetas
     WHERE LOWER(REGEXP_REPLACE(TRIM(nombre), '\\s+', ' ', 'g')) = $1
     LIMIT 1;`,
    [normalizeRecipeName(meal.strMeal)]
  );

  if (existing.rows[0]) {
    return { receta: existing.rows[0], created: false };
  }

  const instructions = splitInstructions(meal.strInstructions);
  const inserted = await client.query(
    `INSERT INTO recetas (
       nombre, descripcion, pais, imagen_url, tiempo_preparacion,
       porciones, dificultad, usuario_id, categoria_id
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, nombre;`,
    [
      meal.strMeal,
      instructions[0] || meal.strInstructions || "Receta importada desde TheMealDB.",
      meal.strArea || "Internacional",
      meal.strMealThumb || null,
      20 + ((index % 7) * 5),
      2 + (index % 5),
      dificultadPorIndice[index % dificultadPorIndice.length],
      userId,
      categoryId,
    ]
  );

  return { receta: inserted.rows[0], created: true };
};

const syncRecipeDetails = async (client, recetaId, meal, categoryCache) => {
  const ingredients = getIngredients(meal);

  for (const ingredient of ingredients) {
    const categoryName = getIngredientCategory(ingredient.nombre);
    if (!categoryCache.has(categoryName)) {
      categoryCache.set(categoryName, await upsertByName(client, "categorias_ingredientes", categoryName));
    }

    const savedIngredient = await findOrCreateIngredient(client, ingredient.nombre, categoryCache.get(categoryName).id);
    await client.query(
      `INSERT INTO receta_ingredientes (receta_id, ingrediente_id, cantidad, unidad)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (receta_id, ingrediente_id)
       DO UPDATE SET cantidad = EXCLUDED.cantidad, unidad = EXCLUDED.unidad;`,
      [recetaId, savedIngredient.id, ingredient.cantidad, ingredient.unidad]
    );
  }

  const steps = splitInstructions(meal.strInstructions);
  if (steps.length) {
    await client.query("DELETE FROM preparaciones WHERE receta_id = $1;", [recetaId]);
    for (const [index, step] of steps.entries()) {
      await client.query(
        `INSERT INTO preparaciones (receta_id, numero_paso, descripcion)
         VALUES ($1, $2, $3);`,
        [recetaId, index + 1, step]
      );
    }
  }
};

const createSocialData = async (client, users, recipeIds) => {
  let comentarios = 0;
  let favoritos = 0;

  for (const [index, recetaId] of recipeIds.entries()) {
    const commentUsers = users.filter((_, userIndex) => userIndex % 3 === index % 3).slice(0, 3);
    for (const [commentIndex, user] of commentUsers.entries()) {
      const comentario = comentariosSeed[(index + commentIndex) % comentariosSeed.length];
      const exists = await client.query(
        `SELECT id FROM comentarios
         WHERE receta_id = $1 AND usuario_id = $2 AND comentario = $3
         LIMIT 1;`,
        [recetaId, user.id, comentario]
      );

      if (!exists.rows[0]) {
        await client.query(
          `INSERT INTO comentarios (receta_id, usuario_id, comentario, calificacion)
           VALUES ($1, $2, $3, $4);`,
          [recetaId, user.id, comentario, 3 + ((index + commentIndex) % 3)]
        );
        comentarios += 1;
      }
    }

    const favoriteUsers = users.filter((_, userIndex) => (userIndex + index) % 2 === 0).slice(0, 4);
    for (const user of favoriteUsers) {
      const result = await client.query(
        `INSERT INTO favoritos (usuario_id, receta_id)
         VALUES ($1, $2)
         ON CONFLICT (usuario_id, receta_id) DO NOTHING
         RETURNING id;`,
        [user.id, recetaId]
      );
      favoritos += result.rowCount;
    }
  }

  return { comentarios, favoritos };
};

const main = async () => {
  if (!Number.isInteger(RECIPE_LIMIT) || RECIPE_LIMIT < 1) {
    throw new Error("SEED_RECIPE_LIMIT debe ser un numero entero mayor a 0.");
  }

  if (!Number.isInteger(REQUEST_CONCURRENCY) || REQUEST_CONCURRENCY < 1) {
    throw new Error("SEED_REQUEST_CONCURRENCY debe ser un numero entero mayor a 0.");
  }

  if (!Number.isInteger(REQUEST_RETRIES) || REQUEST_RETRIES < 0) {
    throw new Error("SEED_REQUEST_RETRIES debe ser un numero entero mayor o igual a 0.");
  }

  let client;
  const summary = {
    usuarios: 0,
    categoriasRecetas: 0,
    categoriasIngredientes: 0,
    recetasNuevas: 0,
    recetasProcesadas: 0,
    comentarios: 0,
    favoritos: 0,
  };

  try {
    console.log(`Consultando TheMealDB para importar hasta ${RECIPE_LIMIT} recetas reales...`);
    const mealRefs = await collectMealIds();
    let downloaded = 0;
    const mealNames = new Set();
    const meals = (await mapLimit(mealRefs, REQUEST_CONCURRENCY, async (mealRef) => {
      const meal = await getMealDetails(mealRef.id);
      downloaded += 1;
      process.stdout.write(`\rRecetas descargadas: ${downloaded}/${mealRefs.length}`);
      return meal && meal.strMeal ? { meal, category: mealRef.category } : null;
    })).filter((item) => {
      if (!item) return false;
      const normalizedName = normalizeRecipeName(item.meal.strMeal);
      if (mealNames.has(normalizedName)) return false;
      mealNames.add(normalizedName);
      return true;
    });

    process.stdout.write("\n");
    client = await pool.connect();

    await client.query("BEGIN");
    const users = await ensureUsers(client);
    summary.usuarios = users.length;

    const recipeCategoryCache = new Map();
    const ingredientCategoryCache = new Map();
    const recipeIds = [];

    for (const [index, item] of meals.entries()) {
      if (!recipeCategoryCache.has(item.category)) {
        recipeCategoryCache.set(item.category, await upsertByName(client, "categorias_recetas", item.category));
        summary.categoriasRecetas += 1;
      }

      const assignedUser = users[index % users.length];
      const { receta, created } = await findOrCreateRecipe(
        client,
        item.meal,
        assignedUser.id,
        recipeCategoryCache.get(item.category).id,
        index
      );

      await syncRecipeDetails(client, receta.id, item.meal, ingredientCategoryCache);
      recipeIds.push(receta.id);
      summary.recetasProcesadas += 1;
      if (created) summary.recetasNuevas += 1;

      process.stdout.write(`\rRecetas procesadas: ${summary.recetasProcesadas}/${meals.length}`);
    }

    process.stdout.write("\n");
    summary.categoriasIngredientes = ingredientCategoryCache.size;
    const social = await createSocialData(client, users, recipeIds);
    summary.comentarios = social.comentarios;
    summary.favoritos = social.favoritos;

    await client.query("COMMIT");
    console.log("Seed completado correctamente.");
    console.table(summary);
    console.log(`Usuarios semilla: ${seedUsers.length}. Password temporal: ${DEFAULT_PASSWORD}`);
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    throw error;
  } finally {
    if (client) client.release();
    await pool.end();
  }
};

main().catch((error) => {
  console.error("No se pudo completar el seed:", error.message);
  process.exit(1);
});
