import { api } from './api.js';

/**
 * Normaliza el objeto usuario para asegurar compatibilidad con el frontend.
 */
function normalizarUsuario(user) {
  if (!user) return null;
  return {
    id: user.id || user._id,
    _id: user._id || user.id,
    nombre: user.nombre,
    email: user.email || user.correo,
    correo: user.email || user.correo,
    foto_perfil: user.foto_perfil || '',
  };
}

/**
 * Iniciar sesión con la API del backend.
 */
export async function login(emailOrCorreo, password) {
  const email = (emailOrCorreo || '').trim().toLowerCase();

  const data = await api.post('/auth/login', {
    email,
    password,
  });

  if (data?.token) {
    localStorage.setItem('cinetika_token', data.token);
  }

  const usuario = normalizarUsuario(data.usuario);
  if (usuario) {
    localStorage.setItem('cinetika_user', JSON.stringify(usuario));
  }

  return {
    mensaje: data.mensaje,
    token: data.token,
    usuario,
  };
}

/**
 * Registrar un nuevo usuario con la API del backend.
 */
export async function register(nombre, emailOrCorreo, password) {
  const email = (emailOrCorreo || '').trim().toLowerCase();

  const data = await api.post('/auth/register', {
    nombre: (nombre || '').trim(),
    email,
    password,
  });

  if (data?.token) {
    localStorage.setItem('cinetika_token', data.token);
  }

  const usuario = normalizarUsuario(data.usuario);
  if (usuario) {
    localStorage.setItem('cinetika_user', JSON.stringify(usuario));
  }

  return {
    mensaje: data.mensaje,
    token: data.token,
    usuario,
  };
}

/**
 * Cerrar sesión.
 */
export function logout() {
  localStorage.removeItem('cinetika_token');
  localStorage.removeItem('cinetika_user');
}

/**
 * Obtener usuario actualmente autenticado desde almacenamiento local.
 */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('cinetika_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
