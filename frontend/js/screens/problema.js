import { obtenerProblema } from '../services/problemasService.js'
import { escaparHtml } from '../utils/escape.js'
import { crearRutaGuiada } from '../components/rutaGuiada.js'

const TABS = [
  { id: '', etiqueta: 'Enunciado' },
  { id: 'solucion', etiqueta: 'Solución explicada' },
  { id: 'discusion', etiqueta: 'Discusión' }
]

const letra = (codigo) => codigo.replace(/^\d+/, '')

export function montarProblema(vista, { params }) {
  const [codigoCrudo = '', seccionCruda = ''] = params
  const codigo = codigoCrudo.toUpperCase()
  const seccion = TABS.some((t) => t.id === seccionCruda) ? seccionCruda : ''

  vista.innerHTML = `<main class="problema"><p class="field__msg">Cargando problema…</p></main>`
  const main = vista.querySelector('main')

  const noEncontrado = (mensaje) => {
    main.innerHTML = `
      <div class="banner banner--warning" role="alert">
        <span class="banner__icon" aria-hidden="true">!</span>
        <div class="banner__body">
          <span class="banner__title">${mensaje.titulo}</span>
          <span>${mensaje.texto}</span>
        </div>
      </div>
      <p><a class="btn btn--sm" href="#/problemas">Ver todos los problemas</a></p>`
  }

  obtenerProblema(codigo).then(({ data, error }) => {
    if (!main.isConnected) return

    if (error) {
      return noEncontrado({
        titulo: 'No pudimos cargar el problema',
        texto: 'Revisa tu conexión e inténtalo de nuevo.'
      })
    }

    if (!data) {
      return noEncontrado({
        titulo: 'Ese problema no existe',
        texto: `No encontramos «${escaparHtml(codigoCrudo)}». Búscalo en el catálogo.`
      })
    }

    document.title = `${data.code} · ${data.title} | Codeforces`

    const base = `#/problema/${encodeURIComponent(data.code)}`
    const etiquetas = (data.problem_tags ?? []).map((pt) => pt.tags).filter(Boolean)
    const ejemplos = [...(data.problem_examples ?? [])].sort((a, b) => a.position - b.position)
    const titulo = `${escaparHtml(letra(data.code))}. ${escaparHtml(data.title)}`
    const esProblemaGuiado = data.code.toUpperCase() === '4A'
    const mostrarRuta = esProblemaGuiado && seccion !== 'discusion'
    let pasoActual = 1

    const proximamente = (texto) => `
      <div class="banner banner--warning">
        <span class="banner__icon" aria-hidden="true">!</span>
        <div class="banner__body">
          <span class="banner__title">Próximamente</span>
          <span>${texto}</span>
        </div>
      </div>`

    const contenidoEnunciado = `
      <h1 class="problema__titulo">${titulo}</h1>
      ${data.summary ? `<p class="problema__resumen">${escaparHtml(data.summary)}</p>` : ''}
      <h2 class="problema__h2">Enunciado</h2>
      <p class="problema__texto">${escaparHtml(data.statement)}</p>
      ${ejemplos
        .map(
          (e, i) => `
            <section class="ejemplo" aria-label="Ejemplo ${i + 1}">
              <h3 class="ejemplo__titulo">Ejemplo ${i + 1}</h3>
              <div class="ejemplo__par">
                <div>
                  <span class="ejemplo__et">Entrada</span>
                  <pre>${escaparHtml(e.input)}</pre>
                </div>
                <div>
                  <span class="ejemplo__et">Salida</span>
                  <pre>${escaparHtml(e.output)}</pre>
                </div>
              </div>
              ${e.explanation ? `<p class="ejemplo__exp">${escaparHtml(e.explanation)}</p>` : ''}
            </section>`
        )
        .join('')}`

    const contenidoEntender = `
      <h1 class="problema__titulo">${titulo}</h1>
      <h2 class="problema__h2">Entender el problema</h2>
      <p class="problema__texto">
        Pete y Billy necesitan dividir una sandía en dos partes.
        Ambas deben pesar un número par de kilos y tener un peso mayor que cero.
      </p>

      <section class="ejemplo" aria-label="Ejemplo de división válida">
        <h3 class="ejemplo__titulo">¿Por qué 8 funciona?</h3>
        <div class="ejemplo__par">
          <div>
            <span class="ejemplo__et">Peso total</span>
            <pre>8 kg</pre>
          </div>
          <div>
            <span class="ejemplo__et">División posible</span>
            <pre>2 + 6</pre>
          </div>
        </div>
        <p class="ejemplo__exp">
          Las dos partes son pares y positivas. Por eso la respuesta es YES.
        </p>
      </section>

      <section class="ejemplo" aria-label="Ejemplo de división inválida">
        <h3 class="ejemplo__titulo">¿Por qué 2 no funciona?</h3>
        <div class="ejemplo__par">
          <div>
            <span class="ejemplo__et">Peso total</span>
            <pre>2 kg</pre>
          </div>
          <div>
            <span class="ejemplo__et">Resultado</span>
            <pre>NO</pre>
          </div>
        </div>
        <p class="ejemplo__exp">
          No es posible obtener dos partes pares y positivas a partir de 2 kg.
        </p>
      </section>

      <h2 class="problema__h2">La condición</h2>
      <p class="problema__texto">
        El peso debe ser par y mayor que 2.
        Si el peso es 1, 2 o 3, la respuesta es NO.
      </p>
      <p class="problema__texto">
        Antes de implementar, identifica esta condición y decide cuándo
        corresponde mostrar YES o NO.
      </p>`

    const contenido = {
      '': contenidoEnunciado,
      solucion: `
        <h1 class="problema__titulo">Solución explicada</h1>
        ${proximamente('La demostración de la solución estará disponible en los siguientes pasos.')}`,
      discusion: `
        <h1 class="problema__titulo">Discusión</h1>
        ${proximamente('Aquí podrás comentar el problema con otros usuarios.')}`
    }[seccion]

    main.innerHTML = `
      <nav class="migas" aria-label="Ruta de navegación">
        <a href="#/problemas">Problemas</a>
        <span aria-hidden="true">/</span>
        <a href="${base}">${escaparHtml(data.code)}</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">${escaparHtml(data.title)}</span>
      </nav>

      <nav class="tabs" aria-label="Secciones del problema">
        ${TABS.map(
          (t) => `
            <a
              class="tabs__tab"
              href="${base}${t.id ? '/' + t.id : ''}"
              ${t.id === seccion ? 'aria-current="page"' : ''}
            >${t.etiqueta}</a>`
        ).join('')}
      </nav>

      <div class="problema__layout">
        <article class="problema__contenido">
          ${contenido}
        </article>

        <div class="problema__laterales">
          <aside class="lateral" aria-label="Datos del problema">
            <h2 class="lateral__titulo">Datos del problema</h2>

            <dl class="lateral__datos">
              <div>
                <dt>Dificultad</dt>
                <dd>${data.rating}</dd>
              </div>
              <div>
                <dt>Tiempo límite</dt>
                <dd>${data.time_limit_ms / 1000} s</dd>
              </div>
              <div>
                <dt>Memoria</dt>
                <dd>${data.memory_limit_mb} MB</dd>
              </div>
              <div>
                <dt>Etiquetas</dt>
                <dd>${
                  etiquetas.length
                    ? etiquetas
                        .map(
                          (t) =>
                            `<a class="etiqueta" href="#/problemas?tag=${encodeURIComponent(t.slug)}">${escaparHtml(t.name)}</a>`
                        )
                        .join(' ')
                    : '—'
                }</dd>
              </div>
            </dl>

            <p class="lateral__nota">Enviar soluciones estará disponible pronto.</p>
            <a class="btn btn--sm btn--ghost" href="#/problemas">Volver a problemas</a>
          </aside>

          ${mostrarRuta ? crearRutaGuiada(pasoActual) : ''}
        </div>
      </div>`

    if (!mostrarRuta) return

    const actualizarPaso = (nuevoPaso) => {
      if (nuevoPaso < 1 || nuevoPaso > 2 || !main.isConnected) return

      pasoActual = nuevoPaso

      if (seccion === '') {
        const articulo = main.querySelector('.problema__contenido')
        articulo.innerHTML = pasoActual === 1 ? contenidoEnunciado : contenidoEntender
      }

      const panelAnterior = main.querySelector('.ruta-guiada')
      if (panelAnterior) {
        panelAnterior.outerHTML = crearRutaGuiada(pasoActual)
      }
    }

    main.addEventListener('click', (evento) => {
      const boton = evento.target.closest('[data-ruta-accion]')
      if (!boton || !main.contains(boton) || boton.disabled) return

      const accion = boton.dataset.rutaAccion

      if (accion === 'anterior') {
        actualizarPaso(pasoActual - 1)
      }

      if (accion === 'siguiente') {
        actualizarPaso(pasoActual + 1)
      }

      if (accion === 'salir') {
        window.location.hash = '#/problemas'
      }
    })
  })
}
