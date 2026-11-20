import { listarProblemas } from '../services/problemasService.js'
import { escaparHtml } from '../utils/escape.js'

const letra = (codigo) => codigo.replace(/^\d+/, '') // "4A" → "A"

/**
 * Desplegable de hasta 4 sugerencias bajo un campo de búsqueda (patrón ARIA "combobox").
 * - input: el <input>; panel: un <div id="..." hidden> donde se dibujan las sugerencias.
 * - alBuscar(texto): se llama al pulsar "Ver todos los resultados".
 * - sugerirSiVacio: muestra "Sugerencias para empezar" al enfocar el campo vacío.
 */
export function enlazarAutocompletado({ input, panel, alBuscar, sugerirSiVacio = false }) {
  let peticion = 0
  let temporizador
  let activo = -1

  const opciones = () => [...panel.querySelectorAll('[role="option"]')]

  function cerrar() {
    panel.hidden = true
    activo = -1
    input.setAttribute('aria-expanded', 'false')
    input.removeAttribute('aria-activedescendant')
  }

  function marcar(indice) {
    const lista = opciones()
    lista.forEach((opcion, n) => opcion.setAttribute('aria-selected', String(n === indice)))
    activo = indice
    if (lista[indice]) input.setAttribute('aria-activedescendant', lista[indice].id)
    else input.removeAttribute('aria-activedescendant')
  }

  function pintar(datos) {
    const texto = input.value.trim()
    activo = -1
    input.removeAttribute('aria-activedescendant')

    if (!datos.length) {
      panel.innerHTML = `<p class="sugerencias__vacio">No hay sugerencias para «${escaparHtml(texto)}». Pulsa Buscar para intentarlo con filtros.</p>`
    } else {
      const titulo = texto
        ? `Autocompletado · ${datos.length} ${datos.length === 1 ? 'sugerencia' : 'sugerencias'}`
        : 'Sugerencias para empezar'
      panel.innerHTML = `
        <p class="sugerencias__cab">${titulo}</p>
        <ul class="sugerencias__lista" role="listbox" aria-label="Sugerencias">
          ${datos
            .map(
              (p, i) => `
            <li role="option" id="${panel.id}-op${i}" aria-selected="false">
              <a href="#/problema/${encodeURIComponent(p.code)}">
                <span class="sugerencias__cod">${escaparHtml(p.code)}</span>
                <span class="sugerencias__tit">${escaparHtml(letra(p.code))}. ${escaparHtml(p.title)}</span>
                <span class="sugerencias__dif">${p.rating}</span>
              </a>
            </li>`
            )
            .join('')}
        </ul>
        ${
          texto
            ? `<div class="sugerencias__pie">
                 <span>Pulsa Buscar para ver resultados con filtros.</span>
                 <button class="btn btn--sm btn--ghost" type="button" data-todos>Ver todos los resultados</button>
               </div>`
            : ''
        }`
    }
    panel.hidden = false
    input.setAttribute('aria-expanded', 'true')
  }

  async function consultar() {
    const id = ++peticion
    const { data, error } = await listarProblemas({ q: input.value.trim(), limite: 4 })
    if (id !== peticion || error) return // respuesta vieja o fallo: no molestamos al usuario
    pintar(data)
  }

  input.addEventListener('input', () => {
    clearTimeout(temporizador)
    if (!input.value.trim() && !sugerirSiVacio) {
      peticion++
      return cerrar()
    }
    temporizador = setTimeout(consultar, 200)
  })
  input.addEventListener('focus', () => {
    if (sugerirSiVacio && !input.value.trim()) consultar()
  })
  input.addEventListener('keydown', (event) => {
    const total = opciones().length
    if (event.key === 'Escape') return cerrar()
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (panel.hidden || !total) return consultar()
      event.preventDefault()
      const paso = event.key === 'ArrowDown' ? 1 : -1
      marcar((activo + paso + total) % total)
    }
    if (event.key === 'Enter' && activo >= 0) {
      event.preventDefault() // abre la sugerencia marcada en vez de enviar el formulario
      opciones()[activo].querySelector('a').click()
    }
  })
  input.addEventListener('blur', () => setTimeout(cerrar, 150))

  // Que hacer clic en el panel no le quite el foco al campo
  panel.addEventListener('mousedown', (event) => event.preventDefault())
  panel.addEventListener('click', (event) => {
    if (event.target.closest('[data-todos]')) alBuscar?.(input.value)
    cerrar()
  })

  return { cerrar }
}
