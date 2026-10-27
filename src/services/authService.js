
import users from '../mocks/users.json';

/*
 * MOCK AUTH - SOLO PARA DESARROLLO
 *
 * Utiliza usuarios ficticios de users.json.
 * No implementa autenticación real.
 * Se reemplazará por llamadas a la API del backend.
 */

export async function login(correo, password) {
  const usuario = users.find(
    (item) =>
      item.correo.toLowerCase() === correo.trim().toLowerCase() &&
      item.password === password
  );

  if (!usuario) {
    throw new Error('Correo o contraseña incorrectos');
  }

  // Excluir la contraseña de los datos que usará React.
  const {
    password: _password,
    ...usuarioPublico
  } = usuario;

  void _password;

  return {
    usuario: usuarioPublico,
  };
}
