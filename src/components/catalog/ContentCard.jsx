
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

  return (
    <article className="content-card">

      {/* PÓSTER */}
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

        {/* BOTÓN VER EN HOVER */}
        <div className="content-card__overlay">
          <Button
            variant="primary"
            size="sm"
            icon="play"
            onClick={() => onView?.(item)}
          >
            Ver
          </Button>
        </div>
      </div>

      {/* INFORMACIÓN SIN FORMATO ESPECIAL */}
      <div className="content-card__info">
        <p><strong>Nombre:</strong> {item.nombre}</p>

        <p>
          <strong>Categoría:</strong>{' '}
          {CATEGORY_LABELS[item.categoria] ??
            item.categoria}
        </p>

        <p><strong>Año:</strong> {item.anio}</p>

        <p><strong>Duración:</strong> {item.duracion}</p>

        <p>
          <strong>Calificación:</strong>{' '}
          {item.calificacion}/5
        </p>
      </div>
    </article>
  );
}
