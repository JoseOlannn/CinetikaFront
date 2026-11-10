import { api } from './api.js';


//import mockContents from '../mocks/contents.json'; 
//import mockGenres from '../mocks/genres.json'; 

// Cache en memoria para acceso sincrónico y rápido
let cachedContents = [];
let cachedGenres = [];

function normalizarItem(item) {
  if (!item) return null;
  const idStr = String(item.id || item._id);
  return {
    ...item,
    id: idStr,
    _id: item._id || idStr,
    banner: item.banner || item.poster,
    generos: Array.isArray(item.generos) ? item.generos : [],
  };
}

function extraerGeneros(contents) {
  const nombres = new Map();

  for (const item of contents) {
    for (const genero of item.generos || []) {
      if (typeof genero !== 'string') continue;

      const nombre = genero.trim();
      if (!nombre) continue;

      const clave = nombre.toLocaleLowerCase('es');

      if (!nombres.has(clave)) {
        nombres.set(clave, nombre);
      }
    }
  }

  return [...nombres.values()]
    .sort((a, b) => a.localeCompare(b, 'es'))
    .map((nombre) => ({
      id: nombre,
      nombre,
      descripcion: `Explora los audiovisuales del género ${nombre}.`,
    }));
}

// ====================================
// OBTENER CATÁLOGO
// ====================================

export async function getContents() {
  try {
    const data = await api.get('/catalogo');
    if (Array.isArray(data)) {
      cachedContents = data.map(normalizarItem);
      cachedGenres = extraerGeneros(cachedContents);

      return cachedContents;
    }
  } catch (error) {
    console.warn('No se pudo cargar el catálogo del backend, usando datos locales:', error.message);
  }
  return cachedContents;
}

export async function getGenres() {
  return cachedGenres;
}

// ====================================
// FILTRAR POR CATEGORÍA
// ====================================

export function filterByCategory(contents, category) {
  if (!category) return contents;

  return contents.filter(
    (item) => (item.categoria || '').toLowerCase() === category.toLowerCase()
  );
}

// ====================================
// FILTRAR POR GÉNERO
// ====================================

export function filterByGenre(contents, selectedGenre) {
  if (
    selectedGenre === null ||
    selectedGenre === undefined ||
    selectedGenre === ''
  ) {
    return contents;
  }

  const targetName = String(selectedGenre)
    .trim()
    .toLocaleLowerCase('es');

  return contents.filter((item) =>
    Array.isArray(item.generos) &&
    item.generos.some(
      (genero) =>
        typeof genero === 'string' &&
        genero.trim().toLocaleLowerCase('es') === targetName
    )
  );
}

// ====================================
// GÉNEROS DISPONIBLES
// ====================================

export function getAvailableGenres(contents, genres) {
  const presentes = new Set();

  for (const item of contents) {
    for (const genero of item.generos || []) {
      if (typeof genero === 'string') {
        presentes.add(
          genero.trim().toLocaleLowerCase('es')
        );
      }
    }
  }

  return genres.filter((genre) =>
    presentes.has(
      genre.nombre.trim().toLocaleLowerCase('es')
    )
  );
}

// ====================================
// SELECCIONAR BANNER ALEATORIO
// ====================================

export function selectRandomBanner(contents, count = 5) {
  const shuffled = [...contents];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

export function getCatalogSnapshot() {
  return {
    contents: cachedContents,
    genres: cachedGenres,
  };
}

export async function getContentById(id) {
  const targetId = String(id);

  try {
    const item = await api.get(`/catalogo/${targetId}`);
    if (item) {
      return normalizarItem(item);
    }
  } catch (error) {
    console.warn(`No se encontró en backend /catalogo/${targetId}:`, error.message);
  }

  const found = cachedContents.find(
    (item) => String(item.id) === targetId || String(item._id) === targetId
  );

  return found ? normalizarItem(found) : null;
}

// Función para ordenar los contenidos por visualizaciones y mostrar los 10 más vistos
export function getMostViewed(contents, count = 10) {
  return [...contents]
    .sort(
      (a, b) => b.visualizaciones - a.visualizaciones
    )
    .slice(0, count);
}
