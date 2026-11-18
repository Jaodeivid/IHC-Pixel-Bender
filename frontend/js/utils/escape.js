const ENTIDADES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

export const escaparHtml = (texto = '') =>
  String(texto).replace(/[&<>"']/g, (caracter) => ENTIDADES[caracter])
