const CLAVE_TEMA = 'tema' // 'dark' | 'light'; sin valor = seguir al sistema
const CLAVE_PREFS = 'prefs'

const VALIDOS = {
  tema: ['light', 'dark', 'system'],
  daltonismo: ['off', 'on'],
  texto: ['normal', 'grande', 'muy-grande'],
  movimiento: ['normal', 'reducido']
}
const POR_DEFECTO = { daltonismo: 'off', texto: 'normal', movimiento: 'normal' }

const leer = (clave) => {
  try {
    return localStorage.getItem(clave)
  } catch {
    return null
  }
}
const escribir = (clave, valor) => {
  try {
    localStorage.setItem(clave, valor)
  } catch {
    /* modo privado: solo no se guarda */
  }
}
const borrar = (clave) => {
  try {
    localStorage.removeItem(clave)
  } catch {
    /* modo privado */
  }
}

// main.js se suscribe aquí para guardar las preferencias en la cuenta cuando hay sesión.
const oyentes = new Set()
export const alCambiarPreferencias = (fn) => oyentes.add(fn)
const avisar = () => oyentes.forEach((fn) => fn())

// ---------- Tema ----------
export const temaActual = () =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'

/** 'light' | 'dark' | 'system' */
export const preferenciaTema = () => {
  const guardado = leer(CLAVE_TEMA)
  return guardado === 'dark' || guardado === 'light' ? guardado : 'system'
}

function fijarTema(preferencia) {
  if (preferencia === 'light' || preferencia === 'dark') escribir(CLAVE_TEMA, preferencia)
  else borrar(CLAVE_TEMA)
  const oscuro =
    preferencia === 'dark' ||
    (preferencia === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.dataset.theme = oscuro ? 'dark' : 'light'
}

export function establecerTema(preferencia) {
  fijarTema(preferencia)
  avisar()
}

export function alternarTema() {
  const nuevo = temaActual() === 'dark' ? 'light' : 'dark'
  establecerTema(nuevo)
  return nuevo
}

// ---------- Daltonismo, tamaño de texto, animaciones ----------
export function obtenerPreferencias() {
  try {
    return { ...POR_DEFECTO, ...JSON.parse(leer(CLAVE_PREFS) ?? '{}') }
  } catch {
    return { ...POR_DEFECTO }
  }
}

function aplicar(prefs) {
  const dataset = document.documentElement.dataset
  dataset.daltonismo = prefs.daltonismo
  dataset.texto = prefs.texto
  dataset.movimiento = prefs.movimiento
}

function fijarPrefs(parciales) {
  const validas = Object.fromEntries(
    Object.entries(parciales).filter(
      ([clave, valor]) => clave in POR_DEFECTO && VALIDOS[clave].includes(valor)
    )
  )
  const nuevas = { ...obtenerPreferencias(), ...validas }
  escribir(CLAVE_PREFS, JSON.stringify(nuevas))
  aplicar(nuevas)
  return nuevas
}

export function guardarPreferencias(parciales) {
  const nuevas = fijarPrefs(parciales)
  avisar()
  return nuevas
}

/** Todo lo que se guarda en la cuenta (profiles.preferences). */
export const preferenciasActuales = () => ({ tema: preferenciaTema(), ...obtenerPreferencias() })

/** Aplica lo que viene de la base de datos sin volver a guardarlo. */
export function aplicarPreferenciasRemotas(remotas = {}) {
  if (VALIDOS.tema.includes(remotas.tema)) fijarTema(remotas.tema)
  fijarPrefs(remotas)
}

/** Llamar una vez al arrancar. */
export function iniciarPreferencias() {
  aplicar(obtenerPreferencias())
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (preferenciaTema() === 'system') fijarTema('system')
  })
}
