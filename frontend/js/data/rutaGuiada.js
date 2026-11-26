
const GUIAS = {
  '4A': {
    entender: {
      introduccion: 'Se debe dividir el peso de la sandía en dos partes enteras, positivas y pares.',
      puntos: [
        'Las dos partes deben tener un peso mayor que cero.',
        'Ambas partes deben ser números pares.',
        'La suma de las dos partes debe ser igual al peso original.'
      ],
      ejemplo: 'Para 8 kg se puede realizar la división 2 + 6. Para 2 kg no existe una división válida.'
    },
    disenar: {
      estrategia: 'Comprobar si el peso total es par y mayor que dos.',
      condicion: 'w > 2 y w % 2 == 0',
      resultado: 'Si se cumplen ambas condiciones, mostrar YES. En caso contrario, mostrar NO.'
    }
  },
  '71A': {
    entender: {
      introduccion: 'Se deben abreviar las palabras cuya longitud sea estrictamente mayor que diez caracteres.',
      puntos: [
        'Las palabras de diez caracteres o menos permanecen sin cambios.',
        'Las palabras más largas se representan con su primera letra, la cantidad de letras intermedias y su última letra.',
        'Cada palabra se procesa de manera independiente.'
      ],
      ejemplo: 'La palabra localization tiene 12 caracteres. Su abreviatura es l10n.'
    },
    disenar: {
      estrategia: 'Recorrer cada palabra y comprobar su longitud.',
      condicion: 'Si longitud > 10, construir primera letra + (longitud - 2) + última letra.',
      resultado: 'Imprimir la abreviatura cuando corresponda o la palabra original cuando no supere diez caracteres.'
    }
  },
  '231A': {
    entender: {
      introduccion: 'Tres amigos deciden resolver un problema únicamente cuando al menos dos de ellos saben cómo solucionarlo.',
      puntos: [
        'Cada problema tiene tres respuestas, una por cada amigo.',
        'Una respuesta afirmativa indica que el amigo conoce la solución.',
        'Se cuenta un problema cuando dos o tres respuestas son afirmativas.'
      ],
      ejemplo: 'Si las respuestas son 1, 1 y 0, el problema se resuelve porque dos amigos conocen la solución.'
    },
    disenar: {
      estrategia: 'Recorrer todos los problemas y sumar las respuestas afirmativas de cada grupo.',
      condicion: 'La suma de las tres respuestas debe ser mayor o igual a 2.',
      resultado: 'Contar cuántos problemas cumplen la condición e imprimir ese total.'
    }
  },
  '158A': {
    entender: {
      introduccion: 'Se determina cuántos participantes avanzan a la siguiente ronda según su puntuación.',
      puntos: [
        'Se utiliza la puntuación del participante ubicado en la posición k.',
        'Avanzan quienes tienen una puntuación igual o superior a esa referencia.',
        'La puntuación debe ser estrictamente mayor que cero.'
      ],
      ejemplo: 'Si la puntuación de referencia es 5, avanzan los participantes con puntuación de 5 o superior, siempre que sea positiva.'
    },
    disenar: {
      estrategia: 'Obtener la puntuación ubicada en la posición k y recorrer las puntuaciones.',
      condicion: 'puntuacion >= puntuacion_k y puntuacion > 0.',
      resultado: 'Contar los participantes que cumplen ambas condiciones.'
    }
  },
  '266A': {
    entender: {
      introduccion: 'Se busca determinar cuántas piedras deben retirarse para que no existan dos piedras consecutivas del mismo color.',
      puntos: [
        'Las piedras están representadas mediante una cadena de caracteres.',
        'Se comparan únicamente piedras que están una junto a otra.',
        'Cuando dos colores consecutivos son iguales, una de esas piedras debe retirarse.'
      ],
      ejemplo: 'En la secuencia RRB, se debe retirar una piedra para obtener RB.'
    },
    disenar: {
      estrategia: 'Recorrer la cadena comparando cada carácter con el anterior.',
      condicion: 'Si el color actual es igual al color anterior, se incrementa el contador de eliminaciones.',
      resultado: 'Imprimir la cantidad de pares consecutivos iguales encontrados.'
    }
  },
  '50A': {
    entender: {
      introduccion: 'Se desea colocar la mayor cantidad posible de fichas de dominó de tamaño 2 × 1 en un tablero de m × n.',
      puntos: [
        'Cada ficha ocupa exactamente dos casillas.',
        'Las fichas no pueden superponerse.',
        'Todas las fichas deben colocarse dentro del tablero.'
      ],
      ejemplo: 'En un tablero de 2 × 3 se pueden colocar tres fichas de dominó.'
    },
    disenar: {
      estrategia: 'Dividir el área total del tablero entre dos, considerando que cada ficha ocupa dos casillas.',
      condicion: 'La cantidad máxima de fichas es la parte entera de (m × n) / 2.',
      resultado: 'Imprimir floor(m × n / 2).'
    }
  },
  '112A': {
    entender: {
      introduccion: 'Se comparan dos cadenas de texto sin distinguir entre letras mayúsculas y minúsculas.',
      puntos: [
        'Ambas cadenas tienen la misma longitud.',
        'La comparación no distingue mayúsculas de minúsculas.',
        'Se utiliza el orden lexicográfico para determinar cuál cadena es menor.'
      ],
      ejemplo: 'La comparación entre abc y AbC da como resultado 0 porque ambas cadenas son equivalentes ignorando las mayúsculas.'
    },
    disenar: {
      estrategia: 'Convertir ambas cadenas a minúsculas y compararlas lexicográficamente.',
      condicion: 'Si la primera cadena es menor, devolver -1; si es mayor, devolver 1; si son iguales, devolver 0.',
      resultado: 'Imprimir -1, 0 o 1 según el resultado de la comparación.'
    }
  },
  '339B': {
    entender: {
      introduccion: 'Se calcula el tiempo necesario para completar una lista de tareas distribuidas en las casas de una calle circular.',
      puntos: [
        'El recorrido comienza en la casa número 1.',
        'Las casas se visitan en orden horario.',
        'Si la siguiente casa tiene un número menor, se debe completar la vuelta hasta llegar a ella.',
        'Una tarea puede encontrarse en la casa donde se está actualmente.'
      ],
      ejemplo: 'Con 4 casas, pasar de la casa 3 a la casa 1 requiere avanzar 2 posiciones: 3 → 4 → 1.'
    },
    disenar: {
      estrategia: 'Recorrer las tareas en el orden indicado y acumular la distancia desde la posición actual.',
      condicion: 'Si la siguiente casa es mayor o igual que la actual, sumar siguiente - actual. En caso contrario, sumar n - actual + siguiente.',
      resultado: 'Imprimir la suma de todos los desplazamientos.'
    }
  }
}

