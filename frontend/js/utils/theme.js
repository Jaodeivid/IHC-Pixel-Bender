const CLAVE = 'tema'

export const temaActual = () =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'

export function alternarTema() {
  const nuevo = temaActual() === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = nuevo
  try {
    localStorage.setItem(CLAVE, nuevo)
  } catch {
    /* modo privado: solo no se guarda */
  }
  return nuevo
}
