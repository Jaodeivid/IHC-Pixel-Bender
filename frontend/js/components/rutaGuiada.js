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
    indicacion: 'Prepara el algoritmo antes de observar su implementación.'
  },
  {
    numero: 4,
    titulo: 'Implementar',
    descripcion: 'Observa cómo se traduce la condición a código Python.',
    indicacion: 'Revisa el código resuelto y su prueba de ejemplo.'
  },
  {
    numero: 5,
    titulo: 'Enviar al juez',
    descripcion: 'Revisa la solución preparada para su envío.',
    indicacion: 'El envío y el veredicto se implementarán posteriormente.'
  }
]

export function crearRutaGuiada(numeroPaso = 1) {
  const paso = PASOS.find((elemento) => elemento.numero === numeroPaso) ?? PASOS[0]
  const porcentaje = (paso.numero / PASOS.length) * 100

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
          data-ruta-accion="siguiente"
          ${paso.numero >= 2 ? 'disabled' : ''}
        >
          Siguiente paso
        </button>
      </div>

      <button
        class="ruta-guiada__salir"
        type="button"
        data-ruta-accion="salir"
      >
        Salir de la ruta
      </button>
    </section>
  `
}
