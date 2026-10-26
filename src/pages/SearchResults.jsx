
import {
  useNavigate,
  useSearchParams,
} from 'react-router';

import ContentGrid from '../components/catalog/ContentGrid.jsx';

import {
  getCatalogSnapshot,
} from '../services/catalogService.js';

import '../styles/SearchResults.css';

// ====================================
// DATOS DEL CATÁLOGO
// ====================================

const { contents, genres } = getCatalogSnapshot();

// Normalizar textos para que las búsquedas
// no dependan de mayúsculas ni acentos.
function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// ====================================
// PÁGINA DE RESULTADOS
// ====================================

export default function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const query = searchParams.get('q')?.trim() ?? '';
  const normalizedQuery = normalizeText(query);

  // ====================================
  // FILTRAR AUDIOVISUALES
  // ====================================

  const results = normalizedQuery
    ? contents.filter((item) => {
        const genreNames = (item.generos ?? [])
          .map((genreId) => {
            if (typeof genreId === 'string') {
              return genreId;
            }

            return genres.find(
              (genre) => genre.id === genreId
            )?.nombre ?? '';
          })
          .join(' ');

        const searchableText = [
          item.nombre,
          item.sinopsis,
          item.anio,
          item.categoria,
          genreNames,
        ].join(' ');

        return normalizeText(searchableText)
          .includes(normalizedQuery);
      })
    : [];

  // ====================================
  // ABRIR DETALLES POR ID
  // ====================================

  function handleView(item) {
    navigate(`/audiovisual/${item.id}`);
  }

  // ====================================
  // RENDERIZADO
  // ====================================

  return (
    <div className="search-results">

      {/* ENCABEZADO */}
      <header className="search-results__header">
        <h1>
          {query
            ? `Resultados para "${query}"`
            : 'Resultados de búsqueda'}
        </h1>

        {query && (
          <p>
            {results.length}{' '}
            {results.length === 1
              ? 'audiovisual encontrado'
              : 'audiovisuales encontrados'}
          </p>
        )}
      </header>

      {/* SIN BÚSQUEDA */}
      {!query && (
        <p>
          Escribe un término en el buscador
          para encontrar audiovisuales.
        </p>
      )}

      {/* RESULTADOS */}
      {query && results.length > 0 && (
        <ContentGrid
          items={results}
          onView={handleView}
        />
      )}

      {/* SIN COINCIDENCIAS */}
      {query && results.length === 0 && (
        <p>
          No se encontraron audiovisuales
          que coincidan con "{query}".
        </p>
      )}

    </div>
  );
}
