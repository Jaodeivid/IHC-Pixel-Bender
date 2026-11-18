import { estaConfigurado, usoClaveSecreta, vinoDeRecuperacion } from './services/supabaseClient.js'
import { iniciarAuth, auth } from './state.js'
import { logout } from './services/authService.js'
import { contarProblemas } from './services/problemasService.js'
import { iniciarRouter, navegar } from './router.js'
import { montarLogin } from './screens/login.js'
import { montarRegister } from './screens/register.js'
import { montarForgot } from './screens/forgot.js'
import { montarReset } from './screens/reset.js'

const app = document.getElementById('app')

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
          "Supabase: no se pudo leer la tabla 'problems'. ¿Ejecutaste schema.sql?",
          error.message
        )
      : console.info(`Supabase conectado ✓ (${count} problemas)`)
  )

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
      // Pantalla en blanco: público, para que los visitantes puedan navegar sin cuenta.
      inicio: {
        title: 'Inicio',
        renderizar: (vista) => {
          vista.innerHTML = `<main class="blank" aria-label="Inicio"></main>`
        }
      }
    },
    { alCerrarSesion: cerrarSesion }
  )
}
