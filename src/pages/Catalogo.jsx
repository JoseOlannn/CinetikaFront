import { useEffect, useState } from 'react';
import {
  useNavigate,
  useSearchParams,
} from 'react-router';

import FeaturedBanner from '../components/catalog/FeaturedBanner.jsx';
import GenreFilter from '../components/catalog/GenreFilter.jsx';
import ContentGrid from '../components/catalog/ContentGrid.jsx';

import {
  getContents,
  getGenres,
  getCatalogSnapshot,
  filterByCategory,
  filterByGenre,
  getAvailableGenres,
  selectRandomBanner,
} from '../services/catalogService.js';

import '../styles/Catalogo.css';

// ====================================
// CATEGORÍAS
// ====================================

const VALID_CATEGORIES = [
  'pelicula',
  'serie',
  'cortometraje',
];

const CATEGORY_TITLES = {
  pelicula: 'Explora nuestras películas',
  serie: 'Explora nuestras series',
  cortometraje: 'Explora nuestros cortometrajes',
};

// ====================================
// CATÁLOGO PRINCIPAL
// ====================================

export default function Catalogo() {
  const [searchParams] = useSearchParams();

  const requestedCategory = searchParams.get('tipo');

  const category = VALID_CATEGORIES.includes(requestedCategory)
    ? requestedCategory
    : null;

  return (
    <CatalogoContent
      key={category ?? 'general'}
      category={category}
    />
  );
}

// ====================================
// CONTENIDO DEL CATÁLOGO
// ====================================

function CatalogoContent({ category }) {
  const navigate = useNavigate();

  const initial = getCatalogSnapshot();
  const [contents, setContents] = useState(initial.contents);
  const [genres, setGenres] = useState(initial.genres);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [featured, setFeatured] = useState([]);

  // Cargar contenido desde la API del backend
  useEffect(() => {
    let activo = true;

    Promise.all([getContents(), getGenres()])
      .then(([apiContents, apiGenres]) => {
        if (activo) {
          setContents(apiContents);
          setGenres(apiGenres);

          const filtrados = filterByCategory(apiContents, category);
          setFeatured(selectRandomBanner(filtrados, 5));
        }
      })
      .catch((err) => {
        console.error('Error al cargar catálogo:', err);
      });

    return () => {
      activo = false;
    };
  }, [category]);

  // Audiovisuales de la categoría actual
  const categoryContents = filterByCategory(contents, category);

  // Inicializar banner si aún no está listo
  const activeFeatured = featured.length > 0 ? featured : selectRandomBanner(categoryContents, 5);

  // Géneros disponibles para este conjunto
  const availableGenres = getAvailableGenres(categoryContents, genres);

  // Aplicar filtro de género
  const filteredContents = filterByGenre(categoryContents, selectedGenre);

  // Título
  const title = category
    ? CATEGORY_TITLES[category]
    : 'Explora nuestros audiovisuales';

  function handleView(item) {
    navigate(`/audiovisual/${item.id || item._id}`);
  }

  return (
    <div className="catalog-page">
      {/* BANNER */}
      <FeaturedBanner
        items={activeFeatured}
        onView={handleView}
      />

      {/* SECCIÓN INFERIOR */}
      <div className="catalog-page__body">
        {/* TÍTULO */}
        <h2 className="catalog-page__explore-title">
          {title}
        </h2>

        {/* FILTRO POR GÉNERO */}
        <GenreFilter
          genres={availableGenres}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
        />

        {/* TARJETAS */}
        <ContentGrid
          items={filteredContents}
          onView={handleView}
        />
      </div>
    </div>
  );
}
