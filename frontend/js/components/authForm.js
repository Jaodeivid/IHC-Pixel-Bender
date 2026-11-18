import { renderizarHero } from './hero.js'
import { MENSAJES } from '../data/mensajes.js'

const OJO = `
  <svg class="eye eye--open" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
  <svg class="eye eye--closed" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6C3.7 8.4 2 12 2 12s3.5 7 10 7c1.6 0 3-.4 4.3-1M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>`

const ICONOS_BANNER = { error: '✕', success: '✓', warning: '!' }

const htmlCampo = (campo) => `
  <div class="field${campo.type === 'password' ? ' field--password' : ''}">
    <label class="field__label" for="${campo.name}">${campo.label}</label>
    <div class="field__wrap">
      <input class="input" id="${campo.name}" name="${campo.name}" type="${campo.type ?? 'text'}" autocomplete="${campo.autocomplete ?? 'off'}"
             placeholder="${campo.placeholder ?? ''}" aria-describedby="${campo.name}-msg" required>
      ${campo.type === 'password' ? `<button class="field__toggle" type="button" data-toggle="${campo.name}" aria-pressed="false" aria-label="Mostrar contraseña">${OJO}</button>` : ''}
    </div>
    <p class="field__msg" id="${campo.name}-msg">${campo.hint ?? ''}</p>
  </div>`

/**
 * Monta cualquier pantalla de autenticación con el mismo diseño y los mismos estados.
 * cfg: { title, subtitle, fields, submitLabel, loadingLabel, successLabel, links, note,
 *        validar(valores) → {campo: msg}, onSubmit(valores) → {ok, message, fieldErrors?, done?}, initial?,
 *        validacionEnVivo? (por defecto true) }
 * Cada campo puede traer okMsg: texto que se muestra cuando el campo es válido.
 */
