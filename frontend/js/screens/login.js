import { montarAuthForm } from '../components/authForm.js'
import { MENSAJES } from '../data/mensajes.js'
import { login } from '../services/authService.js'
import { navegar, destinoTrasLogin } from '../router.js'

export function montarLogin(vista, { error = false } = {}) {
  montarAuthForm(vista, {
    title: 'Inicio de sesión',
    subtitle: 'Accede para guardar tus soluciones y tu progreso.',
    fields: [
      {
        name: 'identifier',
        label: 'Usuario o correo',
        requiredMsg: 'Escribe tu usuario o correo.',
        autocomplete: 'username',
        placeholder: 'Ej. Pixel_Bender05'
      },
      {
        name: 'password',
        label: 'Contraseña',
        requiredMsg: 'Escribe tu contraseña.',
        type: 'password',
        autocomplete: 'current-password'
      }
    ],
    submitLabel: 'Iniciar sesión',
    loadingLabel: 'Verificando…',
    successLabel: 'Sesión iniciada',
    links: [
      { href: '#/recuperar', label: '¿Olvidaste tu contraseña?' },
      { href: '#/registro', label: 'Crear cuenta' }
    ],
    note: 'Tu avance se guarda al enviar una solución.',
    async onSubmit({ identifier, password }) {
      const response = await login(identifier, password)
      if (response.ok)
        return {
          ok: true,
          message: MENSAJES.loginExitoso,
          done: () => navegar(destinoTrasLogin()) // Problemas, o la pantalla que intentó abrir
        }
      if (response.code === 'unconfirmed')
        return { ok: false, message: MENSAJES.correoSinConfirmar }
      return { ok: false, message: MENSAJES.credencialesInvalidas, focus: 'password' }
    },
    initial: error
      ? {
          values: { identifier: 'Pixel_Bender05', password: 'incorrecta1' },
          message: MENSAJES.credencialesInvalidas
        }
      : null
  })
}
