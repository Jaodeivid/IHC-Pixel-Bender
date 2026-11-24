import { obtenerProblema } from '../services/problemasService.js'
import { escaparHtml } from '../utils/escape.js'
import { crearRutaGuiada } from '../components/rutaGuiada.js'
import { obtenerSolucionesDemostracion } from '../data/solucionesDemostracion.js'

const TABS = [
  { id: '', etiqueta: 'Enunciado' },
  { id: 'solucion', etiqueta: 'Solución explicada' },
  { id: 'discusion', etiqueta: 'Discusión' }
]

const letra = (codigo) => codigo.replace(/^\d+/, '')

let transicionPendiente = null

export function montarProblema(vista, { params }) {
  const [codigoCrudo = '', seccionCruda = ''] = params
  const codigo = codigoCrudo.toUpperCase()
  const seccion = TABS.some((t) => t.id === seccionCruda) ? seccionCruda : ''
  const pasoTransicion =
    transicionPendiente?.codigo === codigo && transicionPendiente?.seccion === seccion
      ? transicionPendiente.paso
      : null

  transicionPendiente = null

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
    const soluciones = obtenerSolucionesDemostracion(data.code)
    const lenguajeInicial = 'python'
    const solucionInicial = soluciones?.[lenguajeInicial]
    let lenguajeSeleccionado = lenguajeInicial
    const esProblemaGuiado = data.code.toUpperCase() === '4A'
    const mostrarRuta = esProblemaGuiado && seccion !== 'discusion'

    let pasoActual = seccion === 'solucion' ? 3 : 1

    if (
      mostrarRuta &&
      pasoTransicion !== null &&
      ((seccion === '' && pasoTransicion <= 2) ||
        (seccion === 'solucion' && pasoTransicion >= 3 && pasoTransicion <= 5))
    ) {
      pasoActual = pasoTransicion
    }

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

    const contenidoDisenar = `
      <h1 class="problema__titulo">${titulo}</h1>
      <h2 class="problema__h2">Diseñar la solución</h2>
      <p class="problema__texto">
        Definimos la estrategia para resolver el problema antes de programar.
      </p>

      <section class="ejemplo" aria-label="Estrategia de solución">
        <h3 class="ejemplo__titulo">Estrategia</h3>
        <p class="ejemplo__exp">
          Verificar si el peso de la sandía puede dividirse en dos partes
          enteras, positivas y pares.
        </p>
      </section>

      <section class="ejemplo" aria-label="Condición de solución">
        <h3 class="ejemplo__titulo">Condición</h3>
        <p class="ejemplo__exp">
          La división es posible si el peso es mayor que 2 y es un número par.
        </p>
        <pre>w &gt; 2 y w % 2 == 0</pre>
      </section>

      <section class="ejemplo" aria-label="Resultado de solución">
        <h3 class="ejemplo__titulo">Resultado</h3>
        <p class="ejemplo__exp">
          Si se cumple la condición, la respuesta es YES.
          En caso contrario, la respuesta es NO.
        </p>
      </section>

      <section class="ejemplo" aria-label="Ejemplos de aplicación">
        <h3 class="ejemplo__titulo">Ejemplos de aplicación</h3>
        <div class="ejemplo__par">
          <div>
            <span class="ejemplo__et">w = 8</span>
            <pre>YES</pre>
          </div>
          <div>
            <span class="ejemplo__et">w = 2</span>
            <pre>NO</pre>
          </div>
        </div>
        <p class="ejemplo__exp">
          Con 8 kg es posible formar dos partes pares positivas.
          Con 2 kg no es posible.
        </p>
      </section>`

    const contenidoImplementar = `
        <h1 class="problema__titulo">${titulo}</h1>
        <h2 class="problema__h2">Implementar</h2>
        <p class="problema__texto">
          Ahora observaremos cómo se traduce la condición diseñada
          a una solución en el lenguaje de programación seleccionado.
        </p>

        <section class="ejemplo" aria-label="Código resuelto">
          <div class="codigo-resuelto__cabecera">
            <h3 class="ejemplo__titulo" id="tituloCodigoResuelto">
              Solución en ${solucionInicial?.nombre ?? 'Python 3'}
            </h3>
            <label class="codigo-resuelto__selector">
              <span>Lenguaje</span>
              <select id="lenguajeDemostracion">
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            </label>
          </div>
          <pre class="language-${solucionInicial?.prism ?? 'python'}"><code id="codigoDemostracion" class="language-${solucionInicial?.prism ?? 'python'}">${escaparHtml(solucionInicial?.codigo ?? '')}</code></pre>
          <p class="ejemplo__exp">
            Este código es únicamente de lectura.
            La solución ya está preparada como parte de la demostración.
          </p>
        </section>

      <section class="ejemplo" aria-label="Explicación del código">
        <h3 class="ejemplo__titulo">¿Cómo funciona?</h3>
        <p class="ejemplo__exp">
          Primero se lee el peso de la sandía.
          Después se comprueba que sea mayor que 2 y que sea par.
          Si ambas condiciones se cumplen, se muestra YES.
          En caso contrario, se muestra NO.
        </p>
      </section>

      <section class="ejemplo" aria-label="Prueba de ejemplo">
        <h3 class="ejemplo__titulo">Prueba de ejemplo</h3>
        <div class="ejemplo__par">
          <div>
            <span class="ejemplo__et">Entrada</span>
            <pre>8</pre>
          </div>
          <div>
            <span class="ejemplo__et">Salida</span>
            <pre>YES</pre>
          </div>
        </div>
        <p class="ejemplo__exp">
          Como 8 es par y mayor que 2, la respuesta es YES.
        </p>
      </section>

      <p class="problema__texto">
        La solución está preparada. Pulsa «Enviar al juez» en la ruta
        guiada para observar la evaluación simulada y su veredicto.
      </p>`

    const crearContenidoVeredicto = () => {
      const solucion = soluciones?.[lenguajeSeleccionado] ?? solucionInicial
      const nombreLenguaje = escaparHtml(solucion?.nombre ?? 'Python 3')

      return `
        <h1 class="problema__titulo">${titulo}</h1>
        <h2 class="problema__h2">Veredicto del juez</h2>

        <p class="problema__texto">
          La solución preparada fue enviada a un juez simulado.
          A continuación puedes observar el resultado de la evaluación.
        </p>

        <section class="ejemplo veredicto-aceptado" aria-label="Resultado de la evaluación">
          <div class="veredicto-aceptado__contenido">
            <svg
              class="veredicto-aceptado__icono"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m8 12 3 3 5-6"></path>
            </svg>

            <div>
              <h3 class="veredicto-aceptado__titulo">Aceptado</h3>
              <p class="ejemplo__exp">
                La solución superó todas las pruebas de la demostración.
              </p>
            </div>
          </div>
        </section>

        <section class="ejemplo" aria-label="Detalles del envío simulado">
          <h3 class="ejemplo__titulo">Detalles del envío</h3>
          <dl class="lateral__datos">
            <div>
              <dt>Número de envío</dt>
              <dd>#1042</dd>
            </div>
            <div>
              <dt>Problema</dt>
              <dd>${titulo}</dd>
            </div>
            <div>
              <dt>Lenguaje</dt>
              <dd>${nombreLenguaje}</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>Aceptado</dd>
            </div>
            <div>
              <dt>Tiempo</dt>
              <dd>46 ms</dd>
            </div>
            <div>
              <dt>Memoria</dt>
              <dd>4 KB</dd>
            </div>
          </dl>
        </section>

        <section class="ejemplo" aria-label="Resultados de las pruebas simuladas">
          <h3 class="ejemplo__titulo">Resultados de las pruebas</h3>

          <div class="resultados-pruebas__contenedor" role="region" aria-label="Tabla de resultados de las pruebas" tabindex="0">
            <table class="resultados-pruebas__tabla">
              <thead>
                <tr>
                  <th scope="col">Prueba</th>
                  <th scope="col">Entrada</th>
                  <th scope="col">Esperada</th>
                  <th scope="col">Obtenida</th>
                  <th scope="col">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Ejemplo</th>
                  <td><code>8</code></td>
                  <td><code>YES</code></td>
                  <td><code>YES</code></td>
                  <td>
                    <span class="resultados-pruebas__estado">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m8 12 3 3 5-6"></path>
                      </svg>
                      Aceptado
                    </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Caso límite</th>
                  <td><code>2</code></td>
                  <td><code>NO</code></td>
                  <td><code>NO</code></td>
                  <td>
                    <span class="resultados-pruebas__estado">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m8 12 3 3 5-6"></path>
                      </svg>
                      Aceptado
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p class="resultados-pruebas__nota">
            Esta evaluación es una simulación educativa.
            No se ejecutó código ni se realizó un envío real.
          </p>
        </section>
      `
    }

    const contenidoSolucion = esProblemaGuiado
      ? pasoActual === 5
        ? crearContenidoVeredicto()
        : pasoActual === 4
          ? contenidoImplementar
          : contenidoDisenar
      : `
        <h1 class="problema__titulo">Solución explicada</h1>
        ${proximamente('La demostración de la solución estará disponible próximamente.')}`
    const contenido = {
      '': esProblemaGuiado && pasoActual === 2 ? contenidoEntender : contenidoEnunciado,
      solucion: contenidoSolucion,
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

            <p class="lateral__nota">
              El envío real de soluciones no está disponible.
              Puedes observar una simulación mediante la ruta guiada.
            </p>
            <a class="btn btn--sm btn--ghost" href="#/problemas">Volver a problemas</a>
          </aside>

          ${mostrarRuta ? crearRutaGuiada(pasoActual) : ''}
        </div>
      </div>`

    const configurarSelectorLenguaje = () => {
      const selector = main.querySelector('#lenguajeDemostracion')
      if (!selector || !soluciones) return

      selector.addEventListener('change', () => {
        const solucion = soluciones[selector.value]
        if (!solucion) return
        lenguajeSeleccionado = selector.value

        const tituloCodigo = main.querySelector('#tituloCodigoResuelto')
        const bloque = main.querySelector('#codigoDemostracion')
        const pre = bloque?.closest('pre')

        if (!tituloCodigo || !bloque || !pre) return

        tituloCodigo.textContent = `Solución en ${solucion.nombre}`
        pre.className = `language-${solucion.prism}`
        bloque.className = `language-${solucion.prism}`
        bloque.textContent = solucion.codigo

        window.Prism?.highlightElement(bloque)
      })
    }

    if (mostrarRuta && pasoActual === 4) {
      window.Prism?.highlightAllUnder(main)
      configurarSelectorLenguaje()
    }

    if (!mostrarRuta) return

    const actualizarPaso = (nuevoPaso) => {
      if (nuevoPaso < 1 || nuevoPaso > 5 || !main.isConnected) return

      const nuevaSeccion = nuevoPaso >= 3 ? 'solucion' : ''

      if (nuevaSeccion !== seccion) {
        transicionPendiente = {
          codigo,
          seccion: nuevaSeccion,
          paso: nuevoPaso
        }

        window.location.hash = `${base}${nuevaSeccion ? '/' + nuevaSeccion : ''}`
        return
      }

      pasoActual = nuevoPaso

      const articulo = main.querySelector('.problema__contenido')

      if (seccion === '') {
        articulo.innerHTML = pasoActual === 1 ? contenidoEnunciado : contenidoEntender
      } else if (seccion === 'solucion') {
        articulo.innerHTML =
          pasoActual === 3
            ? contenidoDisenar
            : pasoActual === 4
              ? contenidoImplementar
              : crearContenidoVeredicto()

        if (pasoActual === 4) {
          const selector = articulo.querySelector('#lenguajeDemostracion')

          if (selector) {
            selector.value = lenguajeSeleccionado
          }

          const solucion = soluciones?.[lenguajeSeleccionado]
          const tituloCodigo = articulo.querySelector('#tituloCodigoResuelto')
          const bloque = articulo.querySelector('#codigoDemostracion')
          const pre = bloque?.closest('pre')

          if (solucion && tituloCodigo && bloque && pre) {
            tituloCodigo.textContent = `Solución en ${solucion.nombre}`
            pre.className = `language-${solucion.prism}`
            bloque.className = `language-${solucion.prism}`
            bloque.textContent = solucion.codigo
          }

          window.Prism?.highlightAllUnder(articulo)
          configurarSelectorLenguaje()
        }
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
        return
      }

      if (accion === 'siguiente' && pasoActual < 4) {
        actualizarPaso(pasoActual + 1)
        return
      }

      if (accion === 'enviar' && pasoActual === 4) {
        actualizarPaso(5)
        return
      }

      if (accion === 'finalizar' || accion === 'salir') {
        transicionPendiente = null
        window.location.hash = '#/problemas'
      }
    })
  })
}
