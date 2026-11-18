import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm'
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY as CLAVE_PUBLICA } from '../config.js'

// Se lee antes de que Supabase limpie la URL: indica que llegó desde el correo de recuperación.
export const vinoDeRecuperacion = new URLSearchParams(location.search).get('flow') === 'recovery'

// Si pegaste "https://xxxx.supabase.co/rest/v1/", se queda solo con "https://xxxx.supabase.co"
const urlProyecto = (() => {
  try {
    return new URL(SUPABASE_URL).origin
  } catch {
    return SUPABASE_URL
  }
})()

export const usoClaveSecreta = CLAVE_PUBLICA.startsWith('sb_secret_')
export const estaConfigurado =
  urlProyecto.startsWith('https://') && !CLAVE_PUBLICA.startsWith('PEGA') && !usoClaveSecreta

export const supabase = estaConfigurado
  ? createClient(urlProyecto, CLAVE_PUBLICA, { auth: { flowType: 'pkce' } })
  : null
