
/*
 * CATALOG SERVICE - CINETIKA
 *
 * Datos simulados para desarrollo.
 * Se reemplazarán por peticiones a la API.
 */

import mockContents from '../mocks/contents.json';
import mockGenres from '../mocks/genres.json';

// ====================================
// OBTENER CATÁLOGO
// ====================================

export async function getContents() {
  return mockContents;
}

export async function getGenres() {
  return mockGenres;
}

// ====================================
// FILTRAR POR CATEGORÍA
// ====================================

export function filterByCategory(contents, category) {
  if (!category) return contents;

  return contents.filter(
    (item) => item.categoria === category
  );
}

// ====================================
// FILTRAR POR GÉNERO
// ====================================

export function filterByGenre(contents, genreId) {
  if (genreId === null) return contents;

  return contents.filter(
    (item) => item.generos.includes(genreId)
  );
}

// ====================================
// GÉNEROS DISPONIBLES
// ====================================

export function getAvailableGenres(contents, genres) {
  const ids = new Set(
    contents.flatMap((item) => item.generos)
  );

  return genres.filter((genre) => ids.has(genre.id));
}

// ====================================
// SELECCIONAR BANNER ALEATORIO
// ====================================

export function selectRandomBanner(contents, count = 5) {
  const shuffled = [...contents];

  // Fisher-Yates: mezcla sin modificar el original.
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [
      shuffled[j],
      shuffled[i],
    ];
  }

  return shuffled.slice(0, count);
}

export function getCatalogSnapshot() {
  return {
    contents: mockContents,
    genres: mockGenres,
  };
}

export async function getContentById(id) {
  const { contents } = getCatalogSnapshot();

  return contents.find(
    (item) => item.id === Number(id)
  ) ?? null;
}

// Función para ordenar los contenidos por visualizaciones y mostrar los 10 más vistos
export function getMostViewed(contents, count = 10) {
  return [...contents]
    .sort(
      (a, b) => b.visualizaciones - a.visualizaciones
    )
    .slice(0, count);
}
