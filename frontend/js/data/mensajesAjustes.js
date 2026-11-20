// Microcopy de la pantalla de Configuración.
export const MENSAJES_AJUSTES = {
  usuarioCambiado: {
    type: 'success',
    title: 'Usuario actualizado',
    text: 'Tu nuevo nombre de usuario ya está activo.'
  },
  correoPendiente: {
    type: 'success',
    title: 'Revisa tu correo',
    text: 'Te enviamos un enlace para confirmar el cambio. Hasta entonces seguirás usando tu correo actual.'
  },
  passwordCambiada: {
    type: 'success',
    title: 'Contraseña actualizada',
    text: 'Úsala la próxima vez que inicies sesión.'
  },
  passwordActualIncorrecta: {
    type: 'error',
    title: 'La contraseña actual no coincide',
    text: 'Revísala e inténtalo de nuevo.'
  }
}
