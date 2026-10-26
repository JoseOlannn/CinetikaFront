
import '../../styles/IconButton.css';

const icons = {
  'chevron-left': (
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  ),

  'chevron-right': (
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),

  pencil: (
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
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
