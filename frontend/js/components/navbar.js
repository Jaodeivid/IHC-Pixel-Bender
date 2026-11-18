import { auth } from '../state.js'
import { escaparHtml } from '../utils/escape.js'
import { temaActual, alternarTema } from '../utils/theme.js'

const LINKS = ['Problemas', 'Concursos', 'Mi progreso'] // visibles para todos; enviar soluciones pedirá sesión

const ICON = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`

const SVG = (contenido) =>
  `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${contenido}</svg>`
const LUNA = SVG(`<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>`)
const SOL = SVG(
  `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>`
)

/** paginaAuth = true en login/registro/etc.: sin buscador ni botones repetidos (menos distracciones). */
export function renderizarNavbar({ paginaAuth = false } = {}) {
  const user = auth.user
  const nombre = user?.user_metadata?.username ?? user?.email ?? ''
  const linksHtml = LINKS.map((texto) => `<a class="navbar__link" href="#">${texto}</a>`).join('')

  const buscador = `
    <form class="search" role="search">
      <button class="search__toggle" type="button" aria-label="Abrir búsqueda" aria-expanded="false">${ICON}</button>
      <span class="search__icon" aria-hidden="true">${ICON}</span>
      <input class="search__input" type="search" placeholder="Buscar problemas" aria-label="Buscar problemas">
    </form>`

  const acciones = user
    ? `<span class="navbar__user">${escaparHtml(nombre)}</span><button class="btn btn--sm btn--ghost" id="logoutBtn" type="button">Cerrar sesión</button>`
    : `<a class="btn btn--sm btn--ghost" href="#/login">Iniciar sesión</a><a class="btn btn--sm" href="#/registro">Crear cuenta</a>`

  const botonTema = `<button class="theme-toggle" id="themeBtn" type="button" aria-label="Modo oscuro" aria-pressed="${temaActual() === 'dark'}"><span class="theme-toggle__moon">${LUNA}</span><span class="theme-toggle__sun">${SOL}</span></button>`

  return `
    <header class="navbar">
      <a class="navbar__brand" href="#/inicio">Code<span>forces</span></a>
      <nav class="navbar__links" aria-label="Principal">${linksHtml}</nav>
      ${paginaAuth ? '' : buscador}
      <div class="navbar__actions">${paginaAuth ? '' : acciones}${botonTema}</div>
    </header>`
}

export function enlazarNavbar(nav, { alCerrarSesion }) {
  nav.querySelector('#logoutBtn')?.addEventListener('click', alCerrarSesion)

  const botonTema = nav.querySelector('#themeBtn')
  botonTema?.addEventListener('click', () =>
    botonTema.setAttribute('aria-pressed', String(alternarTema() === 'dark'))
  )

  // Esas secciones aún no existen: sin esto, href="#" vaciaba el hash y el router llevaba al login.
  nav
    .querySelectorAll('.navbar__link')
    .forEach((link) => link.addEventListener('click', (event) => event.preventDefault()))

  const buscador = nav.querySelector('.search')
  if (!buscador) return
  const toggle = buscador.querySelector('.search__toggle')
  const input = buscador.querySelector('.search__input')

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
  input.addEventListener('blur', () => setTimeout(cerrar, 120))
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      cerrar()
      toggle.focus()
    }
  })
  buscador.addEventListener('submit', (event) => event.preventDefault())
}