export function montarAuthForm(vista, cfg) {
  vista.innerHTML = `
    <main class="login">
      ${renderizarHero()}
      <section class="panel">
        <div class="card" id="card">
          <header>
            <h2 class="card__title">${cfg.title}</h2>
            <p class="card__subtitle">${cfg.subtitle}</p>
          </header>
          <div id="banner" class="banner" role="alert" hidden></div>
          <form class="form" id="form" novalidate>
            ${cfg.fields.map(htmlCampo).join('')}
            <button class="btn" id="submitBtn" type="submit" disabled>${cfg.submitLabel}</button>
          </form>
          ${cfg.links?.length ? `<div class="card__links${cfg.links.length === 1 ? ' card__links--single' : ''}">${cfg.links.map((link) => `<a class="link" href="${link.href}">${link.label}</a>`).join('')}</div>` : ''}
          ${cfg.note ? `<p class="card__note">${cfg.note}</p>` : ''}
        </div>
      </section>
    </main>`

  const $ = (selector) => vista.querySelector(selector)
  const card = $('#card'),
    form = $('#form'),
    banner = $('#banner'),
    btn = $('#submitBtn')
  const inputs = Object.fromEntries(cfg.fields.map((campo) => [campo.name, $('#' + campo.name)]))
  const pistas = Object.fromEntries(cfg.fields.map((campo) => [campo.name, campo.hint ?? '']))
  const okMsgs = Object.fromEntries(
    cfg.fields.map((campo) => [campo.name, campo.okMsg ?? campo.hint ?? 'Se ve bien.'])
  )
  const list = Object.values(inputs)
  const enVivo = cfg.validacionEnVivo !== false
  const tocados = new Set() // campos donde el usuario ya escribió: solo esos se validan en vivo

  const obtenerValores = () =>
    Object.fromEntries(Object.entries(inputs).map(([nombre, input]) => [nombre, input.value]))

  // Vacío + formato en un solo pase: devuelve { campo: mensaje } para TODOS los campos con problema
  function erroresDe(valores) {
    const locales = cfg.validar?.(valores) ?? {}
    const errores = {}
    for (const campo of cfg.fields) {
      if (!valores[campo.name].trim())
        errores[campo.name] = campo.requiredMsg ?? 'Completa este campo.'
      else if (locales[campo.name]) errores[campo.name] = locales[campo.name]
    }
    return errores
  }

  // ---------- Estado visual por campo: neutro | error | válido ----------
  function mostrarErrorCampo(nombre, texto, valido = false) {
    const input = inputs[nombre]
    if (!input) return
    const esValido = valido && !texto
    input.setAttribute('aria-invalid', String(Boolean(texto)))
    input.dataset.valid = String(esValido)
    const mensaje = $(`#${nombre}-msg`)
    mensaje.textContent = texto || (esValido ? okMsgs[nombre] : pistas[nombre])
    mensaje.classList.toggle('field__msg--error', Boolean(texto))
    mensaje.classList.toggle('field__msg--ok', esValido)
  }
  const limpiarErroresCampos = () =>
    cfg.fields.forEach((campo) => mostrarErrorCampo(campo.name, ''))

  // Valida un solo campo (solo si ya fue tocado) y muestra error o "válido"
  function validarEnVivo(nombre) {
    if (!enVivo || !tocados.has(nombre)) return
    const error = erroresDe(obtenerValores())[nombre] ?? ''
    mostrarErrorCampo(nombre, error, !error)
  }

  // ---------- Banner ----------
  function mostrarBanner(mensaje) {
    if (!mensaje) {
      banner.hidden = true
      return
    }
    banner.className = `banner banner--${mensaje.type}`
    banner.setAttribute('role', mensaje.type === 'error' ? 'alert' : 'status')
    banner.innerHTML =
      `<span class="banner__icon" aria-hidden="true">${ICONOS_BANNER[mensaje.type] ?? '!'}</span>
      <div class="banner__body">
        <span class="banner__title">${mensaje.title}</span><span>${mensaje.text}</span>` +
      (mensaje.action
        ? `<button class="banner__action" type="button">${mensaje.actionLabel}</button>`
        : '') +
      `</div>`
    banner.hidden = false
    banner.querySelector('button')?.addEventListener('click', () => ejecutarAccion(mensaje.action))
  }

  function ejecutarAccion(accion) {
    if (accion === 'retry') return form.requestSubmit()
    if (accion === 'fix') {
      cfg.fields
        .filter((campo) => campo.type === 'password')
        .forEach((campo) => (inputs[campo.name].value = ''))
      tocados.clear()
      limpiarErroresCampos()
      mostrarBanner(null)
      list[0].focus()
      list[0].select?.()
    }
  }

  // ---------- Estados del botón: idle | loading | success ----------
  function cambiarEstado(estado) {
    const bloqueado = estado !== 'idle'
    list.forEach((input) => (input.disabled = bloqueado))
    btn.className =
      'btn' + (estado === 'loading' ? ' is-loading' : estado === 'success' ? ' is-success' : '')
    btn.disabled = bloqueado
    btn.innerHTML =
      estado === 'loading'
        ? `<span class="spinner"></span>${cfg.loadingLabel}`
        : estado === 'success'
          ? cfg.successLabel
          : cfg.submitLabel
  }

  const sacudirCard = () => {
    card.classList.remove('shake')
    void card.offsetWidth
    card.classList.add('shake')
  }

  function mostrarResultado(response) {
    mostrarBanner(response.message)
    if (response.ok) {
      cambiarEstado('success')
      if (response.done) setTimeout(response.done, 1000) // pausa para leer el mensaje
      return
    }
    cambiarEstado('idle')
    const errors = response.fieldErrors ?? {}
    Object.entries(errors).forEach(([nombre, texto]) => mostrarErrorCampo(nombre, texto))
    if (response.message?.type === 'error') sacudirCard()
    ;(inputs[Object.keys(errors)[0]] ?? inputs[response.focus])?.focus()
  }

  // ---------- Eventos ----------
  list.forEach((input) => {
    // Al escribir, el campo queda "tocado" y se valida en cada tecla
    input.addEventListener('input', () => {
      tocados.add(input.name)
      validarEnVivo(input.name)
    })
    // Al salir de un campo con contenido, también se valida
    input.addEventListener('blur', () => {
      if (!input.value.trim()) return
      tocados.add(input.name)
      validarEnVivo(input.name)
    })
  })

  vista.querySelectorAll('[data-toggle]').forEach((toggle) =>
    toggle.addEventListener('click', () => {
      const input = inputs[toggle.dataset.toggle]
      const mostrar = input.type === 'password'
      input.type = mostrar ? 'text' : 'password'
      toggle.classList.toggle('is-visible', mostrar)
      toggle.setAttribute('aria-label', mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña')
      toggle.setAttribute('aria-pressed', String(mostrar))
    })
  )

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    limpiarErroresCampos()
    mostrarBanner(null)

    const valores = obtenerValores()
    const errores = erroresDe(valores)
    const invalidos = cfg.fields.filter((campo) => errores[campo.name])
    if (invalidos.length) {
      // Tras intentar enviar, todos los campos pasan a validarse en vivo
      cfg.fields.forEach((campo) => tocados.add(campo.name))
      invalidos.forEach((campo) => mostrarErrorCampo(campo.name, errores[campo.name]))
      inputs[invalidos[0].name].focus()
      return
    }

    cambiarEstado('loading')
    let response
    try {
      response = await cfg.onSubmit(valores)
    } catch (error) {
      console.error(error)
      const sinConexion =
        !navigator.onLine ||
        error?.name === 'AuthRetryableFetchError' ||
        /fetch|network/i.test(error?.message ?? '')
      response = { ok: false, message: sinConexion ? MENSAJES.sinConexion : MENSAJES.errorGenerico }
    }
    mostrarResultado(response)
  })

  // ---------- Estado inicial (pantalla 02 arranca con el error) ----------
  if (cfg.initial) {
    Object.entries(cfg.initial.values).forEach(([nombre, valor]) => (inputs[nombre].value = valor))
    list.forEach((input) => input.setAttribute('aria-invalid', 'true'))
    mostrarBanner(cfg.initial.message)
    sacudirCard()
  }
  cambiarEstado('idle')
}
