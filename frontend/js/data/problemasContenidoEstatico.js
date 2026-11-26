
const CONTENIDO = {
  '4A': {
    input: 'Un único entero w (1 ≤ w ≤ 100), que representa el peso de la sandía.',
    output: 'Imprime YES si es posible dividir la sandía en dos partes enteras, positivas y pares. En caso contrario, imprime NO.',
    examples: [
      { input: '8', output: 'YES', explanation: '8 puede dividirse en 2 + 6; ambas partes son pares y positivas.' },
      { input: '2', output: 'NO', explanation: 'No existen dos enteros positivos pares cuya suma sea 2.' }
    ],
    entender: {
      introduccion: 'Se busca determinar si el peso total puede separarse en dos cantidades enteras, positivas y pares.',
      puntos: [
        'Las dos partes deben ser mayores que cero.',
        'Las dos partes deben ser números pares.',
        'La suma de ambas partes debe ser exactamente w.'
      ],
      ejemplo: 'Con w = 8 se puede usar 2 + 6. Con w = 2 no existe una división válida.'
    },
    disenar: {
      estrategia: 'Comprobar si el peso total es par y mayor que dos.',
      condicion: 'w > 2 y w % 2 == 0',
      resultado: 'Si ambas condiciones se cumplen, imprimir YES; de lo contrario, imprimir NO.'
    }
  },
  '71A': {
    input: 'La primera línea contiene un entero n (1 ≤ n ≤ 100). Las siguientes n líneas contienen una palabra cada una.',
    output: 'Para cada palabra, imprime la palabra original si tiene como máximo 10 caracteres. Si tiene más de 10, imprime su abreviatura.',
    examples: [
      { input: '4\nword\nlocalization\ninternationalization\npneumonoultramicroscopicsilicovolcanoconiosis', output: '4\nword\nl10n\ni18n\np43s', explanation: 'Las palabras largas se representan con la primera letra, la cantidad de letras interiores y la última letra.' }
    ],
    entender: {
      introduccion: 'Se deben abreviar únicamente las palabras cuya longitud sea mayor que diez caracteres.',
      puntos: [
        'Las palabras de diez caracteres o menos no cambian.',
        'La abreviatura conserva la primera y la última letra.',
        'Entre ambas letras se escribe la cantidad de caracteres interiores.'
      ],
      ejemplo: 'La palabra localization tiene 12 caracteres: l + 10 + n = l10n.'
    },
    disenar: {
      estrategia: 'Recorrer las n palabras y medir la longitud de cada una.',
      condicion: 'Si longitud > 10, formar primeraLetra + (longitud - 2) + ultimaLetra.',
      resultado: 'Imprimir la abreviatura para palabras largas y la palabra original para las demás.'
    }
  },
  '231A': {
    input: 'La primera línea contiene n (1 ≤ n ≤ 1000). Cada una de las siguientes n líneas contiene tres valores 0 o 1, separados por espacios.',
    output: 'Imprime un entero: la cantidad de problemas que los amigos decidirán resolver.',
    examples: [
      { input: '3\n1 1 0\n1 1 1\n1 0 0', output: '2', explanation: 'Los dos primeros problemas tienen al menos dos votos afirmativos.' }
    ],
    entender: {
      introduccion: 'Tres amigos acuerdan resolver un problema cuando al menos dos de ellos creen conocer la solución.',
      puntos: [
        'Cada problema tiene tres respuestas.',
        'Cada respuesta vale 1 si el amigo está seguro y 0 en caso contrario.',
        'Un problema se cuenta cuando la suma de las tres respuestas es al menos 2.'
      ],
      ejemplo: 'Para 1 1 0, dos amigos están seguros; por tanto, ese problema se resolverá.'
    },
    disenar: {
      estrategia: 'Recorrer los n grupos de tres respuestas y sumar sus valores.',
      condicion: 'a + b + c >= 2',
      resultado: 'Contar los grupos que cumplen la condición e imprimir el contador.'
    }
  },
  '158A': {
    input: 'La primera línea contiene n y k. La segunda línea contiene n puntuaciones en orden no creciente.',
    output: 'Imprime la cantidad de participantes que avanzan a la siguiente ronda.',
    examples: [
      { input: '8 5\n10 9 8 7 7 7 5 5', output: '6', explanation: 'La puntuación de la quinta posición es 7. Seis participantes tienen al menos 7 puntos.' }
    ],
    entender: {
      introduccion: 'Se determina cuántos participantes avanzan tomando como referencia la puntuación del participante ubicado en la posición k.',
      puntos: [
        'Las puntuaciones están ordenadas de mayor a menor.',
        'Avanzan quienes igualan o superan la puntuación de la posición k.',
        'La puntuación debe ser mayor que cero.'
      ],
      ejemplo: 'Si la puntuación de la posición k es 7, avanzan los participantes con 7 puntos o más.'
    },
    disenar: {
      estrategia: 'Obtener la puntuación de la posición k y recorrer todas las puntuaciones.',
      condicion: 'puntuacion[i] >= puntuacion[k - 1] y puntuacion[i] > 0.',
      resultado: 'Contar los participantes que cumplen ambas condiciones.'
    }
  },
  '266A': {
    input: 'La primera línea contiene n, la cantidad de piedras. La segunda línea contiene una cadena de n caracteres que representa sus colores.',
    output: 'Imprime la cantidad mínima de piedras que deben retirarse para que no haya dos piedras consecutivas del mismo color.',
    examples: [
      { input: '3\nRRG', output: '1', explanation: 'Se retira una de las dos piedras rojas consecutivas.' },
      { input: '5\nRRRRR', output: '4', explanation: 'Se conserva una piedra y se retiran las otras cuatro.' }
    ],
    entender: {
      introduccion: 'Se busca eliminar repeticiones consecutivas de color retirando la menor cantidad de piedras.',
      puntos: [
        'Las piedras se representan mediante una cadena.',
        'Solo importa comparar piedras vecinas.',
        'Cuando dos caracteres consecutivos son iguales, se debe retirar una de esas piedras.'
      ],
      ejemplo: 'En RRG, basta retirar una R para obtener RG.'
    },
    disenar: {
      estrategia: 'Recorrer la cadena desde el segundo carácter y compararlo con el anterior.',
      condicion: 'Si s[i] == s[i - 1], incrementar el contador de eliminaciones.',
      resultado: 'Imprimir el contador de caracteres repetidos consecutivos.'
    }
  },
  '50A': {
    input: 'Dos enteros m y n (1 ≤ m, n ≤ 16), que representan las dimensiones del tablero.',
    output: 'Imprime el número máximo de fichas de dominó de tamaño 2 × 1 que pueden colocarse sin superponerse.',
    examples: [
      { input: '2 4', output: '4', explanation: 'El tablero tiene ocho casillas y pueden cubrirse con cuatro fichas.' }
    ],
    entender: {
      introduccion: 'Se quiere cubrir la mayor cantidad posible de casillas de un tablero rectangular con fichas de dominó.',
      puntos: [
        'El tablero tiene m filas y n columnas.',
        'Cada ficha ocupa exactamente dos casillas adyacentes.',
        'Las fichas no pueden superponerse ni salir del tablero.'
      ],
      ejemplo: 'En un tablero de 2 × 4 hay ocho casillas, por lo que caben cuatro fichas.'
    },
    disenar: {
      estrategia: 'Calcular la cantidad total de casillas y dividirla entre dos.',
      condicion: 'La cantidad máxima es floor((m * n) / 2).',
      resultado: 'Imprimir la parte entera de m por n dividido entre dos.'
    }
  },
  '112A': {
    input: 'Dos cadenas de letras latinas minúsculas y mayúsculas, una por línea. Ambas tienen la misma longitud.',
    output: 'Imprime -1 si la primera cadena es menor, 1 si es mayor y 0 si son iguales, ignorando diferencias entre mayúsculas y minúsculas.',
    examples: [
      { input: 'aBcd\nAbCd', output: '0', explanation: 'Al convertir ambas cadenas a minúsculas, las dos quedan como abcd.' }
    ],
    entender: {
      introduccion: 'Se comparan dos cadenas sin distinguir entre letras mayúsculas y minúsculas.',
      puntos: [
        'Las cadenas tienen la misma longitud.',
        'La comparación ignora si una letra está en mayúscula o minúscula.',
        'Se utiliza el orden lexicográfico.'
      ],
      ejemplo: 'aBcd y AbCd son equivalentes al ignorar las mayúsculas; el resultado es 0.'
    },
    disenar: {
      estrategia: 'Convertir ambas cadenas a una misma combinación de mayúsculas o minúsculas y compararlas.',
      condicion: 'Comparación lexicográfica: primera < segunda, primera > segunda o igualdad.',
      resultado: 'Imprimir -1, 1 o 0 según el resultado de la comparación.'
    }
  },
  '339B': {
    input: 'La primera línea contiene n, la cantidad de casas. La segunda contiene m, la cantidad de tareas. La tercera contiene m números que indican las casas que deben visitarse.',
    output: 'Imprime el tiempo mínimo necesario para completar todas las tareas, comenzando en la casa 1 y avanzando en sentido horario.',
    examples: [
      { input: '4\n3\n3 2 3', output: '6', explanation: 'El recorrido es 1→3 (2 pasos), 3→2 (3 pasos pasando por 4 y 1) y 2→3 (1 paso): total 6.' }
    ],
    entender: {
      introduccion: 'Se calcula el número de movimientos para visitar una secuencia de casas dispuestas en un círculo.',
      puntos: [
        'El recorrido comienza en la casa 1.',
        'El movimiento avanza en sentido horario.',
        'Al pasar de una casa con número mayor a otra menor, se completa la vuelta por el final del círculo.'
      ],
      ejemplo: 'Con cuatro casas, ir de la casa 3 a la 1 requiere pasar por 4: son dos movimientos.'
    },
    disenar: {
      estrategia: 'Recorrer las tareas en orden y acumular la distancia desde la posición actual.',
      condicion: 'Si siguiente >= actual, sumar siguiente - actual; si no, sumar n - actual + siguiente.',
      resultado: 'Actualizar la posición después de cada tarea e imprimir la suma de movimientos.'
    }
  }
}

