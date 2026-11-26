import { estaConfigurado, usoClaveSecreta, vinoDeRecuperacion } from './services/supabaseClient.js'
import { iniciarAuth, auth } from './state.js'
import { logout } from './services/authService.js'
import { contarProblemas } from './services/problemasService.js'
import { obtenerPreferenciasRemotas, guardarPreferenciasRemotas } from './services/perfilService.js'
import {
  iniciarPreferencias,
  alCambiarPreferencias,
  aplicarPreferenciasRemotas,
  preferenciasActuales
} from './utils/theme.js'
import { iniciarRouter, navegar } from './router.js'
import { montarLogin } from './screens/login.js'
import { montarRegister } from './screens/register.js'
import { montarForgot } from './screens/forgot.js'
import { montarReset } from './screens/reset.js'
import { montarProblemas } from './screens/problemas.js'
import { montarProblema } from './screens/problema.js'
import { montarConfiguracion } from './screens/configuracion.js'

const app = document.getElementById('app')

iniciarPreferencias()

if (!estaConfigurado) {
  app.innerHTML = `<div class="setup"><h1>Falta conectar Supabase</h1>
    <p>${
      usoClaveSecreta
        ? 'Pegaste la clave secreta. Esa nunca va en el navegador: usa la clave <b>publicable</b> (sb_publishable_...).'
        : 'Abre <code>js/config.js</code> y pega tu URL del proyecto y tu clave publicable.'
    }</p></div>`
} else {
  await iniciarAuth({ alRecuperarPassword: () => navegar('restablecer') })
  if (vinoDeRecuperacion && auth.user)
    history.replaceState(null, '', location.pathname + '#/restablecer')

  // Diagnóstico en la consola (F12): confirma que la base de datos responde.
  contarProblemas().then(({ error, count }) =>
    error
      ? console.warn(
          "Supabase: no se pudo leer la tabla 'problems'. ¿Ejecutaste los SQL 01 al 04?",
          error.message
        )
      : console.info(`Supabase conectado ✓ (${count} problemas)`)
  )

  // ---------- Preferencias: del dispositivo a la cuenta y de la cuenta al dispositivo ----------
  let usuarioSincronizado = null
  async function sincronizarPreferencias() {
    const id = auth.user?.id ?? null
    if (id === usuarioSincronizado) return
    usuarioSincronizado = id
    if (!id) return
    const { data } = await obtenerPreferenciasRemotas(id)
    const remotas = data?.preferences ?? {}
    if (Object.keys(remotas).length) aplicarPreferenciasRemotas(remotas)
    else guardarPreferenciasRemotas(id, preferenciasActuales()) // primera vez: sube las del dispositivo
  }
  // setTimeout: no se debe llamar a supabase dentro del callback de onAuthStateChange
  addEventListener('auth-changed', () => setTimeout(sincronizarPreferencias, 0))
  sincronizarPreferencias()

  let temporizadorPrefs
  alCambiarPreferencias(() => {
    if (!auth.user) return
    clearTimeout(temporizadorPrefs)
    temporizadorPrefs = setTimeout(async () => {
      const { error } = await guardarPreferenciasRemotas(auth.user.id, preferenciasActuales())
      if (error)
        console.warn('No se pudieron guardar las preferencias en la cuenta:', error.message)
    }, 400)
  })

  const cerrarSesion = async () => {
    await logout()
    navegar('login')
  }

  iniciarRouter(
    {
      login: {
        title: 'Inicio de sesión',
        guestOnly: true,
        auth: true,
        renderizar: (vista) => montarLogin(vista)
      },
      'login/error': {
        title: 'Error de credenciales',
        guestOnly: true,
        auth: true,
        renderizar: (vista) => montarLogin(vista, { error: true })
      },
      registro: { title: 'Crear cuenta', guestOnly: true, auth: true, renderizar: montarRegister },
      recuperar: {
        title: 'Recuperar contraseña',
        guestOnly: true,
        auth: true,
        renderizar: montarForgot
      },
      restablecer: {
        title: 'Nueva contraseña',
        protected: true,
        auth: true,
        renderizar: montarReset
      },
      // Públicas: los visitantes pueden ver el catálogo sin cuenta.
      problemas: { title: 'Problemas', renderizar: montarProblemas },
      problema: { title: 'Problema', navActivo: 'problemas', renderizar: montarProblema },
      configuracion: { title: 'Configuración', protected: true, renderizar: montarConfiguracion }
    },
    { alCerrarSesion: cerrarSesion }
  )
}
