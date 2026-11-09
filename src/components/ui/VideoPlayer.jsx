import { useEffect, useRef, useState } from 'react';
import '../../styles/VideoPlayer.css';

// Video de alta definición predeterminado para demostraciones o contenidos con URLs externas
const DEFAULT_DEMO_VIDEO = 'https://vjs.zencdn.net/v/oceans.mp4';

/**
 * Formatea segundos a formato mm:ss o hh:mm:ss
 */
function formatoTiempo(segundos) {
  if (isNaN(segundos) || segundos === null || segundos === undefined || segundos < 0) {
    return '00:00';
  }

  const total = Math.floor(segundos);
  const horas = Math.floor(total / 3600);
  const minutos = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  const secsStr = secs < 10 ? `0${secs}` : `${secs}`;

  if (horas > 0) {
    const minsStr = minutos < 10 ? `0${minutos}` : `${minutos}`;
    return `${horas}:${minsStr}:${secsStr}`;
  }

  const minsStr = minutos < 10 ? `0${minutos}` : `${minutos}`;
  return `${minsStr}:${secsStr}`;
}

/**
 * Determina si una URL apunta directamente a un archivo de video compatible
 */
function esVideoDirecto(url) {
  if (!url) return false;
  return /\.(mp4|webm|ogg|m4v)(\?.*)?$/i.test(url.trim());
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
  const [progressPercent, setProgressPercent] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  // Determinar la fuente de video adecuada
  const isDirect = esVideoDirecto(videoUrl);
  const finalVideoSrc = isDirect ? videoUrl : DEFAULT_DEMO_VIDEO;
  const isExternalYouTube = videoUrl && /youtu(\.be|be\.com)/i.test(videoUrl);

  // ==========================================
  // FUNCIONES DE CONTROL
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
    video.currentTime = Math.max(0, video.currentTime - 10);
    showControlsTemporarily();
  }

  function adelantar() {
    const video = videoRef.current;
    if (!video) return;
    const dur = video.duration || 0;
    video.currentTime = Math.min(dur, video.currentTime + 10);
    showControlsTemporarily();
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video) return;

    const curr = video.currentTime || 0;
    const dur = video.duration || 0;
    const porcentaje = dur > 0 ? (curr / dur) * 100 : 0;

    setCurrentTime(curr);
    setProgressPercent(porcentaje);

    if (progresoRef.current) {
      progresoRef.current.style.setProperty('--progreso', `${porcentaje}%`);
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

    const nuevoPorcentaje = parseFloat(event.target.value);
    const nuevoTiempo = (nuevoPorcentaje * video.duration) / 100;
    video.currentTime = nuevoTiempo;

    setProgressPercent(nuevoPorcentaje);
    if (progresoRef.current) {
      progresoRef.current.style.setProperty('--progreso', `${nuevoPorcentaje}%`);
    }
    showControlsTemporarily();
  }

  function handleVolumeChange(event) {
    const video = videoRef.current;
    if (!video) return;

    const nuevoVolumen = parseFloat(event.target.value);
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
      if (videoRef.current && !videoRef.current.paused) {
        setControlsVisible(false);
      }
    }, 2800);
  }

  // ==========================================
  // ATAJOS DE TECLADO Y EVENTOS GLOBALES
  // ==========================================

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        } else {
          onClose?.();
        }
        return;
      }

      if (event.code === 'Space' || event.key === 'k') {
        event.preventDefault();
        reproducirPausar();
      } else if (event.key === 'ArrowLeft' || event.key === 'j') {
        event.preventDefault();
        retrasar();
      } else if (event.key === 'ArrowRight' || event.key === 'l') {
        event.preventDefault();
        adelantar();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const video = videoRef.current;
        if (video) {
          const next = Math.min(1, video.volume + 0.1);
          video.volume = next;
          setVolume(next);
          setIsMuted(false);
        }
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        const video = videoRef.current;
        if (video) {
          const next = Math.max(0, video.volume - 0.1);
          video.volume = next;
          setVolume(next);
          setIsMuted(next === 0);
        }
      } else if (event.key === 'f' || event.key === 'F') {
        event.preventDefault();
        pantallaCompleta();
      } else if (event.key === 'm' || event.key === 'M') {
        event.preventDefault();
        toggleMute();
      }
    }

    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, [volume, isMuted, isPlaying]);

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
        onClick={(e) => e.stopPropagation()}
        onMouseMove={showControlsTemporarily}
      >
        {/* CABECERA RETRO */}
        <header className="reproductor__header">
          <div className="reproductor__titulo-wrapper">
            <span className="reproductor__badge">Cinetika Play</span>
            <h3 className="reproductor__titulo">{titulo}</h3>
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

            <button
              type="button"
              className="reproductor__btn-close"
              onClick={onClose}
              title="Cerrar reproductor (Esc)"
            >
              ✕ Cerrar
            </button>
          </div>
        </header>

        {/* PANTALLA DE VIDEO */}
        <div className="reproductor__screen" onClick={reproducirPausar}>
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
            Tu navegador no soporta el formato de video HTML5.
          </video>

          {/* Botón flotante central cuando está pausado */}
          {!isPlaying && (
            <div className="reproductor__center-btn" aria-hidden="true">
              ▶
            </div>
          )}

          {/* CONTROLES INTEGRADOS */}
          <section
            className={`controles ${controlsVisible || !isPlaying ? 'controles--visible' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Barra de progreso retro */}
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

            {/* Botonera de control */}
            <section className="botones">
              {/* Izquierda: Play, -10s, +10s, Tiempo */}
              <div className="izquierda">
                <button
                  type="button"
                  onClick={reproducirPausar}
                  aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
                  title={isPlaying ? 'Pausar (Espacio)' : 'Reproducir (Espacio)'}
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>

                <button
                  type="button"
                  onClick={retrasar}
                  aria-label="Retroceder 10 segundos"
                  title="Retroceder 10 segundos (←)"
                >
                  ⏮️
                </button>

                <button
                  type="button"
                  onClick={adelantar}
                  aria-label="Adelantar 10 segundos"
                  title="Adelantar 10 segundos (→)"
                >
                  ⏭️
                </button>

                <span id="tiempo">
                  {formatoTiempo(currentTime)}/{formatoTiempo(duration)}
                </span>
              </div>

              {/* Derecha: Volumen, Pantalla Completa */}
              <div className="derecha">
                <div className="volumen-wrapper">
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                    title="Silenciar / Activar sonido (M)"
                  >
                    {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                  </button>

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

                <button
                  type="button"
                  onClick={pantallaCompleta}
                  aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                  title="Pantalla completa (F)"
                >
                  {isFullscreen ? '⤦' : '[ ]'}
                </button>
              </div>
            </section>
          </section>
        </div>

        {/* PIE CON ATAJOS ÚTILES */}
        <footer className="reproductor__shortcuts-hint">
          <span>
            <kbd>Espacio</kbd> Play/Pausa &bull; <kbd>←</kbd> <kbd>→</kbd> ±10s &bull; <kbd>↑</kbd> <kbd>↓</kbd> Volumen &bull; <kbd>F</kbd> Pantalla completa
          </span>
          <span>{isDirect ? 'Directo MP4' : 'Reproductor Cinetika HD'}</span>
        </footer>
      </section>
    </div>
  );
}