export function obtenerContenidoEstatico(codigo) {
  return CONTENIDO[String(codigo ?? '').toUpperCase()] ?? null
}

export function renderizarPasoEstatico(data, paso, escaparHtml) {
  const contenido = obtenerContenidoEstatico(data.code)
  if (!contenido) return ''

  if (paso === 1) {
    const ejemplos = contenido.examples.map((ejemplo, indice) => `
      <section class="ejemplo" aria-label="Ejemplo ${indice + 1}">
        <h3 class="ejemplo__titulo">Ejemplo ${indice + 1}</h3>
        <div class="ejemplo__par">
          <div>
            <span class="ejemplo__et">Entrada</span>
            <pre>${escaparHtml(ejemplo.input)}</pre>
          </div>
          <div>
            <span class="ejemplo__et">Salida</span>
            <pre>${escaparHtml(ejemplo.output)}</pre>
          </div>
        </div>
        <p class="ejemplo__exp">${escaparHtml(ejemplo.explanation)}</p>
      </section>`).join('')

    return `
      <h2 class="problema__h2">Enunciado</h2>
      <p class="problema__texto">${escaparHtml(data.statement)}</p>
      <div class="problema__entrada-salida">
        <section class="ejemplo">
          <h3 class="ejemplo__titulo">Entrada</h3>
          <p class="ejemplo__exp">${escaparHtml(contenido.input)}</p>
        </section>
        <section class="ejemplo">
          <h3 class="ejemplo__titulo">Salida</h3>
          <p class="ejemplo__exp">${escaparHtml(contenido.output)}</p>
        </section>
      </div>
      <h2 class="problema__h2">Ejemplos</h2>
      ${ejemplos}`
  }

  const guia = paso === 2 ? contenido.entender : contenido.disenar

  if (paso === 2) {
    return `
      <h2 class="problema__h2">Entender el problema</h2>
      <p class="problema__texto">${escaparHtml(guia.introduccion)}</p>
      <section class="ejemplo">
        <h3 class="ejemplo__titulo">Condiciones del problema</h3>
        <ul>
          ${guia.puntos.map(punto => `<li>${escaparHtml(punto)}</li>`).join('')}
        </ul>
      </section>
      <section class="ejemplo">
        <h3 class="ejemplo__titulo">Ejemplo de interpretación</h3>
        <p class="ejemplo__exp">${escaparHtml(guia.ejemplo)}</p>
      </section>`
  }

  return `
    <h2 class="problema__h2">Diseñar la solución</h2>
    <section class="ejemplo">
      <h3 class="ejemplo__titulo">Estrategia</h3>
      <p class="ejemplo__exp">${escaparHtml(guia.estrategia)}</p>
    </section>
    <section class="ejemplo">
      <h3 class="ejemplo__titulo">Condición</h3>
      <p class="ejemplo__exp">${escaparHtml(guia.condicion)}</p>
    </section>
    <section class="ejemplo">
      <h3 class="ejemplo__titulo">Resultado</h3>
      <p class="ejemplo__exp">${escaparHtml(guia.resultado)}</p>
    </section>`
}
