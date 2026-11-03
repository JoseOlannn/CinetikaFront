import { api } from './api.js';
import { logout } from './authService.js';

/**
 * Actualizar perfil de usuario en el backend.
 */
export async function updateProfile(datos) {
  const userId = datos.id || datos._id;

  const payload = {
    nombre: datos.nombre,
    foto_perfil: datos.foto_perfil,
  };

  if (datos.password) {
    payload.password = datos.password;
  }

  const data = await api.put(`/usuarios/${userId}`, payload);

  const usuario = {
    id: data.usuario.id || data.usuario._id,
    _id: data.usuario._id || data.usuario.id,
    nombre: data.usuario.nombre,
    email: data.usuario.email,
    correo: data.usuario.email,
    foto_perfil: data.usuario.foto_perfil || '',
  };

  localStorage.setItem('cinetika_user', JSON.stringify(usuario));

  return {
    success: true,
    message: data.mensaje || 'Perfil actualizado correctamente.',
    usuario,
  };
}

/**
 * Eliminar cuenta de usuario en el backend.
 */
export async function deleteAccount(id) {
  let userId = id;

  if (!userId) {
    try {
      const stored = JSON.parse(localStorage.getItem('cinetika_user') || '{}');
      userId = stored.id || stored._id;
    } catch {
      // Ignorar
    }
  }

  if (!userId) {
    throw new Error('No se encontró el ID del usuario a eliminar.');
  }

  const data = await api.delete(`/usuarios/${userId}`);

  logout();

  return {
    success: true,
    message: data.mensaje || 'Cuenta eliminada correctamente.',
  };
}
