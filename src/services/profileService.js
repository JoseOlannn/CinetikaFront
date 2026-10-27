
/*
 * PROFILE SERVICE - CINETIKA
 *
 * Operaciones simuladas para desarrollo.
 * No modifica users.json ni una base de datos.
 *
 * Cuando backend esté disponible,
 * sustituiremos estas funciones por peticiones HTTP.
 */

// ====================================
// ACTUALIZAR PERFIL
// ====================================

export async function updateProfile(datos) {
  // No guarda los cambios: simulación de API.
  return {
    success: true,
    simulated: true,
    message:
      'Cambios simulados correctamente. ' +
      'No se modificaron los datos de tu cuenta.',
    usuario: {
      id: datos.id,
      nombre: datos.nombre,
      correo: datos.correo,
      foto_perfil: datos.foto_perfil,
    },
  };
}

// ====================================
// ELIMINAR CUENTA
// ====================================

export async function deleteAccount() {
  // No elimina ningún usuario.
  return {
    success: true,
    simulated: true,
    message:
      'Cuenta eliminada correctamente (simulación). ' +
      'No se eliminaron datos reales.',
  };
}
