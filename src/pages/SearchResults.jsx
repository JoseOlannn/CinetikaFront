import { useEffect, useState } from 'react';
import {
  useNavigate,
  useSearchParams,
} from 'react-router';

import ContentGrid from '../components/catalog/ContentGrid.jsx';
import {
  getContents,
  getGenres,
  getCatalogSnapshot,
} from '../services/catalogService.js';

import '../styles/SearchResults.css';

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export default function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initial = getCatalogSnapshot();
  const [contents, setContents] = useState(initial.contents);
  const [genres, setGenres] = useState(initial.genres);

  useEffect(() => {
    let active = true;
    Promise.all([getContents(), getGenres()]).then(([apiContents, apiGenres]) => {
      if (active) {
        setContents(apiContents);
        setGenres(apiGenres);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const query = searchParams.get('q')?.trim() ?? '';
  const normalizedQuery = normalizeText(query);

  const results = normalizedQuery
    ? contents.filter((item) => {
        const genreNames = (item.generos ?? [])
          .map((g) => {
            if (typeof g === 'string') return g;
            return genres.find((genre) => genre.id === g)?.nombre ?? '';
          })
          .join(' ');

        const searchableText = [
          item.nombre,
          item.sinopsis,
          item.anio,
          item.categoria,
          genreNames,
        ].join(' ');

        return normalizeText(searchableText).includes(normalizedQuery);
      })
    : [];

  function handleView(item) {
    navigate(`/audiovisual/${item.id || item._id}`);
  }

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
          Escribe un término en el buscador para encontrar audiovisuales.
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
          No se encontraron audiovisuales que coincidan con "{query}".
        </p>
      )}
    </div>
  );
}
