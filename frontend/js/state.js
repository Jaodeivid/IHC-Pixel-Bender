import { alCambiarSesion, obtenerSesion } from './services/authService.js'

export const auth = { user: null }

/** Carga la sesión guardada y avisa a la interfaz cuando cambia (login, logout, recuperación). */
export async function iniciarAuth({ alRecuperarPassword }) {
  // OJO: dentro de este callback no se debe llamar a otros métodos de supabase (puede bloquearse).
  alCambiarSesion((event, session) => {
    auth.user = session?.user ?? null
    window.dispatchEvent(new Event('auth-changed'))
    if (event === 'PASSWORD_RECOVERY') setTimeout(alRecuperarPassword, 0)
  })
  auth.user = (await obtenerSesion())?.user ?? null
}
