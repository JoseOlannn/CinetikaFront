
import { useState } from 'react';
import {
  useNavigate,
  useSearchParams,
} from 'react-router';

import FeaturedBanner from '../components/catalog/FeaturedBanner.jsx';
import GenreFilter from '../components/catalog/GenreFilter.jsx';
import ContentGrid from '../components/catalog/ContentGrid.jsx';
import MostViewedCarousel from '../components/catalog/MostViewedCarousel.jsx';

import {
  getCatalogSnapshot,
  filterByCategory,
  filterByGenre,
  getAvailableGenres,
  selectRandomBanner,
  getMostViewed,
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

// Obtener datos a través del servicio mock.
const { contents, genres } = getCatalogSnapshot();

// ====================================
// CATÁLOGO PRINCIPAL
// ====================================

export default function Catalogo() {
  const [searchParams] = useSearchParams();

  const requestedCategory =
    searchParams.get('tipo');

  const category = VALID_CATEGORIES.includes(
    requestedCategory
  )
    ? requestedCategory
    : null;

  // Reinicia el género y el banner al cambiar
  // de categoría, sin afectar otras páginas.
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

  const [selectedGenre, setSelectedGenre] =
    useState(null);

  // Audiovisuales de la categoría actual.
  const categoryContents = filterByCategory(
    contents,
    category
  );

  // Selección aleatoria una vez por categoría.
  // Cambiar el género NO modifica el banner.
  const [featured] = useState(() =>
    selectRandomBanner(categoryContents, 5)
  );

  // Mostrar únicamente géneros disponibles.
  const availableGenres = getAvailableGenres(
    categoryContents,
    genres
  );

  // Aplicar filtro de género a las tarjetas.
  const filteredContents = filterByGenre(
    categoryContents,
    selectedGenre
  );

  // Mostrar los contenidos más vistos
  const mostViewed = getMostViewed(contents, 10);

  // Título adaptado a la categoría.
  const title = category
    ? CATEGORY_TITLES[category]
    : 'Explora nuestros audiovisuales';

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
    <div className="catalog-page">

      {/* BANNER */}
      <FeaturedBanner
        items={featured}
        onView={handleView}
      />

      {/* CONTENIDO MÁS VISTO */}
      {!category && (
        <div className="catalog-page__body">
          <MostViewedCarousel
            items={mostViewed}
            onView={handleView}
          />
        </div>
      )}

      {/* CATÁLOGO */}
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
