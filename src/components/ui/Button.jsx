
import '../../styles/Button.css';

const icons = {
  play: (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7 3.5 20 12 7 20.5Z" />
    </svg>
  ),

  eye: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.7-7 10-7 10 7 10 7-3.7 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
  className = '',
  disabled = false,
  ...rest
}) {
  const variantClass = [
    'primary',
    'secondary',
    'outline',
  ].includes(variant)
    ? variant
    : 'primary';

  const sizeClass = ['sm', 'md', 'lg'].includes(size)
    ? size
    : 'md';

  const buttonClasses = [
    'cinetika-button',
    `cinetika-button--${variantClass}`,
    `cinetika-button--${sizeClass}`,
    fullWidth ? 'cinetika-button--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconElement = icons[icon] || null;

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      className={buttonClasses}
    >
      {iconElement && iconPosition === 'left' && (
        <span className="cinetika-button__icon">
          {iconElement}
        </span>
      )}

      <span className="cinetika-button__text">
        {children}
      </span>

      {iconElement && iconPosition === 'right' && (
        <span className="cinetika-button__icon">
          {iconElement}
        </span>
      )}
    </button>
  );
}
