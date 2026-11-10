
import { useEffect, useRef, useState } from 'react';

import Button from './Button.jsx';
import IconButton from './IconButton.jsx';

import '../../styles/VideoPlayer.css';

// Video predeterminado para demostraciones o URLs externas
const DEFAULT_DEMO_VIDEO =
  'https://vjs.zencdn.net/v/oceans.mp4';

/**
 * Formatea segundos como mm:ss o hh:mm:ss
 */
function formatoTiempo(segundos) {
  if (
    isNaN(segundos) ||
    segundos === null ||
    segundos === undefined ||
    segundos < 0
  ) {
    return '00:00';
  }

  const total = Math.floor(segundos);
  const horas = Math.floor(total / 3600);
  const minutos = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  const secsStr = secs < 10 ? `0${secs}` : `${secs}`;

  if (horas > 0) {
    const minsStr =
      minutos < 10 ? `0${minutos}` : `${minutos}`;

    return `${horas}:${minsStr}:${secsStr}`;
  }

  const minsStr =
    minutos < 10 ? `0${minutos}` : `${minutos}`;

  return `${minsStr}:${secsStr}`;
}

/**
 * Determina si una URL es un archivo de video directo.
 */
function esVideoDirecto(url) {
  if (!url) return false;

  return /\.(mp4|webm|ogg|m4v)(\?.*)?$/i.test(
    url.trim()
  );
}

