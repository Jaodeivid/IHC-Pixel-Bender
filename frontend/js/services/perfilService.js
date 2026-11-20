import { supabase } from './supabaseClient.js'

export const obtenerPreferenciasRemotas = (userId) =>
  supabase.from('profiles').select('preferences').eq('id', userId).maybeSingle()

export const guardarPreferenciasRemotas = (userId, preferences) =>
  supabase.from('profiles').update({ preferences }).eq('id', userId)
