
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  updateProfile,
  deleteAccount,
} from '../services/profileService.js';

import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import IconButton from '../components/ui/IconButton.jsx';

import '../styles/EditProfile.css';

const DEFAULT_AVATAR = '/images/default-avatar.png';
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export default function EditProfile({
  usuario,
  onLogout,
}) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [nombre, setNombre] = useState(
    usuario?.nombre ?? ''
  );

  // Nunca se carga la contraseña actual.
  const [password, setPassword] = useState('');
  const [preview, setPreview] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const avatarUrl =
    preview ||
    usuario?.foto_perfil ||
    DEFAULT_AVATAR;

  // Evitar conservar URLs temporales de imágenes.
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // ====================================
  // SELECCIONAR FOTOGRAFÍA
  // ====================================

  function handleAvatarChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError('');
    setSuccess('');

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError('Selecciona una imagen JPG, PNG o WebP.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setError('La imagen no puede superar los 5 MB.');
      event.target.value = '';
      return;
    }

    setPreview(URL.createObjectURL(file));
    event.target.value = '';
  }

  // ====================================
  // GUARDAR (SIMULADO)
  // ====================================

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!usuario) {
        setError('Debes iniciar sesión para editar tu perfil.');
        return;
    }

    if (nombre.trim().length < 2) {
        setError('El nombre debe tener al menos 2 caracteres.');
        return;
    }

    if (password && password.length < 8) {
        setError(
        'La nueva contraseña debe tener al menos 8 caracteres.'
        );
        return;
    }

    try {
        const result = await updateProfile({
        id: usuario.id,
        nombre: nombre.trim(),
        correo: usuario.correo,
        foto_perfil: usuario.foto_perfil,
        });

        setSuccess(result.message);
    } catch {
        setError('No se pudieron guardar los cambios.');
    }
    }

  // ====================================
  // BORRAR CUENTA (SIMULADO)
  // ====================================

  async function handleDeleteAccount() {
    try {
        const result = await deleteAccount();

        if (!result.success) {
        throw new Error('No se pudo eliminar la cuenta.');
        }

        setShowDeleteConfirm(false);
        onLogout?.();

        navigate('/', {
        replace: true,
        state: {
            notice: result.message,
        },
        });
    } catch {
        setShowDeleteConfirm(false);
        setError('No se pudo procesar la solicitud.');
    }
    }

  // ====================================
  // RENDERIZADO
  // ====================================

  return (
    <div className="edit-profile-page">
      <section className="edit-profile">

        <h1 className="edit-profile__title">
          Editar perfil
        </h1>

        <form
          className="edit-profile__layout"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* AVATAR */}
          <div className="edit-profile__avatar-column">
            <div className="edit-profile__avatar-box">
              <img
                src={avatarUrl}
                alt="Fotografía de perfil"
                className="edit-profile__avatar"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = DEFAULT_AVATAR;
                }}
              />

              <IconButton
              icon="pencil"
              size="sm"
              className="edit-profile__avatar-edit"
              aria-label="Cambiar fotografía de perfil"
              title="Cambiar fotografía"
              onClick={() => fileInputRef.current?.click()}
            />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="edit-profile__file-input"
              aria-label="Seleccionar fotografía"
              onChange={handleAvatarChange}
            />
          </div>

          {/* CAMPOS */}
          <div className="edit-profile__form-column">
            <div className="edit-profile__field">
              <label
                className="edit-profile__label"
                htmlFor="edit-name"
              >
                Nombre
              </label>

              <Input
                id="edit-name"
                name="nombre"
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(event) => {
                  setNombre(event.target.value);
                  setError('');
                  setSuccess('');
                }}
                autoComplete="name"
                required
              />
            </div>

            <div className="edit-profile__field">
              <label
                className="edit-profile__label"
                htmlFor="edit-email"
              >
                Email
              </label>

              <Input
                id="edit-email"
                name="correo"
                type="email"
                value={usuario?.correo ?? ''}
                disabled
              />
            </div>

            <div className="edit-profile__field">
              <label
                className="edit-profile__label"
                htmlFor="edit-password"
              >
                Contraseña
              </label>

              <Input
                id="edit-password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError('');
                  setSuccess('');
                }}
                autoComplete="new-password"
                showPasswordToggle
              />
            </div>

            {error && (
              <p
                className="edit-profile__message edit-profile__message--error"
                role="alert"
              >
                {error}
              </p>
            )}

            {success && (
              <p
                className="edit-profile__message edit-profile__message--success"
                role="status"
              >
                {success}
              </p>
            )}

            {/* SOLO DOS BOTONES PRINCIPALES */}
            <div className="edit-profile__actions">
              <Button
                type="submit"
                variant="primary"
                size="sm"
              >
                Guardar
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Borrar cuenta
              </Button>
            </div>
          </div>
        </form>

        {/* CONFIRMACIÓN DE BORRADO */}
        {showDeleteConfirm && (
          <div className="edit-profile__overlay">
            <div
              className="edit-profile__dialog"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="delete-title"
              aria-describedby="delete-description"
            >
              <h2 id="delete-title">
                ¿Borrar cuenta?
              </h2>

              <p id="delete-description">
                Esta acción es una simulación.
                No se eliminará ningún usuario ni sus datos.
              </p>

              <div className="edit-profile__dialog-actions">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleDeleteAccount}
                >
                  Confirmar
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Volver
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
