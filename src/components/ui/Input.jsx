
import { useId, useState } from 'react';
import '../../styles/Input.css';

export default function Input({
  id,
  type = 'text',
  name,
  label,
  placeholder = '',
  value,
  onChange,
  clearable = false,
  showPasswordToggle = false,
  disabled = false,
  required = false,
  className = '',
  ...rest
}) {
  const generatedId = useId();
  const inputId = id || generatedId;

  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';

  const inputType =
    isPassword && showPassword ? 'text' : type;

  const hasValue = String(value ?? '').length > 0;

  function handleClear() {
    if (!onChange) return;

    onChange({
      target: {
        name,
        value: '',
      },
    });
  }

  return (
    <div className={`cinetika-input ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="cinetika-input__label"
        >
          {label}
        </label>
      )}

      <div className="cinetika-input__field">

        <div
          className="cinetika-input__decoration"
          aria-hidden="true"
        >
          <span className="cinetika-input__red" />
          <span className="cinetika-input__blue" />
        </div>

        <input
          {...rest}
          id={inputId}
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="cinetika-input__control"
        />

        {clearable && hasValue && !disabled && (
          <button
            type="button"
            className="cinetika-input__action"
            aria-label="Limpiar campo"
            onClick={handleClear}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}

        {isPassword && showPasswordToggle && !disabled && (
          <button
            type="button"
            className="cinetika-input__action"
            aria-label={
              showPassword
                ? 'Ocultar contraseña'
                : 'Mostrar contraseña'
            }
            aria-pressed={showPassword}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 3l18 18" />
                <path d="M10.6 5.2A10.7 10.7 0 0 1 12 5c5 0 9 7 9 7a15 15 0 0 1-3.4 3.7" />
                <path d="M6.4 6.4C3.9 8 3 12 3 12s4 7 9 7a8 8 0 0 0 3-.6" />
                <path d="M10 10a3 3 0 0 0 4 4" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}

      </div>
    </div>
  );
}
