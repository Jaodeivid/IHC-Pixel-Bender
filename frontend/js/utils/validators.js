export const reglas = {
  username: (valor) =>
    /^[a-zA-Z0-9_]{3,20}$/.test(valor.trim()) ? '' : 'Usa de 3 a 20 letras, números o guion bajo.',
  email: (valor) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim())
      ? ''
      : 'Escribe un correo válido, como nombre@correo.com.',
  password: (valor) =>
    valor.length >= 8 && /[A-Za-z]/.test(valor) && /\d/.test(valor)
      ? ''
      : 'Usa mínimo 8 caracteres, con al menos una letra y un número.'
}

/** validar(valores, { campo: "regla" }) → { campo: "mensaje" } solo con los campos inválidos */
export function validar(valores, mapaReglas) {
  const errors = {}
  for (const [campo, nombreRegla] of Object.entries(mapaReglas)) {
    const mensaje = reglas[nombreRegla](valores[campo] ?? '')
    if (mensaje) errors[campo] = mensaje
  }
  return errors
}
