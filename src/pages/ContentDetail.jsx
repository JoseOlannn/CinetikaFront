
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

import Button from '../components/ui/Button.jsx';
import VideoPlayer from '../components/ui/VideoPlayer.jsx';

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

// ====================================
// PÁGINA DE DETALLES
// ====================================

export default function ContentDetail() {
  const { id } = useParams();

  return <ContentDetailData key={id} id={id} />;
}

function ContentDetailData({ id }) {
  const navigate = useNavigate();

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [playingVideo, setPlayingVideo] = useState(false);
  const [posterError, setPosterError] = useState(false);
  const [bannerError, setBannerError] = useState(false);

  // ====================================
  // CARGAR AUDIOVISUAL DESDE LA API
  // ====================================

  useEffect(() => {
    let active = true;

    getContentById(id)
      .then((result) => {
        if (!active) return;

        setContent(result);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;

        setMessage('No se pudo cargar el audiovisual.');
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  // ====================================
  // ABRIR REPRODUCTOR
  // ====================================

  function handlePlay() {
    if (!content?.videoUrl) {
      setMessage(
        'Este contenido aún no tiene un video o tráiler asignado.'
      );
      return;
    }

    setMessage('');
    setPlayingVideo(true);
  }

  // ====================================
  // ESTADOS DE CARGA
  // ====================================

  if (loading) {
    return (
      <main className="content-detail">
        <div className="content-detail__status">
          <p>Cargando audiovisual...</p>
        </div>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="content-detail">
        <div className="content-detail__status">
          <h1>Audiovisual no encontrado</h1>

          <p>
            {message || 'No existe contenido con ese ID.'}
          </p>

          <Link to="/catalogo">
            Volver al catálogo
          </Link>
        </div>
      </main>
    );
  }

  // ====================================
  // DATOS DEL AUDIOVISUAL
  // ====================================

  const category =
    CATEGORY_LABELS[content.categoria] ??
    content.categoria ??
    'Audiovisual';

  // La API normalmente entrega nombres de géneros.
  // Se conserva compatibilidad con IDs anteriores.
  const { genres } = getCatalogSnapshot();

  const genreNames = (content.generos ?? [])
    .map((genreValue) => {
      if (typeof genreValue === 'string') {
        return genreValue;
      }

      const genre = genres.find(
        (item) => item.id === genreValue
      );

      return genre?.nombre ?? `Género ${genreValue}`;
    })
    .filter(Boolean);

  const hasRating =
    content.calificacion !== null &&
    content.calificacion !== undefined &&
    content.calificacion !== '';

  const hasBanner = Boolean(content.banner) && !bannerError;
  const hasPoster = Boolean(content.poster) && !posterError;

  return (
    <main className="content-detail">

      {/* ====================================
          HERO CINEMATOGRÁFICO
      ==================================== */}

      <section
        className="content-detail__hero"
        aria-labelledby="content-detail-title"
      >

        {/* BANNER DE FONDO */}
        <div
          className="content-detail__background"
          aria-hidden="true"
        >
          {hasBanner && (
            <img
              src={content.banner}
              alt=""
              className="content-detail__background-image"
              onError={() => setBannerError(true)}
            />
          )}
        </div>

        {/* CAPAS OSCURAS DEL BANNER */}
        <div
          className="content-detail__background-overlay"
          aria-hidden="true"
        />

        {/* CONTENIDO DEL HERO */}
        <div className="content-detail__information">

          {/* ====================================
              PÓSTER VERTICAL
          ==================================== */}

          <div className="content-detail__images">
            <div className="content-detail__poster-frame">

              {hasPoster ? (
                <img
                  src={content.poster}
                  alt={`Póster de ${content.nombre}`}
                  className="content-detail__poster"
                  onError={() => setPosterError(true)}
                />
              ) : (
                <div className="content-detail__poster-fallback">
                  Sin póster disponible
                </div>
              )}

              {/* Detalles de color Cinetika */}
              <span
                className="content-detail__poster-line-red"
                aria-hidden="true"
              />

              <span
                className="content-detail__poster-line-blue"
                aria-hidden="true"
              />

              <span
                className="content-detail__poster-line-yellow"
                aria-hidden="true"
              />

            </div>
          </div>

          {/* ====================================
              INFORMACIÓN Y ACCIONES
          ==================================== */}

          <div className="content-detail__data">

            {/* CALIFICACIÓN Y METADATOS */}
            <div className="content-detail__metadata">

              {hasRating && (
                <span className="content-detail__rating">
                  <span aria-hidden="true">★</span>
                  {content.calificacion}/5
                </span>
              )}

              {content.anio != null && (
                <span>{content.anio}</span>
              )}

              <span>{category}</span>

              {content.duracion && (
                <span>{content.duracion}</span>
              )}

            </div>

            {/* TÍTULO */}
            <h1
              id="content-detail-title"
              className="content-detail__title"
            >
              {content.nombre}
            </h1>

            {/* SINOPSIS */}
            {content.sinopsis && (
              <p className="content-detail__synopsis">
                {content.sinopsis}
              </p>
            )}

            {/* GÉNEROS */}
            {genreNames.length > 0 && (
              <p className="content-detail__genres">
                <strong>Géneros: </strong>
                {genreNames.join(' · ')}
              </p>
            )}

            {/* ====================================
                ACCIONES ORIGINALES
            ==================================== */}

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
              <p
                role="status"
                className="content-detail__message"
              >
                {message}
              </p>
            )}

          </div>
        </div>

      </section>

      {/* ====================================
          REPRODUCTOR EXISTENTE
      ==================================== */}

      {playingVideo && (
        <VideoPlayer
          titulo={content.nombre}
          videoUrl={content.videoUrl}
          onClose={() => setPlayingVideo(false)}
        />
      )}

    </main>
  );
}
