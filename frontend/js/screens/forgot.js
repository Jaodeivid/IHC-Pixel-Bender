import { montarAuthForm } from '../components/authForm.js'
import { MENSAJES } from '../data/mensajes.js'
import { enviarResetPassword } from '../services/authService.js'
import { validar } from '../utils/validators.js'

export function montarForgot(vista) {
  montarAuthForm(vista, {
    title: 'Recupera tu contraseña',
    subtitle: 'Escribe tu correo y te enviamos un enlace para crear una nueva.',
    fields: [
      {
        name: 'email',
        label: 'Correo',
        requiredMsg: 'Escribe el correo de tu cuenta.',
        type: 'email',
        autocomplete: 'email',
        placeholder: 'nombre@correo.com'
      }
    ],
    submitLabel: 'Enviar enlace',
    loadingLabel: 'Enviando…',
    successLabel: 'Enlace enviado',
    links: [{ href: '#/login', label: 'Volver a iniciar sesión' }],
    validar: (valores) => validar(valores, { email: 'email' }),
    async onSubmit({ email }) {
      const response = await enviarResetPassword(email)
      return response.ok
        ? { ok: true, message: MENSAJES.resetEnviado }
        : { ok: false, message: MENSAJES.demasiadosIntentos }
    }
  })
}
