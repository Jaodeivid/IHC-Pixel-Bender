import { listarProblemas, listarEtiquetas } from '../services/problemasService.js'
import { enlazarAutocompletado } from '../components/autocompletado.js'
import { escaparHtml } from '../utils/escape.js'
import { navegar } from '../router.js'

const RANGOS = [
  { id: '800-1000', etiqueta: '800 – 1000' },
  { id: '1100-1300', etiqueta: '1100 – 1300' },
  { id: '1400-1700', etiqueta: '1400 – 1700' },
  { id: '1800-3500', etiqueta: '1800 o más' }
]
const ORDENES = [
  { id: 'relevancia', etiqueta: 'Relevancia' },
  { id: 'dificultad', etiqueta: 'Dificultad' },
  { id: 'resueltos', etiqueta: 'Resueltos' }
]

const formatear = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0') // 48250 → "48 250"
const letra = (codigo) => codigo.replace(/^\d+/, '') // "4A" → "A"
const rangoDe = (id) => {
  const m = /^(\d+)-(\d+)$/.exec(id)
  return m ? { min: Number(m[1]), max: Number(m[2]) } : { min: null, max: null }
}

/** Una sola pantalla con los estados: reposo · escribiendo · resultados · sin resultados. */
export function montarProblemas(vista, { query }) {
  // El estado vive en la URL (#/problemas?q=wa&dif=800-1000&tag=matematica&orden=resueltos)
  const estado = {
    q: (query.get('q') ?? '').trim().slice(0, 60),
    dif: RANGOS.some((r) => r.id === query.get('dif')) ? query.get('dif') : '',
    tag: query.get('tag') ?? '',
    orden: ORDENES.some((o) => o.id === query.get('orden')) ? query.get('orden') : 'relevancia'
  }

  vista.innerHTML = `
    <main class="problemas">
      <h1 class="problemas__titulo">Buscar problemas</h1>
      <p class="problemas__sub" id="sub"></p>

      <form id="formBuscar" role="search">
        <div class="field">
          <label class="field__label" for="q">Buscar</label>
          <div class="problemas__fila">
            <div class="autocompletar">
              <input class="input" id="q" type="search" autocomplete="off" maxlength="60"
                     placeholder="Busca por nombre o número" role="combobox" aria-expanded="false"
                     aria-controls="sug" aria-autocomplete="list" aria-describedby="ayudaQ">
              <div class="sugerencias" id="sug" hidden></div>
            </div>
            <button class="btn" type="submit">Buscar</button>
          </div>
          <p class="field__msg" id="ayudaQ">Usa el número del problema (por ejemplo 4A) o parte de su nombre.</p>
        </div>
      </form>

      <div class="filtros">
        <label class="filtros__item">
          <span class="field__label">Dificultad</span>
          <select class="select" id="selDif">
            <option value="">Todas</option>
            ${RANGOS.map((r) => `<option value="${r.id}">${r.etiqueta}</option>`).join('')}
          </select>
        </label>
        <label class="filtros__item">
          <span class="field__label">Etiqueta</span>
          <select class="select" id="selTag"><option value="">Todas</option></select>
        </label>
        <div class="filtros__item" role="group" aria-label="Ordenar por">
          <span class="field__label">Ordenar por</span>
          <div class="filtros__orden">
            ${ORDENES.map((o) => `<button class="chip-btn" type="button" data-orden="${o.id}" aria-pressed="false">${o.etiqueta}</button>`).join('')}
          </div>
        </div>
        <button class="link link--boton" id="nuevaBusqueda" type="button" hidden>Nueva búsqueda</button>
      </div>

      <section class="ruta" id="ruta" aria-labelledby="rutaTitulo">
        <div>
          <h2 class="ruta__titulo" id="rutaTitulo">¿Es tu primer problema?</h2>
          <p class="ruta__texto">Empieza por A. Sandía y sigue una ruta guiada.</p>
        </div>
        <button class="btn btn--sm" id="btnRuta" type="button">Empezar ruta</button>
      </section>

      <h2 class="problemas__subtitulo" id="tituloLista" aria-live="polite"></h2>
      <div id="resultado"></div>
    </main>`

  const main = vista.querySelector('main')
  const $ = (selector) => main.querySelector(selector)
  const input = $('#q')
  const selDif = $('#selDif')
  const selTag = $('#selTag')
  const resultado = $('#resultado')
  let etiquetas = []
  let peticion = 0 // ignora respuestas viejas si el usuario cambia de filtro rápido

  const hayActividad = () => Boolean(estado.q || estado.dif || estado.tag)

  function urlDe() {
    const p = new URLSearchParams()
    if (estado.q) p.set('q', estado.q)
    if (estado.dif) p.set('dif', estado.dif)
    if (estado.tag) p.set('tag', estado.tag)
    if (estado.orden !== 'relevancia') p.set('orden', estado.orden)
    const texto = p.toString()
    return '#/problemas' + (texto ? '?' + texto : '')
  }

  function pintarControles() {
    if (document.activeElement !== input) input.value = estado.q
    selDif.value = estado.dif
    selTag.value = estado.tag
    main
      .querySelectorAll('[data-orden]')
      .forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.orden === estado.orden)))
    $('#ruta').hidden = hayActividad()
    $('#nuevaBusqueda').hidden = !hayActividad()
    $('#sub').textContent = hayActividad()
      ? 'Ajusta los filtros y el orden para encontrar tu próximo reto.'
      : 'Encuentra tu próximo reto por nombre o número.'
  }

  // pushState no dispara el router: la pantalla se actualiza sola y "Atrás" sigue funcionando.
  function aplicar(cambios) {
    Object.assign(estado, cambios)
    history.pushState(null, '', urlDe())
    pintarControles()
    cargar()
  }

  function mostrarError(mensaje) {
    resultado.innerHTML = `
      <div class="banner banner--error" role="alert">
        <span class="banner__icon" aria-hidden="true">✕</span>
        <div class="banner__body">
          <span class="banner__title">No se pudieron cargar los problemas</span>
          <span>${escaparHtml(mensaje)}</span>
          <button class="banner__action" type="button" data-accion="reintentar">Reintentar</button>
        </div>
      </div>`
  }

  function mostrarVacio() {
    const hayFiltros = Boolean(estado.dif || estado.tag)
    const texto = !hayActividad()
      ? 'Aún no hay problemas en el catálogo.'
      : hayFiltros
        ? 'No hay problemas que coincidan con esta combinación de búsqueda, dificultad y etiqueta.'
        : `No encontramos problemas para «${escaparHtml(estado.q)}». Revisa el número o prueba con otra palabra.`
    resultado.innerHTML = `
      <div class="vacio">
        <h3 class="vacio__titulo">${hayFiltros ? 'Sin resultados. Quita un filtro' : 'Sin resultados'}</h3>
        <p>${texto}</p>
        ${
          hayActividad()
            ? `<div class="vacio__acciones">
                 ${hayFiltros ? '<button class="btn btn--sm" type="button" data-accion="quitar-filtros">Quitar filtros</button>' : ''}
                 <button class="btn btn--sm btn--ghost" type="button" data-accion="limpiar">Limpiar búsqueda</button>
               </div>`
            : ''
        }
      </div>`
  }

  function mostrarLista(datos) {
    resultado.innerHTML = `
      <div class="fichas__cab" aria-hidden="true">
        <span class="fichas__cab-prob">Problema</span><span>Dificultad</span><span>Etiqueta</span><span>Resueltos</span><span></span>
      </div>
      <ul class="fichas">
        ${datos
          .map(
            (p) => `
          <li class="ficha">
            <span class="ficha__codigo">${escaparHtml(p.code)}</span>
            <div class="ficha__main">
              <a class="ficha__enlace" href="#/problema/${encodeURIComponent(p.code)}">${escaparHtml(letra(p.code))}. ${escaparHtml(p.title)}</a>
              ${p.summary ? `<p class="ficha__resumen">${escaparHtml(p.summary)}</p>` : ''}
            </div>
            <span class="ficha__dato"><span class="sr">Dificultad: </span>${p.rating}</span>
            <span class="ficha__dato"><span class="sr">Etiquetas: </span>${p.tags.length ? escaparHtml(p.tags.join(', ')) : '—'}</span>
            <span class="ficha__dato"><span class="sr">Resueltos: </span>${formatear(p.solved_count)}</span>
            <span class="btn btn--sm ficha__abrir" aria-hidden="true">Abrir</span>
          </li>`
          )
          .join('')}
      </ul>`
  }

  async function cargar() {
    const id = ++peticion
    resultado.setAttribute('aria-busy', 'true')
    resultado.innerHTML = '<p class="field__msg">Cargando problemas…</p>'
    const { min, max } = rangoDe(estado.dif)
    const { data, error } = await listarProblemas({
      q: estado.q,
      difMin: min,
      difMax: max,
      tag: estado.tag || null,
      orden: estado.orden
    })
    if (id !== peticion) return
    resultado.removeAttribute('aria-busy')

    const titulo = $('#tituloLista')
    if (error) {
      titulo.textContent = hayActividad() ? 'Resultados' : 'Todos los problemas'
      return mostrarError(error.message)
    }
    titulo.textContent = hayActividad()
      ? `${data.length} ${data.length === 1 ? 'resultado' : 'resultados'}${estado.q ? ` para «${estado.q}»` : ''}`
      : 'Todos los problemas'
    if (!data.length) return mostrarVacio()
    mostrarLista(data)
  }

  // ---------- Eventos ----------
  const autocompletado = enlazarAutocompletado({
    input,
    panel: $('#sug'),
    alBuscar: (texto) => aplicar({ q: texto.trim() }),
    sugerirSiVacio: true
  })
  $('#formBuscar').addEventListener('submit', (event) => {
    event.preventDefault()
    autocompletado.cerrar()
    aplicar({ q: input.value.trim() })
  })
  selDif.addEventListener('change', () => aplicar({ dif: selDif.value }))
  selTag.addEventListener('change', () => aplicar({ tag: selTag.value }))
  $('#nuevaBusqueda').addEventListener('click', () => {
    input.value = ''
    aplicar({ q: '', dif: '', tag: '', orden: 'relevancia' })
    input.focus()
  })
  $('#btnRuta').addEventListener('click', () => navegar('problema/4A'))
  main.addEventListener('click', (event) => {
    const orden = event.target.closest('[data-orden]')
    if (orden) return aplicar({ orden: orden.dataset.orden })
    const accion = event.target.closest('[data-accion]')?.dataset.accion
    if (accion === 'reintentar') cargar()
    if (accion === 'quitar-filtros') aplicar({ dif: '', tag: '' })
    if (accion === 'limpiar') {
      input.value = ''
      aplicar({ q: '', dif: '', tag: '' })
    }
  })

  listarEtiquetas().then(({ data }) => {
    etiquetas = data ?? []
    selTag.innerHTML =
      '<option value="">Todas</option>' +
      etiquetas
        .map((t) => `<option value="${escaparHtml(t.slug)}">${escaparHtml(t.name)}</option>`)
        .join('')
    selTag.value = estado.tag
  })

  pintarControles()
  cargar()
}