export const PASOS_RUTA = [
  {
    numero: 1,
    titulo: 'Ver enunciado',
    descripcion: 'Lee el objetivo, la entrada, la salida y el ejemplo del problema.',
    seccion: ''
  },
  {
    numero: 2,
    titulo: 'Entender el problema',
    descripcion: 'Comprueba qué solicita el problema y reconoce sus condiciones.',
    seccion: ''
  },
  {
    numero: 3,
    titulo: 'Diseñar la solución',
    descripcion: 'Define la estrategia y la condición que resuelve el problema.',
    seccion: 'solucion'
  }
]

export function renderizarRutaGuiada(data, paso, escaparHtml) {
  const codigo = data.code.toUpperCase()
  const guia = GUIAS[codigo]
  const ejemplos = [...(data.problem_examples ?? [])].sort(
    (a, b) => a.position - b.position
  )

  if (paso === 1) {
    return `
      <h2 class="problema__h2">Enunciado</h2>
      <p class="problema__texto">${escaparHtml(data.statement)}</p>
      ${ejemplos.map((e, i) => `
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
        </section>
      `).join('')}`
  }

  if (!guia) {
    return `
      <h2 class="problema__h2">${paso === 2 ? 'Entender el problema' : 'Diseñar la solución'}</h2>
      <p class="problema__texto">${escaparHtml(data.statement)}</p>`
  }

  const contenido = paso === 2 ? guia.entender : guia.disenar

  if (paso === 2) {
    return `
      <h1 class="problema__titulo">${escaparHtml(data.title)}</h1>
      <h2 class="problema__h2">Entender el problema</h2>
      <p class="problema__texto">${escaparHtml(contenido.introduccion)}</p>
      <section class="ejemplo">
        <h3 class="ejemplo__titulo">Condiciones del problema</h3>
        <ul>
          ${contenido.puntos.map(p => `<li>${escaparHtml(p)}</li>`).join('')}
        </ul>
      </section>
      <section class="ejemplo">
        <h3 class="ejemplo__titulo">Ejemplo de interpretación</h3>
        <p class="ejemplo__exp">${escaparHtml(contenido.ejemplo)}</p>
      </section>`
  }

  return `
    <h1 class="problema__titulo">${escaparHtml(data.title)}</h1>
    <h2 class="problema__h2">Diseñar la solución</h2>
    <section class="ejemplo">
      <h3 class="ejemplo__titulo">Estrategia</h3>
      <p class="ejemplo__exp">${escaparHtml(contenido.estrategia)}</p>
    </section>
    <section class="ejemplo">
      <h3 class="ejemplo__titulo">Condición</h3>
      <p class="ejemplo__exp">${escaparHtml(contenido.condicion)}</p>
    </section>
    <section class="ejemplo">
      <h3 class="ejemplo__titulo">Resultado</h3>
      <p class="ejemplo__exp">${escaparHtml(contenido.resultado)}</p>
    </section>`
}
