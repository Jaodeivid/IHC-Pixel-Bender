import { renderizarNavbar, enlazarNavbar } from './components/navbar.js'
import { auth } from './state.js'

export const navegar = (ruta) => {
  location.hash = '#/' + ruta
}

/**
 * rutas = { nombreRuta: { title, protected?, guestOnly?, renderizar(vista) } }
 * alCerrarSesion: la acción del botón "Cerrar sesión" (la define main.js; el router no conoce los servicios).
 */
export function iniciarRouter(rutas, { alCerrarSesion }) {
  const app = document.getElementById('app')
  app.innerHTML = `<div id="nav"></div><div id="view" tabindex="-1"></div>`
  const nav = app.querySelector('#nav')
  const vista = app.querySelector('#view')

  let rutaActual = null

  function renderizarNav() {
    nav.innerHTML = renderizarNavbar({ paginaAuth: Boolean(rutaActual?.auth) })
    enlazarNavbar(nav, { alCerrarSesion })
  }

  function renderizarRuta() {
    const nombreRuta = location.hash.replace(/^#\//, '') || 'login'
    // hasOwn evita que rutas como "#/constructor" o "#/__proto__" resuelvan a propiedades heredadas de Object.
    const ruta = Object.hasOwn(rutas, nombreRuta) ? rutas[nombreRuta] : rutas.login
    if (ruta.protected && !auth.user) return navegar('login')
    if (ruta.guestOnly && auth.user) return navegar('inicio')

    rutaActual = ruta
    document.title = `${ruta.title} | Codeforces`
    renderizarNav()
    vista.innerHTML = ''
    ruta.renderizar(vista)
    vista.focus({ preventScroll: true })
    window.scrollTo(0, 0)
  }

  addEventListener('hashchange', renderizarRuta)
  addEventListener('auth-changed', renderizarNav) // solo la barra: no interrumpe mensajes de éxito
  renderizarRuta()
}
