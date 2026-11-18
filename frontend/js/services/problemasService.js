import { supabase } from './supabaseClient.js'

/** Cuenta los problemas del catálogo (sirve para comprobar que la base de datos responde). */
export const contarProblemas = () =>
  supabase.from('problems').select('id', { count: 'exact', head: true })
