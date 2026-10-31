import { useState } from 'react';
import { useNavigate } from 'react-router';

import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';

import { login, register } from '../../services/authService.js';
import '../../styles/AuthForm.css';

import FondoPortadas from './FondoPortadas.jsx';

// ====================================
// VALIDACIONES EN CLIENTE
// ====================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarRegistro(formData) {
  const nombre = (formData.nombre || '').trim();
  const correo = (formData.correo || '').trim().toLowerCase();

  if (nombre.length < 2) {
    return 'El nombre debe tener al menos 2 caracteres.';
  }

  if (!EMAIL_REGEX.test(correo)) {
    return 'Ingresa un correo electrónico válido.';
  }

  if (formData.password.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres.';
  }

  if (formData.password !== formData.confirmPassword) {
    return 'Las contraseñas no coinciden.';
  }

  return null;
}

// ====================================
// COMPONENTE
// ====================================

export default function AuthForm({
  mode = 'login',
  onLogin,
  notice = '',
}) {
  const navigate = useNavigate();
  const isRegister = mode === 'register';

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // ====================================
  // CAMBIOS EN LOS CAMPOS
  // ====================================

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
    setSuccess('');
  }

  // ====================================
  // ENVÍO DEL FORMULARIO
  // ====================================

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setSuccess('');

    // REGISTRO REAL CON BACKEND
    if (isRegister) {
      const validationError = validarRegistro(formData);

      if (validationError) {
        setError(validationError);
        return;
      }

      setLoading(true);

      try {
        const result = await register(
          formData.nombre,
          formData.correo,
          formData.password
        );

        setSuccess(
          result.mensaje || '¡Cuenta registrada con éxito! Entrando a la plataforma...'
        );

        setTimeout(() => {
          if (result.usuario) {
            onLogin?.(result.usuario);
          }
          navigate('/catalogo');
        }, 1200);

      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Ocurrió un error al registrar la cuenta.'
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    // LOGIN REAL CON BACKEND
    setLoading(true);

    try {
      const result = await login(
        formData.correo,
        formData.password
      );

      onLogin?.(result.usuario);
      navigate('/catalogo');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al iniciar sesión.'
      );
    } finally {
      setLoading(false);
    }
  }

  // ====================================
  // CAMBIAR DE PÁGINA
  // ====================================

  function handleSwitchPage() {
    navigate(isRegister ? '/' : '/registro');
  }

  // ====================================
  // RENDERIZADO
  // ====================================

  return (
    <main className="auth-page">
      <FondoPortadas />
      <section
        className="auth-card"
        aria-labelledby="auth-title"
      >
        {/* LOGO */}
        <img
          src="/images/logo.png"
          alt="Cinetika"
          className="auth-card__logo"
        />

        <div className="auth-card__content">
          <h1
            id="auth-title"
            className="auth-card__title"
          >
            {isRegister ? 'Crear cuenta' : 'Inicio de sesión'}
          </h1>

          <form
            className="auth-card__form"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* NOMBRE */}
            {isRegister && (
              <Input
                type="text"
                name="nombre"
                placeholder="Nombre"
                aria-label="Nombre"
                autoComplete="name"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            )}

            {/* CORREO */}
            <Input
              type="email"
              name="correo"
              placeholder="Email"
              aria-label="Correo electrónico"
              autoComplete="email"
              value={formData.correo}
              onChange={handleChange}
              required
            />

            {/* CONTRASEÑA */}
            <Input
              type="password"
              name="password"
              placeholder="Contraseña"
              aria-label="Contraseña"
              autoComplete={
                isRegister
                  ? 'new-password'
                  : 'current-password'
              }
              value={formData.password}
              onChange={handleChange}
              showPasswordToggle
              required
            />

            {/* CONFIRMAR CONTRASEÑA */}
            {isRegister && (
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                aria-label="Confirmar contraseña"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                showPasswordToggle
                required
              />
            )}

            {/* AVISO */}
            {!isRegister && notice && (
              <p
                className="auth-card__success"
                role="status"
              >
                {notice}
              </p>
            )}

            {/* ERROR */}
            {error && (
              <p
                className="auth-card__error"
                role="alert"
              >
                {error}
              </p>
            )}

            {/* ÉXITO */}
            {success && (
              <p
                className="auth-card__success"
                role="status"
              >
                {success}
              </p>
            )}

            {/* BOTONES */}
            <div className="auth-card__actions">
              {!success && (
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? 'Verificando...'
                    : isRegister
                      ? 'Registrarse'
                      : 'Iniciar sesión'}
                </Button>
              )}

              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={handleSwitchPage}
                disabled={loading}
              >
                {isRegister
                  ? 'Iniciar sesión'
                  : 'Crear cuenta'}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
