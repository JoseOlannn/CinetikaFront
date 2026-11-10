
import '../../styles/IconButton.css';

const icons = {
  // ====================================
  // REPRODUCTOR
  // ====================================

  play: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5 19 12 8 19Z" />
    </svg>
  ),

  pause: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="4" width="4" height="16" rx="0.5" />
      <rect x="14" y="4" width="4" height="16" rx="0.5" />
    </svg>
  ),

  'skip-back': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5a7 7 0 1 0 7 7" />
      <path d="M12 2v5H7" />
      <text
        x="12"
        y="15.2"
        textAnchor="middle"
        stroke="none"
        fill="currentColor"
        fontSize="6.5"
        fontWeight="700"
      >
        10
      </text>
    </svg>
  ),

  'skip-forward': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5a7 7 0 1 1-7 7" />
      <path d="M12 2v5h5" />
      <text
        x="12"
        y="15.2"
        textAnchor="middle"
        stroke="none"
        fill="currentColor"
        fontSize="6.5"
        fontWeight="700"
      >
        10
      </text>
    </svg>
  ),

  'volume-2': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m11 5-5 4H3v6h3l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18 5a9 9 0 0 1 0 14" />
    </svg>
  ),

  'volume-1': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m11 5-5 4H3v6h3l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
    </svg>
  ),

  'volume-x': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m11 5-5 4H3v6h3l5 4V5Z" />
      <path d="m16 9 5 6m0-6-5 6" />
    </svg>
  ),

  maximize: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />
    </svg>
  ),

  minimize: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8h5V3m13 5h-5V3M3 16h5v5m13-5h-5v5" />
    </svg>
  ),

  // ====================================
  // NAVEGACIÓN
  // ====================================

  'chevron-left': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  ),

  'chevron-right': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),

  // ====================================
  // PERFIL
  // ====================================

  pencil: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4 10.5-10.5Z" />
    </svg>
  ),
};

export default function IconButton({
  icon,
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      {...props}
      type={type}
      className={[
        'cinetika-icon-button',
        `cinetika-icon-button--${size}`,
        className,
      ].filter(Boolean).join(' ')}
    >
      {icons[icon] || null}
    </button>
  );
}
