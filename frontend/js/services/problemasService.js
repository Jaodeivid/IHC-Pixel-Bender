import { supabase } from './supabaseClient.js'

/** Cuenta los problemas del catálogo (sirve para comprobar que la base de datos responde). */
export const contarProblemas = () =>
  supabase.from('problems').select('id', { count: 'exact', head: true })

/** Busca y filtra problemas. difMin/difMax en puntos de rating; tag = slug de la etiqueta. */
export const listarProblemas = ({
  q = '',
  difMin = null,
  difMax = null,
  tag = null,
  orden = 'relevancia',
  limite = 100
} = {}) =>
  supabase.rpc('listar_problemas', {
    p_busqueda: q,
    p_dif_min: difMin,
    p_dif_max: difMax,
    p_tag: tag,
    p_orden: orden,
    p_limite: limite
  })

export const listarEtiquetas = () => supabase.from('tags').select('name, slug').order('name')

/** Un problema completo (con etiquetas y ejemplos). data = null si el código no existe. */
export const obtenerProblema = (codigo) =>
  supabase
    .from('problems')
    .select(
      `id, code, title, title_en, summary, statement, rating, time_limit_ms, memory_limit_mb,
       problem_tags ( tags ( name, slug ) ),
       problem_examples ( position, input, output, explanation )`
    )
    .eq('code', codigo.toUpperCase())
    .maybeSingle()

/** Ranking de usuarios por puntos (pantalla futura). */
export const obtenerRanking = (limite = 50) =>
  supabase.rpc('ranking_usuarios', { p_limite: limite })
