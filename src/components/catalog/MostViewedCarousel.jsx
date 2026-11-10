
import { useState } from 'react';

import Button from '../ui/Button.jsx';
import '../../styles/MostViewedCarousel.css';

function MostViewedItem({ item, index, onView }) {
  const [imageError, setImageError] = useState(false);

  return (
    <article
      className="most-viewed__item"
      role="listitem"
    >
      {/* NÚMERO DEL RANKING */}
      <span
        className="most-viewed__rank"
        aria-label={`Posición ${index + 1}`}
      >
        {index + 1}
      </span>

      {/* PÓSTER */}
      <div className="most-viewed__poster-wrapper">

        {!imageError && item.poster ? (
          <img
            className="most-viewed__poster"
            src={item.poster}
            alt={`Póster de ${item.nombre}`}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="most-viewed__fallback">
            Sin póster
          </div>
        )}

        {/* DECORACIONES CINETIKA */}
        <div
          className="most-viewed__decoration"
          aria-hidden="true"
        >
          <span className="most-viewed__line-red" />
          <span className="most-viewed__line-blue" />
          <span className="most-viewed__line-yellow" />
        </div>

        {/* BOTÓN DETALLES */}
        <div className="most-viewed__overlay">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onView?.(item)}
          >
            Detalles
          </Button>
        </div>

      </div>
    </article>
  );
}

export default function MostViewedCarousel({
  items = [],
  onView,
}) {
  if (items.length === 0) return null;

  return (
    <section
      className="most-viewed"
      aria-labelledby="most-viewed-title"
    >
      {/* ENCABEZADO */}
      <div className="most-viewed__header">
        <div>
          <h2
            className="most-viewed__title"
            id="most-viewed-title"
          >
            Los más vistos
          </h2>

          <p className="most-viewed__subtitle">
            Descubre los audiovisuales del Top 10
          </p>
        </div>
      </div>

      {/* AVISO DEL RANKING */}
      <p className="most-viewed__notice">
        Ranking de demostración con visualizaciones simuladas.
      </p>

      {/* CARRUSEL HORIZONTAL */}
      <div
        className="most-viewed__track"
        role="list"
        aria-label="Top 10 de audiovisuales"
        tabIndex={0}
      >
        {items.map((item, index) => (
          <MostViewedItem
            key={item.id || item._id || index}
            item={item}
            index={index}
            onView={onView}
          />
        ))}
      </div>
    </section>
  );
}
