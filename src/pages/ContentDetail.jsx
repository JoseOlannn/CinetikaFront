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

/**
 * Convierte enlaces comunes (YouTube, Vimeo, etc.) a URLs reproducibles en un iframe.
 */
function getEmbedUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();

  // YouTube
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  }

  // Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  return trimmed;
}

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
  const [playingVideo, setPlayingVideo] = useState(false);
  const navigate = useNavigate();

  // Buscar el audiovisual utilizando el ID de la URL
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

  function handlePlay() {
    if (!content?.videoUrl) {
      setMessage('Este contenido aún no tiene un video o tráiler asignado.');
      return;
    }
    setMessage('');
    setPlayingVideo(true);
  }

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

  // Traducir IDs a nombres de géneros
  const genreNames = (content.generos ?? []).map((genreId) => {
    if (typeof genreId === 'string') {
      return genreId;
    }
    const genre = genres.find((item) => item.id === genreId);
    return genre?.nombre ?? `Género ${genreId}`;
  });

  const embedUrl = getEmbedUrl(content.videoUrl);
  const isDirectVideo = content.videoUrl && /\.(mp4|webm|ogg)$/i.test(content.videoUrl);

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
            {CATEGORY_LABELS[content.categoria] ?? content.categoria}
          </p>

          <h2>{content.nombre}</h2>

          <p>
            <strong>Año:</strong> {content.anio}
          </p>

          {content.duracion && (
            <p>
              <strong>Duración:</strong> {content.duracion}
            </p>
          )}

          <p>
            <strong>Calificación:</strong>{' '}
            {content.calificacion ? `${content.calificacion}/5` : 'Sin calificar'}
          </p>

          <p>
            <strong>Géneros:</strong>{' '}
            {genreNames.join(', ') || 'Sin clasificar'}
          </p>

          <p>
            <strong>Sinopsis:</strong> {content.sinopsis}
          </p>

          {/* ACCIONES */}
          <div className="content-detail__actions">
            <Button
              variant="primary"
              icon="play"
              onClick={handlePlay}
            >
              Ver
            </Button>

            <Button
              variant="outline"
              icon="eye"
              onClick={handlePlay}
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

      {/* MODAL REPRODUCTOR DE VIDEO */}
      {playingVideo && embedUrl && (
        <div
          className="content-detail__player-overlay"
          onClick={() => setPlayingVideo(false)}
        >
          <div
            className="content-detail__player-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="content-detail__player-header">
              <h3>Reproduciendo: {content.nombre}</h3>
              <div className="content-detail__player-actions">
                <a
                  href={content.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="content-detail__player-link"
                >
                  Abrir enlace externo ↗
                </a>
                <button
                  type="button"
                  className="content-detail__player-close"
                  onClick={() => setPlayingVideo(false)}
                >
                  ✕ Cerrar
                </button>
              </div>
            </div>

            <div className="content-detail__player-frame-wrapper">
              {isDirectVideo ? (
                <video
                  src={content.videoUrl}
                  controls
                  autoPlay
                />
              ) : (
                <iframe
                  src={embedUrl}
                  title={`Reproductor de ${content.nombre}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
