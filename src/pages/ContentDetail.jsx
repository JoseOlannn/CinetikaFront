
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

import Button from '../components/ui/Button.jsx';

import {
  getContentById,
  getCatalogSnapshot,
} from '../services/catalogService.js';

import '../styles/ContentDetail.css';

const CATEGORY_LABELS = {
  pelicula: 'Película',
  serie: 'Serie',
  cortometraje: 'Cortometraje',
};

const { genres } = getCatalogSnapshot();

// ====================================
// PÁGINA DE DETALLES
// ====================================

export default function ContentDetail() {
  const { id } = useParams();

  return <ContentDetailData key={id} id={id} />;
}

function ContentDetailData({ id }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Buscar el audiovisual utilizando el ID de la URL.
  useEffect(() => {
    let active = true;

    getContentById(id)
      .then((result) => {
        if (active) {
          setContent(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setMessage('No se pudo cargar el audiovisual.');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="content-detail">
        <p>Cargando audiovisual...</p>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="content-detail">
        <h1>Audiovisual no encontrado</h1>

        <p>
          {message || 'No existe contenido con ese ID.'}
        </p>

        <Link to="/catalogo">
          Volver al catálogo
        </Link>
      </main>
    );
  }

  // Traducir IDs a nombres de géneros.
  // También acepta nombres si la API los devuelve así.
  const genreNames = (content.generos ?? []).map(
    (genreId) => {
      if (typeof genreId === 'string') {
        return genreId;
      }

      const genre = genres.find(
        (item) => item.id === genreId
      );

      return genre?.nombre ?? `Género ${genreId}`;
    }
  );

  return (
    <main className="content-detail">

      <section className="content-detail__information">

        {/* IMÁGENES */}
        <div className="content-detail__images">
          {content.banner && (
            <img
              src={content.banner}
              alt=""
              className="content-detail__banner"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          )}

          {content.poster && (
            <img
              src={content.poster}
              alt={`Póster de ${content.nombre}`}
              className="content-detail__poster"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>

        {/* DATOS */}
        <div className="content-detail__data">
          <p>
            <strong>Categoría:</strong>{' '}
            {CATEGORY_LABELS[content.categoria] ??
              content.categoria}
          </p>

          <h2>{content.nombre}</h2>

          <p>
            <strong>Año:</strong> {content.anio}
          </p>

          <p>
            <strong>Duración:</strong> {content.duracion}
          </p>

          <p>
            <strong>Calificación:</strong>{' '}
            {content.calificacion}/5
          </p>

          <p>
            <strong>Géneros:</strong>{' '}
            {genreNames.join(', ') || 'Sin clasificar'}
          </p>

          <p>
            <strong>Sinopsis:</strong> {content.sinopsis}
          </p>

          {/* ACCIONES PROVISIONALES */}
          <div className="content-detail__actions">
            <Button
              variant="primary"
              icon="play"
              onClick={() => setMessage(
                'Reproducción pendiente de integración.'
              )}
            >
              Ver
            </Button>

            <Button
              variant="outline"
              icon="eye"
              onClick={() => setMessage(
                'Tráiler pendiente de integración.'
              )}
            >
              Ver tráiler
            </Button>

            <Button
                variant="secondary"
                size="md"
                onClick={() => navigate(-1)}
            >
                Volver
            </Button>
          </div>

          {message && (
            <p role="status" className="content-detail__message">
              {message}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
