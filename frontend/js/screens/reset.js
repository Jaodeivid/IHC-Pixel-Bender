import { montarAuthForm } from '../components/authForm.js'
import { MENSAJES } from '../data/mensajes.js'
import { actualizarPassword } from '../services/authService.js'
import { validar } from '../utils/validators.js'
import { navegar } from '../router.js'

export function montarReset(vista) {
  montarAuthForm(vista, {
    title: 'Crea una contraseña nueva',
    subtitle: 'Elige una contraseña que no hayas usado antes.',
    fields: [
      {
        name: 'password',
        label: 'Nueva contraseña',
        requiredMsg: 'Escribe tu nueva contraseña.',
        type: 'password',
        autocomplete: 'new-password',
        hint: 'Mínimo 8 caracteres, con letras y números.'
      }
    ],
    submitLabel: 'Guardar contraseña nueva',
    loadingLabel: 'Guardando…',
    successLabel: 'Contraseña guardada',
    links: [{ href: '#/inicio', label: 'Ahora no' }],
    validar: (valores) => validar(valores, { password: 'password' }),
    async onSubmit({ password }) {
      const response = await actualizarPassword(password)
      if (response.ok)
        return { ok: true, message: MENSAJES.resetExitoso, done: () => navegar('inicio') }
      if (response.code === 'same-password')
        return {
          ok: false,
          message: MENSAJES.passwordRepetido,
          fieldErrors: { password: 'Debe ser distinta a la anterior.' }
        }
      if (response.code === 'weak-password')
        return {
          ok: false,
          message: MENSAJES.passwordDebil,
          fieldErrors: { password: 'Prueba con una contraseña más larga.' }
        }
      return { ok: false, message: MENSAJES.errorGenerico }
    }
  })
}
