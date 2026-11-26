
import { supabase } from './supabaseClient.js'
import { obtenerContenidoEstatico } from '../data/problemasContenidoEstatico.js'

const DATOS_PROBLEMAS = {
  '4A': {
    title: 'Sandía',
    summary: 'Divide una sandía en dos partes de peso par.',
    statement: 'Pete y Billy quieren repartir una sandía de w kilos en dos partes enteras, positivas y pares. Determina si es posible realizar esa división.',
    rating: 800,
    time_limit_ms: 1000,
    memory_limit_mb: 256
  },
  '71A': {
    title: 'Way Too Long Words',
    summary: 'Abrevia las palabras que superen los diez caracteres.',
    statement: 'Abrevia las palabras que tengan más de diez caracteres conservando su primera y última letra.',
    rating: 800,
    time_limit_ms: 1000,
    memory_limit_mb: 256
  },
  '231A': {
    title: 'Team',
    summary: 'Determina cuántos problemas resolverán tres amigos.',
    statement: 'Tres amigos resolverán un problema cuando al menos dos estén seguros de conocer su solución.',
    rating: 800,
    time_limit_ms: 1000,
    memory_limit_mb: 256
  },
  '158A': {
    title: 'Next Round',
    summary: 'Calcula cuántos participantes avanzan.',
    statement: 'Determina cuántos participantes avanzan según la puntuación del participante ubicado en la posición k.',
    rating: 800,
    time_limit_ms: 1000,
    memory_limit_mb: 256
  },
  '266A': {
    title: 'Stones on the Table',
    summary: 'Elimina colores consecutivos iguales.',
    statement: 'Determina la cantidad mínima de piedras que deben retirarse para evitar dos piedras consecutivas del mismo color.',
    rating: 800,
    time_limit_ms: 1000,
    memory_limit_mb: 256
  },
  '50A': {
    title: 'Domino piling',
    summary: 'Calcula la cantidad máxima de fichas de dominó.',
    statement: 'Calcula cuántas fichas de dominó de tamaño 2 × 1 pueden colocarse en un tablero rectangular.',
    rating: 800,
    time_limit_ms: 1000,
    memory_limit_mb: 256
  },
  '112A': {
    title: 'Petya and Strings',
    summary: 'Compara dos cadenas ignorando mayúsculas.',
    statement: 'Compara dos cadenas de igual longitud sin distinguir entre letras mayúsculas y minúsculas.',
    rating: 800,
    time_limit_ms: 2000,
    memory_limit_mb: 256
  },
  '339B': {
    title: 'Xenia and Ringroad',
    summary: 'Calcula los movimientos en una calle circular.',
    statement: 'Calcula los movimientos necesarios para completar una secuencia de tareas en casas distribuidas circularmente.',
    rating: 1000,
    time_limit_ms: 2000,
    memory_limit_mb: 256
  }
}

const crearProblemaLocal = (codigo) => {
  const contenido = obtenerContenidoEstatico(codigo)
  const datos = DATOS_PROBLEMAS[codigo]

  if (!contenido || !datos) return null

  return {
    id: codigo,
    code: codigo,
    title: datos.title,
    title_en: datos.title,
    summary: datos.summary,
    statement: datos.statement,
    input_description: contenido.input,
    output_description: contenido.output,
    rating: datos.rating,
    time_limit_ms: datos.time_limit_ms,
    memory_limit_mb: datos.memory_limit_mb,
    problem_tags: [],
    problem_examples: contenido.examples.map((ejemplo, indice) => ({
      position: indice + 1,
      input: ejemplo.input,
      output: ejemplo.output,
      explanation: ejemplo.explanation
    }))
  }
}

export const contarProblemas = () => {
  if (!supabase) {
    return Promise.resolve({
      count: Object.keys(DATOS_PROBLEMAS).length,
      error: null
    })
  }

  return supabase.from('problems').select('id', {
    count: 'exact',
    head: true
  })
}

export const listarProblemas = ({
  q = '',
  difMin = null,
  difMax = null,
  tag = null,
  orden = 'relevancia',
  limite = 100
} = {}) => {
  if (!supabase) {
    const busqueda = q.trim().toLowerCase()
    let problemas = Object.keys(DATOS_PROBLEMAS)
      .map(crearProblemaLocal)
      .filter(Boolean)

    if (busqueda) {
      problemas = problemas.filter((problema) =>
        `${problema.code} ${problema.title} ${problema.summary}`
          .toLowerCase()
          .includes(busqueda)
      )
    }

    if (difMin !== null) {
      problemas = problemas.filter((problema) => problema.rating >= difMin)
    }

    if (difMax !== null) {
      problemas = problemas.filter((problema) => problema.rating <= difMax)
    }

    if (tag) {
      problemas = problemas.filter((problema) =>
        problema.problem_tags.some((item) => item.tags?.slug === tag)
      )
    }

    if (orden === 'dificultad_asc') {
      problemas.sort((a, b) => a.rating - b.rating)
    }

    if (orden === 'dificultad_desc') {
      problemas.sort((a, b) => b.rating - a.rating)
    }

    return Promise.resolve({
      data: problemas.slice(0, limite),
      error: null
    })
  }

  return supabase.rpc('listar_problemas', {
    p_busqueda: q,
    p_dif_min: difMin,
    p_dif_max: difMax,
    p_tag: tag,
    p_orden: orden,
    p_limite: limite
  })
}

export const listarEtiquetas = () => {
  if (!supabase) {
    return Promise.resolve({ data: [], error: null })
  }

  return supabase.from('tags').select('name, slug').order('name')
}

export const obtenerProblema = (codigo) => {
  const codigoNormalizado = String(codigo ?? '').toUpperCase()
  const problemaLocal = crearProblemaLocal(codigoNormalizado)

  if (!supabase) {
    return Promise.resolve({
      data: problemaLocal,
      error: null
    })
  }

  return supabase
    .from('problems')
    .select(
      `id, code, title, title_en, summary, statement, input_description, output_description, rating, time_limit_ms, memory_limit_mb,
       problem_tags ( tags ( name, slug ) ),
       problem_examples ( position, input, output, explanation )`
    )
    .eq('code', codigoNormalizado)
    .maybeSingle()
    .then(({ data, error }) => {
      if (data) return { data, error: null }
      if (problemaLocal) return { data: problemaLocal, error: null }

      return { data: null, error }
    })
    .catch((error) => {
      if (problemaLocal) return { data: problemaLocal, error: null }

      return { data: null, error }
    })
}

export const obtenerRanking = (limite = 50) => {
  if (!supabase) {
    return Promise.resolve({ data: [], error: null })
  }

  return supabase.rpc('ranking_usuarios', {
    p_limite: limite
  })
}
