import { montarAuthForm } from '../components/authForm.js'
import { MENSAJES } from '../data/mensajes.js'
import { register } from '../services/authService.js'
import { validar } from '../utils/validators.js'
import { navegar, destinoTrasLogin } from '../router.js'

export function montarRegister(vista) {
  montarAuthForm(vista, {
    title: 'Crea tu cuenta',
    subtitle: 'Guarda tus soluciones y sigue tu progreso.',
    fields: [
      {
        name: 'username',
        label: 'Usuario',
        requiredMsg: 'Elige un nombre de usuario.',
        autocomplete: 'username',
        placeholder: 'Ej. Pixel_Bender05',
        hint: 'Elige un nombre de usuario de 3 a 20 caracteres.'
      },
      {
        name: 'email',
        label: 'Correo',
        requiredMsg: 'Escribe tu correo.',
        type: 'email',
        autocomplete: 'email',
        placeholder: 'nombre@correo.com'
      },
      {
        name: 'password',
        label: 'Contraseña',
        requiredMsg: 'Crea una contraseña.',
        type: 'password',
        autocomplete: 'new-password',
        hint: 'Mínimo 8 caracteres, con letras y números.'
      }
    ],
    submitLabel: 'Crear cuenta',
    loadingLabel: 'Creando tu cuenta…',
    successLabel: 'Cuenta creada',
    links: [{ href: '#/login', label: '¿Ya tienes cuenta? Inicia sesión' }],
    note: 'Usamos tu correo solo para confirmar tu cuenta y recuperar tu contraseña.',
    validar: (valores) =>
      validar(valores, { username: 'username', email: 'email', password: 'password' }),
    async onSubmit(valores) {
      const response = await register(valores)
      if (response.ok)
        return response.needsConfirmation
          ? { ok: true, message: MENSAJES.registroConfirmar }
          : { ok: true, message: MENSAJES.registroExitoso, done: () => navegar(destinoTrasLogin()) }

      const fallos = {
        'username-taken': {
          message: MENSAJES.usuarioEnUso,
          fieldErrors: { username: 'Ese usuario ya está en uso.' }
        },
        'email-taken': {
          message: MENSAJES.correoEnUso,
          fieldErrors: { email: 'Este correo ya tiene una cuenta.' }
        },
        'weak-password': {
          message: MENSAJES.passwordDebil,
          fieldErrors: { password: 'Prueba con una contraseña más larga.' }
        },
        'rate-limit': { message: MENSAJES.demasiadosIntentos }
      }
      return { ok: false, ...(fallos[response.code] ?? { message: MENSAJES.errorGenerico }) }
    }
  })
}
