import { renderizarNavbar, enlazarNavbar } from './components/navbar.js'
import { auth } from './state.js'

export const navegar = (ruta) => {
  location.hash = '#/' + ruta
}

// Si un visitante intenta entrar a una pantalla protegida, vuelve ahí después de iniciar sesión.
let destinoPendiente = null
export const destinoTrasLogin = () => {
  const destino = destinoPendiente
  destinoPendiente = null
  return destino ?? 'problemas'
}

/** "#/problema/4A/solucion?x=1" → { nombre:'problema', params:['4A','solucion'], query } */
function leerHash(rutas) {
  const [rutaCruda, consulta = ''] = location.hash.replace(/^#\/?/, '').split('?')
  const segmentos = rutaCruda
    .split('/')
    .filter(Boolean)
    .map((segmento) => {
      try {
        return decodeURIComponent(segmento)
      } catch {
        return segmento
      }
    })
  // Rutas de dos segmentos fijos, como "login/error"
  const compuesta = segmentos.slice(0, 2).join('/')
  const esCompuesta = segmentos.length >= 2 && Object.hasOwn(rutas, compuesta)
  return {
    nombre: esCompuesta ? compuesta : (segmentos[0] ?? ''),
    params: segmentos.slice(esCompuesta ? 2 : 1),
    query: new URLSearchParams(consulta)
  }
}

/**
 * rutas = { nombre: { title, protected?, guestOnly?, auth?, navActivo?, renderizar(vista, { params, query }) } }
 * alCerrarSesion: la acción de "Cerrar sesión" (la define main.js; el router no conoce los servicios).
 */
export function iniciarRouter(rutas, { alCerrarSesion }) {
  const app = document.getElementById('app')
  app.innerHTML = `<div id="nav"></div><div id="view" tabindex="-1"></div>`
  const nav = app.querySelector('#nav')
  const vista = app.querySelector('#view')

  let rutaActual = null
  let rutaActiva = ''
  let conBuscador = true

  function renderizarNav() {
    nav.innerHTML = renderizarNavbar({
      paginaAuth: Boolean(rutaActual?.auth),
      rutaActiva,
      conBuscador
    })
    enlazarNavbar(nav, { alCerrarSesion })
  }

  function renderizarRuta() {
    const { nombre, params, query } = leerHash(rutas)
    // hasOwn evita que rutas como "#/constructor" o "#/__proto__" resuelvan a propiedades heredadas de Object.
    if (!Object.hasOwn(rutas, nombre)) return navegar('problemas')

    const ruta = rutas[nombre]
    if (ruta.protected && !auth.user) {
      destinoPendiente = location.hash.replace(/^#\//, '')
      return navegar('login')
    }
    if (ruta.guestOnly && auth.user) return navegar('problemas')

    rutaActual = ruta
    rutaActiva = ruta.navActivo ?? nombre
    conBuscador = nombre !== 'problemas' // en Problemas ya existe el campo grande
    document.title = `${ruta.title} | Codeforces`
    renderizarNav()
    vista.innerHTML = ''
    ruta.renderizar(vista, { params, query })
    vista.focus({ preventScroll: true })
    window.scrollTo(0, 0)
  }

  addEventListener('hashchange', renderizarRuta)
  addEventListener('auth-changed', renderizarNav) // solo la barra: no interrumpe mensajes de éxito
  renderizarRuta()
}
