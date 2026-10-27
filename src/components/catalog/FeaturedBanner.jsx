
import { useEffect, useState } from 'react';

import Button from '../ui/Button.jsx';
import IconButton from '../ui/IconButton.jsx';

import '../../styles/FeaturedBanner.css';

const SLIDE_INTERVAL = 6000;

const CATEGORY_LABELS = {
  pelicula: 'Película',
  serie: 'Serie',
  cortometraje: 'Cortometraje',
};

// ====================================
// IMAGEN DEL BANNER
// ====================================

function BannerImage({ item }) {
  // Primero intenta cargar el banner horizontal.
  // Si falla, utiliza el póster.
  const sources = [
    item.banner,
    item.poster,
  ].filter(Boolean);

  const [sourceIndex, setSourceIndex] = useState(0);
  const source = sources[sourceIndex];

  function handleImageError() {
    setSourceIndex((current) => current + 1);
  }

  return (
    <div className="featured-banner__background">
      {source ? (
        <>
          {/* Fondo ampliado y difuminado */}
          <img
            src={source}
            alt=""
            aria-hidden="true"
            className="featured-banner__image-blur"
          />

          {/* Imagen principal */}
          <img
            src={source}
            alt=""
            className="featured-banner__image"
            onError={handleImageError}
          />
        </>
      ) : (
        <div className="featured-banner__fallback" />
      )}
    </div>
  );
}

// ====================================
// COMPONENTE REUTILIZABLE
// ====================================

export default function FeaturedBanner({
  items = [],
  onView,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showTrailerNotice, setShowTrailerNotice] =
    useState(false);

  // ====================================
  // CARRUSEL AUTOMÁTICO
  // ====================================

  useEffect(() => {
    if (
      items.length <= 1 ||
      showTrailerNotice
    ) {
      return undefined;
    }

    // Se reinicia cada vez que cambia la diapositiva,
    // incluso cuando el cambio es manual.
    const timer = window.setTimeout(() => {
      if (!document.hidden) {
        setActiveIndex((index) =>
          (index + 1) % items.length
        );
      }
    }, SLIDE_INTERVAL);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    activeIndex,
    items.length,
    showTrailerNotice,
  ]);

  // ====================================
  // CERRAR AVISO CON ESCAPE
  // ====================================

  useEffect(() => {
    if (!showTrailerNotice) {
      return undefined;
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setShowTrailerNotice(false);
      }
    }

    document.addEventListener(
      'keydown',
      handleEscape
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleEscape
      );
    };
  }, [showTrailerNotice]);

  // ====================================
  // SIN CONTENIDOS
  // ====================================

  if (items.length === 0) {
    return (
      <section
        className="featured-banner featured-banner--empty"
      >
        <p>No hay audiovisuales disponibles.</p>
      </section>
    );
  }

  const item = items[activeIndex] ?? items[0];

  // ====================================
  // NAVEGACIÓN MANUAL
  // ====================================

  function goToPrevious() {
    setActiveIndex((index) =>
      (index - 1 + items.length) % items.length
    );
  }

  function goToNext() {
    setActiveIndex((index) =>
      (index + 1) % items.length
    );
  }

  // ====================================
  // RENDERIZADO
  // ====================================

  return (
    <>
      <section
        className="featured-banner"
        aria-label="Audiovisuales destacados"
        aria-roledescription="carrusel"
      >
        {/* IMAGEN */}
        <BannerImage
          key={item.id}
          item={item}
        />

        {/* DEGRADADO */}
        <div className="featured-banner__overlay" />

        {/* INFORMACIÓN */}
        <div className="featured-banner__content">

          {/* METADATOS */}
          <div className="featured-banner__metadata">
            <span className="featured-banner__rating">
              ★ {item.calificacion}/5
            </span>

            <span>{item.anio}</span>

            <span>
              {CATEGORY_LABELS[item.categoria] ??
                item.categoria}
            </span>

            <span>{item.duracion}</span>
          </div>

          {/* TÍTULO */}
          <h1 className="featured-banner__title">
            {item.nombre}
          </h1>

          {/* SINOPSIS */}
          <p className="featured-banner__synopsis">
            {item.sinopsis}
          </p>

          {/* BOTONES REUTILIZABLES */}
          <div className="featured-banner__actions">
            <Button
              variant="primary"
              size="md"
              type="button"
              icon="play"
              onClick={() => onView?.(item)}
            >
              Ver
            </Button>

            <Button
              variant="outline"
              size="md"
              type="button"
              icon="eye"
              onClick={() =>
                setShowTrailerNotice(true)
              }
            >
              Ver tráiler
            </Button>
          </div>
        </div>

        {/* CONTROLES DEL BANNER */}
        {items.length > 1 && (
          <div className="featured-banner__navigation">
            <IconButton
              icon="chevron-left"
              size="md"
              aria-label="Audiovisual anterior"
              onClick={goToPrevious}
            />

            <div className="featured-banner__dots">
              {items.map((featuredItem, index) => (
                <button
                  key={featuredItem.id}
                  type="button"
                  aria-label={
                    `Mostrar ${featuredItem.nombre}`
                  }
                  aria-current={
                    activeIndex === index
                      ? 'true'
                      : undefined
                  }
                  className={
                    'featured-banner__dot' +
                    (activeIndex === index
                      ? ' featured-banner__dot--active'
                      : '')
                  }
                  onClick={() =>
                    setActiveIndex(index)
                  }
                />
              ))}
            </div>

            <IconButton
              icon="chevron-right"
              size="md"
              aria-label="Siguiente audiovisual"
              onClick={goToNext}
            />
          </div>
        )}
      </section>

      {/* ====================================
          AVISO SIMULADO DE TRÁILER
      ==================================== */}

      {showTrailerNotice && (
        <div
          className="featured-banner__modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              setShowTrailerNotice(false);
            }
          }}
        >
          <div
            className="featured-banner__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="featured-dialog-title"
          >
            <button
              type="button"
              className="featured-banner__modal-close"
              aria-label="Cerrar aviso"
              onClick={() =>
                setShowTrailerNotice(false)
              }
            >
              ×
            </button>

            <h2 id="featured-dialog-title">
              Ver tráiler
            </h2>

            <p>
              El tráiler de{' '}
              <strong>{item.nombre}</strong>
              {' '}todavía no está disponible
              en esta versión de prueba.
            </p>

            <p className="featured-banner__modal-note">
              Esta función se conectará
              posteriormente con el reproductor
              o la URL del tráiler.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