export default function VideoPlayer({
  titulo = 'Reproducción de video',
  videoUrl,
  onClose,
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const progresoRef = useRef(null);
  const hideControlsTimeoutRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progressPercent, setProgressPercent] =
    useState(0);

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] =
    useState(false);

  const [controlsVisible, setControlsVisible] =
    useState(true);

  // ==========================================
  // FUENTE DE VIDEO
  // ==========================================

  const isDirect = esVideoDirecto(videoUrl);

  const finalVideoSrc = isDirect
    ? videoUrl
    : DEFAULT_DEMO_VIDEO;

  const isExternalYouTube =
    videoUrl &&
    /youtu(\.be|be\.com)/i.test(videoUrl);

  // ==========================================
  // FUNCIONES DE CONTROL ORIGINALES
  // ==========================================

  function reproducirPausar() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }

    showControlsTemporarily();
  }

  function retrasar() {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(
      0,
      video.currentTime - 10
    );

    showControlsTemporarily();
  }

  function adelantar() {
    const video = videoRef.current;
    if (!video) return;

    const dur = video.duration || 0;

    video.currentTime = Math.min(
      dur,
      video.currentTime + 10
    );

    showControlsTemporarily();
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video) return;

    const curr = video.currentTime || 0;
    const dur = video.duration || 0;

    const porcentaje =
      dur > 0 ? (curr / dur) * 100 : 0;

    setCurrentTime(curr);
    setProgressPercent(porcentaje);

    if (progresoRef.current) {
      progresoRef.current.style.setProperty(
        '--progreso',
        `${porcentaje}%`
      );
    }
  }

  function handleLoadedMetadata() {
    const video = videoRef.current;
    if (!video) return;

    setDuration(video.duration || 0);
  }

  function handleSeek(event) {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const nuevoPorcentaje = parseFloat(
      event.target.value
    );

    const nuevoTiempo =
      (nuevoPorcentaje * video.duration) / 100;

    video.currentTime = nuevoTiempo;

    setProgressPercent(nuevoPorcentaje);

    if (progresoRef.current) {
      progresoRef.current.style.setProperty(
        '--progreso',
        `${nuevoPorcentaje}%`
      );
    }

    showControlsTemporarily();
  }

  function handleVolumeChange(event) {
    const video = videoRef.current;
    if (!video) return;

    const nuevoVolumen = parseFloat(
      event.target.value
    );

    video.volume = nuevoVolumen;

    setVolume(nuevoVolumen);
    setIsMuted(nuevoVolumen === 0);
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.muted = false;
      video.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  }

  function pantallaCompleta() {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }

      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }

      setIsFullscreen(false);
    }
  }

  function showControlsTemporarily() {
    setControlsVisible(true);

    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }

    hideControlsTimeoutRef.current = setTimeout(() => {
      if (
        videoRef.current &&
        !videoRef.current.paused
      ) {
        setControlsVisible(false);
      }
    }, 2800);
  }

  // ==========================================
  // ATAJOS Y EVENTOS GLOBALES ORIGINALES
  // ==========================================

  useEffect(() => {
  function handleKeyDown(event) {
    const video = videoRef.current;

    // Evitar interferir cuando el usuario
    // está escribiendo o utilizando un control.
    const target = event.target;

    if (
      target instanceof HTMLElement &&
      (
        target.matches('input, textarea, select') ||
        target.isContentEditable
      )
    ) {
      return;
    }

    // ESC: cerrar o salir de pantalla completa
    if (event.key === 'Escape') {
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      } else {
        onClose?.();
      }

      return;
    }

    if (!video) return;

    // ESPACIO / K: reproducir o pausar
    if (
      event.code === 'Space' ||
      event.key.toLowerCase() === 'k'
    ) {
      event.preventDefault();

      if (video.paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }

    // IZQUIERDA / J: retroceder 10 segundos
    else if (
      event.key === 'ArrowLeft' ||
      event.key.toLowerCase() === 'j'
    ) {
      event.preventDefault();

      video.currentTime = Math.max(
        0,
        video.currentTime - 10
      );
    }

    // DERECHA / L: adelantar 10 segundos
    else if (
      event.key === 'ArrowRight' ||
      event.key.toLowerCase() === 'l'
    ) {
      event.preventDefault();

      video.currentTime = Math.min(
        video.duration || 0,
        video.currentTime + 10
      );
    }

    // ARRIBA: aumentar volumen
    else if (event.key === 'ArrowUp') {
      event.preventDefault();

      const next = Math.min(
        1,
        video.volume + 0.1
      );

      video.volume = next;
      video.muted = false;

      setVolume(next);
      setIsMuted(false);
    }

    // ABAJO: disminuir volumen
    else if (event.key === 'ArrowDown') {
      event.preventDefault();

      const next = Math.max(
        0,
        video.volume - 0.1
      );

      video.volume = next;
      video.muted = next === 0;

      setVolume(next);
      setIsMuted(next === 0);
    }

    // F: pantalla completa
    else if (event.key.toLowerCase() === 'f') {
      event.preventDefault();

      if (!document.fullscreenElement) {
        containerRef.current
          ?.requestFullscreen?.()
          .catch(() => {});
      } else {
        document.exitFullscreen?.();
      }
    }

    // M: silenciar / activar sonido
    else if (event.key.toLowerCase() === 'm') {
      event.preventDefault();

      if (video.muted || video.volume === 0) {
        video.muted = false;
        video.volume = video.volume || 0.5;

        setVolume(video.volume);
        setIsMuted(false);
      } else {
        video.muted = true;
        setIsMuted(true);
      }
    }
  }

  function handleFullscreenChange() {
    setIsFullscreen(Boolean(document.fullscreenElement));
  }

  window.addEventListener('keydown', handleKeyDown);

  document.addEventListener(
    'fullscreenchange',
    handleFullscreenChange
  );

  return () => {
    window.removeEventListener('keydown', handleKeyDown);

    document.removeEventListener(
      'fullscreenchange',
      handleFullscreenChange
    );
  };
}, [onClose]);

  // ==========================================
  // INTERFAZ DEL REPRODUCTOR
  // ==========================================

  return (
    <div
      className="cinetika-player-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <section
        ref={containerRef}
        className="reproductor"
        onClick={(event) => event.stopPropagation()}
        onMouseMove={showControlsTemporarily}
      >

        {/* CABECERA ORIGINAL */}
        <header className="reproductor__header">
          <div className="reproductor__titulo-wrapper">
            <span className="reproductor__badge">
              Cinetika Play
            </span>

            <h3 className="reproductor__titulo">
              {titulo}
            </h3>
          </div>

          <div className="reproductor__header-actions">
            {isExternalYouTube && (
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="reproductor__external-link"
                title="Ver enlace original en YouTube"
              >
                Abrir en YouTube ↗
              </a>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              title="Cerrar reproductor (Esc)"
            >
              Cerrar
            </Button>
          </div>
        </header>

        {/* PANTALLA DE VIDEO ORIGINAL */}
        <div
          className="reproductor__screen"
          onClick={reproducirPausar}
        >
          <video
            id="video"
            ref={videoRef}
            src={finalVideoSrc}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            autoPlay
            playsInline
          >
            Tu navegador no soporta el formato
            de video HTML5.
          </video>

          {/* CAMBIO 1:
              BOTÓN CENTRAL AZUL, REUTILIZABLE */}
          {!isPlaying && (
            <IconButton
              icon="play"
              size="lg"
              className="reproductor__center-btn"
              aria-label="Reproducir video"
              title="Reproducir"
              onClick={(event) => {
                event.stopPropagation();
                reproducirPausar();
              }}
            />
          )}

          {/* CONTROLES INTEGRADOS ORIGINALES */}
          <section
            className={`controles ${
              controlsVisible || !isPlaying
                ? 'controles--visible'
                : ''
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            {/* BARRA DE PROGRESO ORIGINAL */}
            <input
              type="range"
              id="progreso"
              ref={progresoRef}
              min="0"
              max="100"
              step="0.1"
              value={progressPercent}
              onChange={handleSeek}
              aria-label="Barra de progreso de reproducción"
            />

            {/* BOTONERA */}
            <section className="botones">

              <div className="izquierda">
                <IconButton
                  icon={isPlaying ? 'pause' : 'play'}
                  size="sm"
                  className="reproductor__play-control"
                  onClick={reproducirPausar}
                  aria-label={
                    isPlaying
                      ? 'Pausar video'
                      : 'Reproducir video'
                  }
                  title={
                    isPlaying
                      ? 'Pausar (Espacio)'
                      : 'Reproducir (Espacio)'
                  }
                />

                {/* CAMBIO 2:
                    FLECHA SIMPLE PARA RETROCEDER */}
                <IconButton
                  icon="chevron-left"
                  size="sm"
                  onClick={retrasar}
                  aria-label="Retroceder 10 segundos"
                  title="Retroceder 10 segundos (←)"
                />

                {/* CAMBIO 3:
                    FLECHA SIMPLE PARA ADELANTAR */}
                <IconButton
                  icon="chevron-right"
                  size="sm"
                  onClick={adelantar}
                  aria-label="Adelantar 10 segundos"
                  title="Adelantar 10 segundos (→)"
                />

                <span id="tiempo">
                  {formatoTiempo(currentTime)}
                  /
                  {formatoTiempo(duration)}
                </span>
              </div>

              <div className="derecha">
                <div className="volumen-wrapper">
                  <IconButton
                    icon={
                      isMuted || volume === 0
                        ? 'volume-x'
                        : volume < 0.5
                          ? 'volume-1'
                          : 'volume-2'
                    }
                    size="sm"
                    onClick={toggleMute}
                    aria-label={
                      isMuted
                        ? 'Activar sonido'
                        : 'Silenciar'
                    }
                    title="Silenciar / Activar sonido (M)"
                  />

                  <input
                    type="range"
                    id="volumen"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    aria-label="Control de volumen"
                  />
                </div>

                <IconButton
                  icon={
                    isFullscreen
                      ? 'minimize'
                      : 'maximize'
                  }
                  size="sm"
                  onClick={pantallaCompleta}
                  aria-label={
                    isFullscreen
                      ? 'Salir de pantalla completa'
                      : 'Pantalla completa'
                  }
                  title="Pantalla completa (F)"
                />
              </div>

            </section>
          </section>
        </div>

        {/* PIE DE ATAJOS ORIGINAL */}
        <footer className="reproductor__shortcuts-hint">
          <span>
            <kbd>Espacio</kbd> Play/Pausa
            {' • '}
            <kbd>←</kbd> <kbd>→</kbd> ±10s
            {' • '}
            <kbd>↑</kbd> <kbd>↓</kbd> Volumen
            {' • '}
            <kbd>F</kbd> Pantalla completa
          </span>

          <span>
            {isDirect
              ? 'Directo MP4'
              : 'Reproductor Cinetika HD'}
          </span>
        </footer>

      </section>
    </div>
  );
}
