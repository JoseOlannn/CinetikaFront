
import { useState } from 'react';

import Button from '../ui/Button.jsx';
import '../../styles/ContentCard.css';

const CATEGORY_LABELS = {
  pelicula: 'Película',
  serie: 'Serie',
  cortometraje: 'Cortometraje',
};

export default function ContentCard({
  item,
  onView,
}) {
  const [imageError, setImageError] = useState(false);

  if (!item) return null;

  const categoria =
    CATEGORY_LABELS[item.categoria] ?? item.categoria;

  const tieneCalificacion =
    item.calificacion !== null &&
    item.calificacion !== undefined &&
    item.calificacion !== '';

  return (
    <article className="content-card">

      {/* ====================================
          PÓSTER
      ==================================== */}

      <div className="content-card__poster">

        {!imageError && item.poster ? (
          <img
            src={item.poster}
            alt={`Póster de ${item.nombre}`}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="content-card__fallback">
            Sin póster
          </div>
        )}

        {/* ====================================
            DECORACIONES CINETIKA
        ==================================== */}

        <div
          className="content-card__decoration"
          aria-hidden="true"
        >
          <span className="content-card__line-red" />
          <span className="content-card__line-blue" />
          <span className="content-card__line-yellow" />
        </div>

        {/* ====================================
            BOTÓN DE DETALLES EN HOVER
        ==================================== */}

        <div className="content-card__overlay">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onView?.(item)}
          >
            Detalles
          </Button>
        </div>

      </div>

      {/* ====================================
          INFORMACIÓN INFERIOR
      ==================================== */}

      <div className="content-card__info">

        <h3 className="content-card__title">
          {item.nombre}
        </h3>

        <div className="content-card__metadata">

          <span className="content-card__category">
            {categoria}
          </span>

          {item.anio != null && (
            <span className="content-card__year">
              {item.anio}
            </span>
          )}

          {item.duracion && (
            <span className="content-card__duration">
              {item.duracion}
            </span>
          )}

        </div>

        <div className="content-card__rating">

          {tieneCalificacion ? (
            <>
              <span
                className="content-card__star"
                aria-hidden="true"
              >
                ★
              </span>

              <span>
                {item.calificacion}/5
              </span>
            </>
          ) : (
            <span className="content-card__unrated">
              Sin calificar
            </span>
          )}

        </div>

      </div>

    </article>
  );
}
