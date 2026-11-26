
const CONTENIDO = {
  '4A': {
    input: 'Un entero w (1 ≤ w ≤ 100), que representa el peso de la sandía.',
    output: 'YES si puede dividirse en dos partes pares y positivas; NO en caso contrario.',
    examples: [
      { input: '8', output: 'YES', explanation: '8 puede dividirse en 2 + 6.' },
      { input: '2', output: 'NO', explanation: 'No existen dos partes pares y positivas que sumen 2.' }
    ],
    entender: {
      introduccion: 'Pete y Billy quieren repartir una sandía en dos partes. El objetivo es determinar si ambos pueden recibir una cantidad entera, positiva y par de kilogramos.',
      puntos: [
        'La sandía debe dividirse exactamente en dos partes.',
        'Cada parte debe tener un peso entero.',
        'Ninguna parte puede pesar cero.',
        'Ambas partes deben tener un peso par.',
        'La suma de las dos partes debe ser igual al peso original.'
      ],
      ejemplo: 'Si la sandía pesa 8 kg, podemos repartirla en 2 kg y 6 kg. Ambas cantidades son pares y positivas, por lo que la respuesta es YES.',
      pasos: [
        'Identificar el peso total de la sandía.',
        'Comprobar que se puedan obtener dos cantidades positivas.',
        'Verificar que ambas cantidades sean pares.',
        'Confirmar que la suma de las dos cantidades sea igual al peso original.'
      ]
    },
    disenar: {
      estrategia: 'Comprobar si el peso total es par y mayor que dos.',
      condicion: 'w > 2 y w % 2 == 0',
      resultado: 'Si ambas condiciones se cumplen, imprimir YES. En caso contrario, imprimir NO.'
    }
  },

  '71A': {
    input: 'Un entero n (1 ≤ n ≤ 100), seguido de n palabras, una por línea.',
    output: 'Imprime cada palabra original o su abreviatura cuando tenga más de 10 caracteres.',
    examples: [
      { input: '4\nword\nlocalization\ninternationalization\npneumonoultramicroscopicsilicovolcanoconiosis', output: '4\nword\nl10n\ni18n\np43s', explanation: 'Las palabras largas se abrevian utilizando su primera letra, la cantidad de letras intermedias y su última letra.' }
    ],
    entender: {
      introduccion: 'El problema solicita reducir la longitud de las palabras demasiado largas mediante una abreviatura. No todas las palabras deben modificarse: únicamente aquellas que superan los diez caracteres.',
      puntos: [
        'Se recibe una cantidad n de palabras.',
        'Cada palabra se analiza individualmente.',
        'Las palabras de diez caracteres o menos permanecen iguales.',
        'Las palabras de más de diez caracteres deben abreviarse.',
        'La abreviatura conserva la primera y la última letra.'
      ],
      ejemplo: 'La palabra localization tiene 12 caracteres. Se conserva la letra l, se cuentan las 10 letras interiores y se conserva la n. El resultado es l10n.',
      pasos: [
        'Leer la cantidad de palabras.',
        'Tomar una palabra y calcular su longitud.',
        'Comprobar si supera los diez caracteres.',
        'Si no los supera, conservarla sin cambios.',
        'Si los supera, construir su abreviatura.'
      ]
    },
    disenar: {
      estrategia: 'Recorrer las palabras y evaluar su longitud individualmente.',
      condicion: 'Si longitud > 10, construir primeraLetra + (longitud - 2) + ultimaLetra.',
      resultado: 'Imprimir cada palabra abreviada cuando corresponda o conservar su contenido original.'
    }
  },

  '231A': {
    input: 'Un entero n, seguido de n líneas con tres valores binarios que representan las respuestas de los amigos.',
    output: 'Imprime la cantidad de problemas que los amigos decidirán resolver.',
    examples: [
      { input: '3\n1 1 0\n1 1 1\n1 0 0', output: '2', explanation: 'Los dos primeros problemas tienen al menos dos respuestas afirmativas.' }
    ],
    entender: {
      introduccion: 'Tres amigos deben decidir qué problemas resolverán. Para aceptar un problema, al menos dos de los tres amigos deben estar seguros de conocer su solución.',
      puntos: [
        'Cada problema tiene tres respuestas, una por cada amigo.',
        'El valor 1 significa que el amigo está seguro de resolverlo.',
        'El valor 0 significa que no está seguro.',
        'Se acepta un problema cuando al menos dos respuestas son 1.',
        'Los problemas aceptados se contabilizan en un total.'
      ],
      ejemplo: 'Para las respuestas 1 1 0, dos amigos están seguros y el problema se acepta. Para 1 0 0, solamente uno está seguro y el problema no se acepta.',
      pasos: [
        'Leer la cantidad total de problemas.',
        'Obtener las tres respuestas de cada problema.',
        'Sumar las respuestas afirmativas.',
        'Comprobar si la suma es mayor o igual a dos.',
        'Incrementar el contador cuando se cumple la condición.'
      ]
    },
    disenar: {
      estrategia: 'Recorrer todos los problemas y sumar las tres respuestas de cada uno.',
      condicion: 'a + b + c >= 2',
      resultado: 'Contar los grupos que cumplen la condición e imprimir el contador.'
    }
  },

  '158A': {
    input: 'Dos enteros n y k, seguidos de n puntuaciones ordenadas de mayor a menor.',
    output: 'Imprime cuántos participantes avanzan a la siguiente ronda.',
    examples: [
      { input: '8 5\n10 9 8 7 7 7 5 5', output: '6', explanation: 'La puntuación de referencia es 7. Seis participantes tienen al menos esa puntuación.' }
    ],
    entender: {
      introduccion: 'El problema busca determinar cuántos participantes clasifican a la siguiente ronda de una competencia utilizando como referencia la puntuación del participante ubicado en la posición k.',
      puntos: [
        'Las puntuaciones están ordenadas de mayor a menor.',
        'La posición k determina la puntuación mínima de referencia.',
        'Un participante puede avanzar si obtiene una puntuación igual o superior a la referencia.',
        'La puntuación debe ser estrictamente mayor que cero.',
        'Los participantes con cero puntos no avanzan.'
      ],
      ejemplo: 'Si k = 5 y las puntuaciones son 10, 9, 8, 7, 7, 7, 5, 5, la referencia es 7. Avanzan los seis participantes que tienen 7 puntos o más.',
      pasos: [
        'Leer la cantidad de participantes y la posición k.',
        'Obtener la puntuación ubicada en la posición k.',
        'Recorrer todas las puntuaciones.',
        'Comprobar cuáles igualan o superan la referencia.',
        'Descartar las puntuaciones iguales a cero.'
      ]
    },
    disenar: {
      estrategia: 'Obtener la puntuación de la posición k y recorrer todas las puntuaciones.',
      condicion: 'puntuacion[i] >= puntuacion[k - 1] y puntuacion[i] > 0.',
      resultado: 'Contar los participantes que cumplen ambas condiciones.'
    }
  },

  '266A': {
    input: 'Un entero n que representa la cantidad de piedras, seguido de una cadena de n caracteres que indica sus colores.',
    output: 'Imprime la cantidad mínima de piedras que deben retirarse para eliminar colores consecutivos iguales.',
    examples: [
      { input: '3\nRRG', output: '1', explanation: 'Se retira una de las dos piedras rojas consecutivas.' },
      { input: '5\nRRRRR', output: '4', explanation: 'Se conserva una piedra y se retiran las otras cuatro.' }
    ],
    entender: {
      introduccion: 'Se tiene una fila de piedras de diferentes colores. El objetivo es eliminar la menor cantidad posible para conseguir que no existan dos piedras consecutivas del mismo color.',
      puntos: [
        'Las piedras están representadas mediante una cadena de caracteres.',
        'Cada carácter representa el color de una piedra.',
        'Solamente se comparan piedras que están una junto a otra.',
        'Cuando dos piedras consecutivas tienen el mismo color, es necesario retirar una.',
        'Se busca minimizar la cantidad de eliminaciones.'
      ],
      ejemplo: 'En la secuencia RRG, las dos primeras piedras tienen el mismo color. Retirando una R obtenemos RG, donde ya no existen colores consecutivos iguales.',
      pasos: [
        'Leer la cantidad de piedras.',
        'Leer la secuencia de colores.',
        'Comenzar a comparar desde la segunda piedra.',
        'Comparar cada piedra con la anterior.',
        'Contabilizar una eliminación cuando los colores coinciden.'
      ]
    },
    disenar: {
      estrategia: 'Recorrer la cadena comparando cada carácter con el anterior.',
      condicion: 'Si s[i] == s[i - 1], incrementar el contador de eliminaciones.',
      resultado: 'Imprimir la cantidad de caracteres repetidos consecutivamente que deben eliminarse.'
    }
  },

  '50A': {
    input: 'Dos enteros m y n que representan las dimensiones del tablero rectangular.',
    output: 'Imprime la cantidad máxima de fichas de dominó de tamaño 2 × 1 que pueden colocarse.',
    examples: [
      { input: '2 4', output: '4', explanation: 'El tablero tiene ocho casillas y pueden cubrirse con cuatro fichas.' }
    ],
    entender: {
      introduccion: 'Se dispone de un tablero rectangular formado por m filas y n columnas. Se desea colocar la mayor cantidad posible de fichas de dominó sin superponerlas ni salir de los límites del tablero.',
      puntos: [
        'El tablero tiene m filas y n columnas.',
        'Cada ficha de dominó ocupa exactamente dos casillas.',
        'Las fichas pueden colocarse horizontal o verticalmente.',
        'No se permite que dos fichas ocupen una misma casilla.',
        'Todas las fichas deben permanecer dentro del tablero.'
      ],
      ejemplo: 'En un tablero de 2 × 4 existen ocho casillas. Como cada ficha ocupa dos casillas, es posible colocar cuatro fichas.',
      pasos: [
        'Identificar la cantidad de filas y columnas.',
        'Calcular la cantidad total de casillas multiplicando m por n.',
        'Recordar que cada ficha necesita dos casillas.',
        'Dividir el área total entre dos.',
        'Tomar únicamente la parte entera del resultado.'
      ]
    },
    disenar: {
      estrategia: 'Calcular el área total del tablero y dividirla entre dos.',
      condicion: 'Cantidad máxima = floor((m * n) / 2).',
      resultado: 'Imprimir la parte entera del producto de m por n dividido entre dos.'
    }
  },

  '112A': {
    input: 'Dos cadenas de caracteres formadas por letras latinas, una por línea. Ambas tienen la misma longitud.',
    output: 'Imprime -1 si la primera cadena es menor, 1 si es mayor y 0 si son iguales, ignorando mayúsculas y minúsculas.',
    examples: [
      { input: 'aBcd\nAbCd', output: '0', explanation: 'Ambas cadenas son iguales cuando se ignoran las diferencias entre mayúsculas y minúsculas.' }
    ],
    entender: {
      introduccion: 'Se reciben dos cadenas y se necesita determinar cuál tiene un valor lexicográfico menor. Para realizar la comparación correctamente, las diferencias entre letras mayúsculas y minúsculas deben ignorarse.',
      puntos: [
        'Se reciben exactamente dos cadenas.',
        'Ambas cadenas tienen la misma longitud.',
        'Las cadenas contienen letras latinas.',
        'Las letras mayúsculas y minúsculas se consideran equivalentes.',
        'La comparación sigue el orden lexicográfico.'
      ],
      ejemplo: 'Las cadenas aBcd y AbCd representan el mismo texto cuando ignoramos las mayúsculas. Por tanto, el resultado de la comparación es 0.',
      pasos: [
        'Leer las dos cadenas.',
        'Convertir ambas cadenas a minúsculas o mayúsculas.',
        'Comparar los caracteres desde la primera posición.',
        'Identificar cuál cadena tiene el primer carácter diferente menor.',
        'Determinar si el resultado es -1, 1 o 0.'
      ]
    },
    disenar: {
      estrategia: 'Convertir ambas cadenas a una misma combinación de mayúsculas o minúsculas y compararlas lexicográficamente.',
      condicion: 'Primera cadena < segunda: -1. Primera cadena > segunda: 1. Iguales: 0.',
      resultado: 'Imprimir -1, 1 o 0 según el resultado de la comparación.'
    }
  },

  '339B': {
    input: 'Un entero n que representa la cantidad de casas, un entero m que representa la cantidad de tareas y una secuencia de m números que indica las casas que deben visitarse.',
    output: 'Imprime el tiempo mínimo necesario para completar todas las tareas, comenzando en la casa 1.',
    examples: [
      { input: '4\n3\n3 2 3', output: '6', explanation: 'Se recorren 2 pasos de 1 a 3, 3 pasos de 3 a 2 y 1 paso de 2 a 3. Total: 6.' }
    ],
    entender: {
      introduccion: 'Se debe completar una lista de tareas ubicadas en diferentes casas distribuidas alrededor de una calle circular. El recorrido comienza en la casa 1 y se realiza únicamente en sentido horario.',
      puntos: [
        'Las casas están numeradas desde 1 hasta n.',
        'El recorrido comienza en la casa número 1.',
        'Las tareas deben completarse en el orden indicado.',
        'El movimiento siempre avanza en sentido horario.',
        'Si la siguiente casa tiene un número menor, significa que se debe completar una vuelta por el final del recorrido.',
        'Si la tarea está en la casa actual, no se necesita avanzar.'
      ],
      ejemplo: 'Con cuatro casas, si estamos en la casa 3 y debemos llegar a la casa 1, avanzamos por la casa 4 y después llegamos a la 1. Son dos movimientos.',
      pasos: [
        'Establecer la posición inicial en la casa 1.',
        'Leer la secuencia de casas que deben visitarse.',
        'Comparar cada destino con la posición actual.',
        'Si el destino es mayor o igual, avanzar directamente.',
        'Si el destino es menor, completar la vuelta por el final del círculo.',
        'Acumular todos los movimientos y actualizar la posición.'
      ]
    },
    disenar: {
      estrategia: 'Recorrer las tareas en orden y acumular la distancia desde la posición actual.',
      condicion: 'Si siguiente >= actual, sumar siguiente - actual. Si siguiente < actual, sumar n - actual + siguiente.',
      resultado: 'Actualizar la posición después de cada tarea e imprimir la suma total de movimientos.'
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
      </section>
    `).join('')

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
      ${ejemplos}
    `
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
      </section>

      <section class="ejemplo">
        <h3 class="ejemplo__titulo">¿Cómo analizarlo?</h3>
        <ol>
          ${guia.pasos.map(paso => `<li>${escaparHtml(paso)}</li>`).join('')}
        </ol>
      </section>
    `
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
    </section>
  `
}
