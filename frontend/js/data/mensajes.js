// Microcopy centralizado: qué pasó y cómo solucionarlo.
export const MENSAJES = {
  credencialesInvalidas: {
    type: 'error',
    title: 'No pudimos iniciar tu sesión',
    text: 'El usuario o la contraseña no coinciden. Revísalos e inténtalo de nuevo.',
    action: 'fix',
    actionLabel: 'Corregir credenciales'
  },
  correoSinConfirmar: {
    type: 'warning',
    title: 'Falta confirmar tu correo',
    text: 'Te enviamos un enlace al registrarte. Ábrelo y vuelve a iniciar sesión.'
  },
  sinConexion: {
    type: 'warning',
    title: 'Sin conexión con el servidor',
    text: 'Tus datos están a salvo. Revisa tu internet y vuelve a intentarlo.',
    action: 'retry',
    actionLabel: 'Reintentar'
  },
  demasiadosIntentos: {
    type: 'warning',
    title: 'Demasiados intentos',
    text: 'Espera unos minutos antes de volver a intentarlo.'
  },
  errorGenerico: {
    type: 'error',
    title: 'Algo salió mal',
    text: 'No pudimos completar la acción. Inténtalo otra vez en un momento.'
  },
  loginExitoso: {
    type: 'success',
    title: '¡Bienvenido de vuelta!',
    text: 'Te estamos llevando a tu cuenta.'
  },

  usuarioEnUso: {
    type: 'error',
    title: 'Ese usuario ya existe',
    text: 'Elige otro nombre; puedes añadir números o guion bajo.'
  },
  correoEnUso: {
    type: 'error',
    title: 'Ya hay una cuenta con ese correo',
    text: 'Inicia sesión, o recupera tu contraseña si no la recuerdas.'
  },
  passwordDebil: {
    type: 'error',
    title: 'Esa contraseña es muy débil',
    text: 'Usa mínimo 8 caracteres, con letras y números.'
  },
  registroExitoso: {
    type: 'success',
    title: '¡Cuenta creada!',
    text: 'Te estamos llevando a tu cuenta.'
  },
  registroConfirmar: {
    type: 'success',
    title: 'Revisa tu correo',
    text: 'Te enviamos un enlace para confirmar tu cuenta. Ábrelo para terminar el registro.'
  },

  resetEnviado: {
    type: 'success',
    title: 'Enlace enviado',
    text: 'Si ese correo tiene una cuenta, recibirás un enlace para crear una contraseña nueva. Revisa también el spam.'
  },
  resetExitoso: {
    type: 'success',
    title: 'Contraseña actualizada',
    text: 'Te estamos llevando a tu cuenta.'
  },
  passwordRepetido: {
    type: 'error',
    title: 'Usa una contraseña distinta',
    text: 'La nueva contraseña debe ser diferente a la anterior.'
  }
}
