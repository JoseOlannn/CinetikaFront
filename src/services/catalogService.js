import { api } from './api.js';
import mockContents from '../mocks/contents.json';
import mockGenres from '../mocks/genres.json';

// Cache en memoria para acceso sincrónico y rápido
let cachedContents = [...mockContents];
let cachedGenres = [...mockGenres];

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

// ====================================
// OBTENER CATÁLOGO
// ====================================

export async function getContents() {
  try {
    const data = await api.get('/catalogo');
    if (Array.isArray(data) && data.length > 0) {
      cachedContents = data.map(normalizarItem);
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

export function filterByGenre(contents, genreIdOrName) {
  if (genreIdOrName === null || genreIdOrName === undefined || genreIdOrName === '') {
    return contents;
  }

  // Si nos pasan un ID numérico, buscar el nombre correspondiente en genres
  const genreObj = cachedGenres.find((g) => g.id === genreIdOrName || g.nombre === genreIdOrName);
  const targetName = genreObj ? genreObj.nombre.toLowerCase() : String(genreIdOrName).toLowerCase();

  return contents.filter((item) => {
    if (!Array.isArray(item.generos)) return false;

    return item.generos.some((g) => {
      if (typeof g === 'number') {
        return g === genreIdOrName || (genreObj && g === genreObj.id);
      }
      return String(g).toLowerCase() === targetName || (genreObj && String(g).toLowerCase() === genreObj.nombre.toLowerCase());
    });
  });
}

// ====================================
// GÉNEROS DISPONIBLES
// ====================================

export function getAvailableGenres(contents, genres) {
  // Recopilar todos los géneros presentes en los contenidos
  const presentes = new Set();

  for (const item of contents) {
    for (const g of item.generos || []) {
      if (typeof g === 'number') {
        presentes.add(g);
      } else if (typeof g === 'string') {
        // Mapear nombre de género al id si existe
        const match = genres.find((gen) => gen.nombre.toLowerCase() === g.toLowerCase());
        if (match) {
          presentes.add(match.id);
        }
      }
    }
  }

  return genres.filter((genre) => presentes.has(genre.id));
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
