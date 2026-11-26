const PASOS = [
  {
    numero: 1,
    titulo: 'Ver enunciado',
    descripcion: 'Lee el objetivo, la entrada, la salida y los ejemplos del problema.',
    indicacion: 'Identifica qué solicita el problema.'
  },
  {
    numero: 2,
    titulo: 'Entender el problema',
    descripcion: 'Interpreta la información, las condiciones y el resultado esperado.',
    indicacion: 'Comprueba qué condiciones debe cumplir una respuesta válida.'
  },
  {
    numero: 3,
    titulo: 'Diseñar la solución',
    descripcion: 'Define la estrategia necesaria para resolver el problema.',
    indicacion: 'Organiza el procedimiento antes de escribir el código.'
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
          aria-label="Progreso de la ruta guiada"
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
        >Atrás</button>
        <button
          class="btn btn--sm"
          type="button"
          data-ruta-accion="siguiente"
          ${paso.numero === 3 ? 'disabled' : ''}
        >Siguiente paso</button>
      </div>
      <button
        class="ruta-guiada__salir"
        type="button"
        data-ruta-accion="salir"
      >Salir de la ruta</button>
    </section>
  `
}
