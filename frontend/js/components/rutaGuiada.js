const PASOS = [
  {
    numero: 1,
    titulo: 'Ver enunciado',
    descripcion: 'Lee el objetivo, la entrada, la salida y el ejemplo del problema.',
    indicacion: 'Al terminar, podrás explicar qué pide el problema.'
  },
  {
    numero: 2,
    titulo: 'Entender el problema',
    descripcion: 'Comprueba por qué 8 funciona y por qué 2 no se puede dividir.',
    indicacion: 'Después, identifica la condición que debe cumplir el peso.'
  },
  {
    numero: 3,
    titulo: 'Diseñar la solución',
    descripcion: 'Define la estrategia y la condición que resuelve el problema.',
    indicacion: 'Observa cómo aplicar la condición antes de implementar.'
  },
  {
    numero: 4,
    titulo: 'Implementar',
    descripcion: 'Observa cómo se traduce la condición al lenguaje seleccionado.',
    indicacion: 'Revisa el código resuelto antes de simular su envío al juez.'
  },
  {
    numero: 5,
    titulo: 'Enviar al juez',
    descripcion:
      'El envío simulado ha sido evaluado. Revisa el veredicto y los resultados de las pruebas.',
    indicacion: 'Has completado los cinco pasos de la demostración.'
  }
]

export function crearRutaGuiada(numeroPaso = 1) {
  const paso = PASOS.find((elemento) => elemento.numero === numeroPaso) ?? PASOS[0]
  const porcentaje = (paso.numero / PASOS.length) * 100

  const textoAccion =
    paso.numero === 4 ? 'Enviar al juez' : paso.numero === 5 ? 'Finalizar ruta' : 'Siguiente paso'

  const accion = paso.numero === 4 ? 'enviar' : paso.numero === 5 ? 'finalizar' : 'siguiente'

  return `
    <section class="ruta-guiada" aria-label="Ruta de tu primer problema">
      <h2 class="lateral__titulo">Ruta de tu primer problema</h2>

      <div class="ruta-guiada__progreso">
        <span>Paso ${paso.numero} de ${PASOS.length}</span>
        <div
          class="ruta-guiada__barra"
          role="progressbar"
          aria-label="Progreso de la demostración"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="${porcentaje}"
        >
          <div class="ruta-guiada__avance" style="width: ${porcentaje}%"></div>
        </div>
      </div>

      <div class="ruta-guiada__informacion">
        <h3 class="ruta-guiada__titulo">${paso.titulo}</h3>
        <p>${paso.descripcion}</p>
      </div>

      <p class="ruta-guiada__indicacion">${paso.indicacion}</p>

      <div class="ruta-guiada__acciones">
        <button
          class="btn btn--sm btn--ghost"
          type="button"
          data-ruta-accion="anterior"
          ${paso.numero === 1 ? 'disabled' : ''}
        >
          Atrás
        </button>
        <button
          class="btn btn--sm"
          type="button"
          data-ruta-accion="${accion}"
        >
          ${textoAccion}
        </button>
      </div>

      ${
        paso.numero < 5
          ? `
            <button
                class="ruta-guiada__salir"
                type="button"
                data-ruta-accion="salir"
            >
                Salir de la ruta
            </button>
            `
          : ''
      }
    </section>
  `
}
