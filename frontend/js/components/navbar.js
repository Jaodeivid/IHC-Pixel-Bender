import { auth } from '../state.js'
import { escaparHtml } from '../utils/escape.js'
import { temaActual, alternarTema } from '../utils/theme.js'
import { enlazarAutocompletado } from './autocompletado.js'

// Solo se muestran las secciones que ya existen. Para agregar una: { texto: 'Ranking', ruta: 'ranking' }
const LINKS = [{ texto: 'Problemas', ruta: 'problemas' }]

const ICON = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`

const SVG = (contenido) =>
  `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${contenido}</svg>`
const LUNA = SVG(`<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>`)
const SOL = SVG(
  `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>`
)
const FLECHA = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`

/** paginaAuth = true en login/registro/etc.: sin buscador ni menú (menos distracciones). */
export function renderizarNavbar({ paginaAuth = false, rutaActiva = '', conBuscador = true } = {}) {
  const user = auth.user
  const nombre = user?.user_metadata?.username ?? user?.email ?? ''
  const linksHtml = LINKS.map(({ texto, ruta }) => {
    const activo = ruta === rutaActiva ? ' aria-current="page"' : ''
    return `<a class="navbar__link" href="#/${ruta}"${activo}>${texto}</a>`
  }).join('')

  const buscador = `
    <form class="search" role="search">
      <button class="search__toggle" type="button" aria-label="Abrir búsqueda" aria-expanded="false">${ICON}</button>
      <span class="search__icon" aria-hidden="true">${ICON}</span>
      <input class="search__input" type="search" placeholder="Buscar" aria-label="Buscar problemas"
             role="combobox" aria-expanded="false" aria-controls="navSug" aria-autocomplete="list" autocomplete="off">
      <div class="sugerencias sugerencias--nav" id="navSug" hidden></div>
    </form>`

  const acciones = user
    ? `<div class="usermenu">
         <button class="usermenu__btn" id="userBtn" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="userMenu">
           <span class="usermenu__avatar" aria-hidden="true">${escaparHtml(nombre.charAt(0) || '?')}</span>
           <span class="usermenu__nombre">${escaparHtml(nombre)}</span>
           ${FLECHA}
         </button>
         <div class="usermenu__lista" id="userMenu" role="menu" aria-label="Cuenta" hidden>
           <a class="usermenu__item" role="menuitem" href="#/configuracion">Configuración</a>
           <button class="usermenu__item" role="menuitem" type="button" id="logoutBtn">Cerrar sesión</button>
         </div>
       </div>`
    : `<a class="btn btn--sm btn--ghost" href="#/login">Iniciar sesión</a><a class="btn btn--sm" href="#/registro">Crear cuenta</a>`

  const botonTema = `<button class="theme-toggle" id="themeBtn" type="button" aria-label="Modo oscuro" aria-pressed="${temaActual() === 'dark'}"><span class="theme-toggle__moon">${LUNA}</span><span class="theme-toggle__sun">${SOL}</span></button>`

  return `
    <header class="navbar">
      <a class="navbar__brand" href="#/problemas">Code<span>forces</span></a>
      <nav class="navbar__links" aria-label="Principal">${linksHtml}</nav>
      ${paginaAuth || !conBuscador ? '' : buscador}
      <div class="navbar__actions">${paginaAuth ? '' : acciones}${botonTema}</div>
    </header>`
}

let quitarClicFuera = null // evita acumular listeners en document cada vez que se redibuja la barra

export function enlazarNavbar(nav, { alCerrarSesion }) {
  quitarClicFuera?.()
  quitarClicFuera = null

  nav.querySelector('#logoutBtn')?.addEventListener('click', alCerrarSesion)

  const botonTema = nav.querySelector('#themeBtn')
  botonTema?.addEventListener('click', () =>
    botonTema.setAttribute('aria-pressed', String(alternarTema() === 'dark'))
  )

  // ---------- Menú de usuario ----------
  const botonUsuario = nav.querySelector('#userBtn')
  if (botonUsuario) {
    const menu = nav.querySelector('#userMenu')
    const items = () => [...menu.querySelectorAll('[role="menuitem"]')]
    const abrir = (enfocar) => {
      menu.hidden = false
      botonUsuario.setAttribute('aria-expanded', 'true')
      if (enfocar) items()[0]?.focus()
    }
    const cerrarMenu = (devolverFoco = false) => {
      menu.hidden = true
      botonUsuario.setAttribute('aria-expanded', 'false')
      if (devolverFoco) botonUsuario.focus()
    }
    // event.detail === 0 → se abrió con teclado: enfocar el primer elemento
    botonUsuario.addEventListener('click', (event) =>
      menu.hidden ? abrir(event.detail === 0) : cerrarMenu()
    )
    menu.addEventListener('keydown', (event) => {
      const lista = items()
      const i = lista.indexOf(document.activeElement)
      if (event.key === 'Escape') return cerrarMenu(true)
      if (event.key === 'Tab') return cerrarMenu()
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        lista[(i + 1) % lista.length].focus()
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        lista[(i - 1 + lista.length) % lista.length].focus()
      }
    })
    const fuera = (event) => {
      if (!menu.contains(event.target) && !botonUsuario.contains(event.target)) cerrarMenu()
    }
    document.addEventListener('click', fuera)
    quitarClicFuera = () => document.removeEventListener('click', fuera)
  }

  // ---------- Buscador global: atajo a Problemas con autocompletado ----------
  const buscador = nav.querySelector('.search')
  if (!buscador) return
  const toggle = buscador.querySelector('.search__toggle')
  const input = buscador.querySelector('.search__input')
  const panel = buscador.querySelector('.sugerencias')

  const irABuscar = (texto) => {
    const q = texto.trim()
    location.hash = '#/problemas' + (q ? `?q=${encodeURIComponent(q)}` : '')
  }
  enlazarAutocompletado({ input, panel, alBuscar: irABuscar })
  buscador.addEventListener('submit', (event) => {
    event.preventDefault()
    irABuscar(input.value)
  })

  // En pantallas pequeñas el buscador es un ícono que se abre sobre la barra.
  const cerrar = () => {
    buscador.classList.remove('is-open')
    toggle.setAttribute('aria-expanded', 'false')
  }
  toggle.addEventListener('click', () => {
    buscador.classList.add('is-open')
    toggle.setAttribute('aria-expanded', 'true')
    input.focus()
  })
  input.addEventListener('blur', () => setTimeout(cerrar, 200))
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      cerrar()
      toggle.focus()
    }
  })
}
