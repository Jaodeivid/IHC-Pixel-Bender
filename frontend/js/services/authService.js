import { supabase } from './supabaseClient.js'

const aMinusculas = (texto) => texto.trim().toLowerCase()
const urlBase = () => location.origin + location.pathname
const esNetworkError = (error) => error?.name === 'AuthRetryableFetchError' || error?.status === 0

/** Acepta usuario o correo. Devuelve { ok } o { ok:false, code }. Lanza error si no hay red. */
export async function login(identificador, password) {
  let email = identificador.trim()
  if (!email.includes('@')) {
    const { data, error } = await supabase.rpc('email_by_username', {
      p_username: aMinusculas(email)
    })
    if (error) throw error
    if (!data) return { ok: false, code: 'invalid' }
    email = data
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (!error) return { ok: true }
  if (esNetworkError(error)) throw error
  return { ok: false, code: error.code === 'email_not_confirmed' ? 'unconfirmed' : 'invalid' }
}

export async function register({ username, email, password }) {
  const nombreUsuario = aMinusculas(username)
  const { data: disponible, error: errorDisponibilidad } = await supabase.rpc(
    'username_available',
    { p_username: nombreUsuario }
  )
  if (errorDisponibilidad) throw errorDisponibilidad
  if (!disponible) return { ok: false, code: 'username-taken' }

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: { data: { username: nombreUsuario }, emailRedirectTo: urlBase() }
  })
  if (error) {
    if (esNetworkError(error)) throw error
    const codigosError = {
      user_already_exists: 'email-taken',
      email_exists: 'email-taken',
      weak_password: 'weak-password',
      over_email_send_rate_limit: 'rate-limit',
      over_request_rate_limit: 'rate-limit'
    }
    console.error(error)
    return { ok: false, code: codigosError[error.code] ?? 'unknown' }
  }
  // Con confirmación de correo activa, un correo repetido no da error: devuelve identities vacío.
  if (data.user?.identities?.length === 0) return { ok: false, code: 'email-taken' }
  return { ok: true, needsConfirmation: !data.session }
}

/** Siempre responde igual exista o no el correo (no revela quién tiene cuenta). */
export async function enviarResetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: urlBase() + '?flow=recovery'
  })
  if (error) {
    if (esNetworkError(error)) throw error
    if (/rate/.test(error.code ?? '')) return { ok: false, code: 'rate-limit' }
    console.error(error)
  }
  return { ok: true }
}

export async function actualizarPassword(password) {
  const { error } = await supabase.auth.updateUser({ password })
  if (!error) return { ok: true }
  if (esNetworkError(error)) throw error
  const codigosError = { same_password: 'same-password', weak_password: 'weak-password' }
  return { ok: false, code: codigosError[error.code] ?? 'unknown' }
}

export const logout = () => supabase.auth.signOut()

/** Avisa cada vez que cambia la sesión (login, logout, recuperación). */
export const alCambiarSesion = (callback) => supabase.auth.onAuthStateChange(callback)

export async function obtenerSesion() {
  const { data } = await supabase.auth.getSession()
  return data.session
}
