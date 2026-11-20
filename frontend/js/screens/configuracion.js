import { auth } from '../state.js'
import { MENSAJES } from '../data/mensajes.js'
import { MENSAJES_AJUSTES } from '../data/mensajesAjustes.js'
import { cambiarUsername, cambiarEmail, cambiarPasswordConActual } from '../services/authService.js'
import { validar } from '../utils/validators.js'
import { escaparHtml } from '../utils/escape.js'
import {
  preferenciaTema,
  establecerTema,
  obtenerPreferencias,
  guardarPreferencias
} from '../utils/theme.js'

const ICONOS = { error: '✕', success: '✓', warning: '!' }

const campo = ({ id, label, type = 'text', autocomplete = 'off', hint = '' }) => `
  <div class="field">
    <label class="field__label" for="${id}">${label}</label>
    <input class="input" id="${id}" name="${id}" type="${type}" autocomplete="${autocomplete}" aria-describedby="${id}-msg">
    <p class="field__msg" id="${id}-msg" data-hint="${hint}">${hint}</p>
  </div>`

const formulario = (id, titulo, descripcion, campos, boton) => `
  <form class="ajustes__form" id="${id}" novalidate>
    <h3 class="ajustes__h3">${titulo}</h3>
    <p class="ajustes__desc">${descripcion}</p>
    <div class="banner" hidden></div>
    ${campos.map(campo).join('')}
    <button class="btn btn--sm" type="submit">${boton}</button>
  </form>`

const grupo = (nombre, leyenda, opciones, actual) => `
  <fieldset class="opciones">
    <legend class="field__label">${leyenda}</legend>
    <div class="opciones__lista">
      ${opciones
        .map(
          ([valor, texto]) =>
            `<label class="opcion"><input type="radio" name="${nombre}" value="${valor}"${valor === actual ? ' checked' : ''}><span>${texto}</span></label>`
        )
        .join('')}
    </div>
  </fieldset>`

const interruptor = (id, titulo, descripcion, activo) => `
  <label class="opcion opcion--bloque">
    <input type="checkbox" id="${id}"${activo ? ' checked' : ''}>
    <span><strong>${titulo}</strong><small>${descripcion}</small></span>
  </label>`

/** Conecta un formulario: valida, bloquea el botón mientras guarda y muestra el resultado en su banner. */
function enlazarForm(vista, id, { reglas, enviar, alExito }) {
  const form = vista.querySelector('#' + id)
  const banner = form.querySelector('.banner')
  const boton = form.querySelector('button[type="submit"]')
  const textoBoton = boton.textContent

  const mostrar = (mensaje) => {
    if (!mensaje) {
      banner.hidden = true
      return
    }
    banner.className = `banner banner--${mensaje.type}`
    banner.setAttribute('role', mensaje.type === 'error' ? 'alert' : 'status')
    banner.innerHTML = `<span class="banner__icon" aria-hidden="true">${ICONOS[mensaje.type] ?? '!'}</span>
      <div class="banner__body"><span class="banner__title">${mensaje.title}</span><span>${mensaje.text}</span></div>`
    banner.hidden = false
  }

  const marcar = (nombre, texto) => {
    const input = form.elements[nombre]
    if (!input) return
    input.setAttribute('aria-invalid', String(Boolean(texto)))
    const mensaje = form.querySelector(`#${nombre}-msg`)
    mensaje.textContent = texto || mensaje.dataset.hint
    mensaje.classList.toggle('field__msg--error', Boolean(texto))
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    mostrar(null)
    const valores = Object.fromEntries(
      [...form.elements].filter((el) => el.name).map((el) => [el.name, el.value])
    )
    const locales = reglas?.(valores) ?? {}
    const errores = {}
    for (const nombre of Object.keys(valores)) {
      marcar(nombre, '')
      if (!valores[nombre].trim()) errores[nombre] = 'Completa este campo.'
      else if (locales[nombre]) errores[nombre] = locales[nombre]
    }
    const nombresConError = Object.keys(errores)
    if (nombresConError.length) {
      nombresConError.forEach((nombre) => marcar(nombre, errores[nombre]))
      form.elements[nombresConError[0]].focus()
      return
    }

    boton.disabled = true
    boton.textContent = 'Guardando…'
    let respuesta
    try {
      respuesta = await enviar(valores)
    } catch (error) {
      console.error(error)
      respuesta = {
        ok: false,
        message: navigator.onLine ? MENSAJES.errorGenerico : MENSAJES.sinConexion
      }
    }
    boton.disabled = false
    boton.textContent = textoBoton

    mostrar(respuesta.message)
    Object.entries(respuesta.fieldErrors ?? {}).forEach(([nombre, texto]) => marcar(nombre, texto))
    const primero = Object.keys(respuesta.fieldErrors ?? {})[0]
    if (primero) form.elements[primero].focus()
    if (respuesta.ok) alExito?.(form, valores)
  })
}

export function montarConfiguracion(vista) {
  const usuario = auth.user?.user_metadata?.username ?? ''
  const correo = auth.user?.email ?? ''
  const prefs = obtenerPreferencias()

  vista.innerHTML = `
    <main class="ajustes">
      <h1 class="problemas__titulo">Configuración</h1>
      <p class="problemas__sub">Administra tu cuenta y cómo se ve y se usa Codeforces.</p>

      <section class="ajustes__seccion" aria-labelledby="hCuenta">
        <h2 class="ajustes__h2" id="hCuenta">Cuenta</h2>
        ${formulario(
          'formUsuario',
          'Nombre de usuario',
          `Ahora eres <strong id="usuarioActual">${escaparHtml(usuario)}</strong>.`,
          [
            {
              id: 'username',
              label: 'Nuevo usuario',
              autocomplete: 'username',
              hint: 'De 3 a 20 letras, números o guion bajo.'
            }
          ],
          'Guardar usuario'
        )}
        ${formulario(
          'formCorreo',
          'Correo electrónico',
          `Tu correo actual es <strong>${escaparHtml(correo)}</strong>. Te enviaremos un enlace para confirmar el cambio.`,
          [
            {
              id: 'email',
              label: 'Nuevo correo',
              type: 'email',
              autocomplete: 'email',
              hint: 'Ej. nombre@correo.com'
            }
          ],
          'Cambiar correo'
        )}
        ${formulario(
          'formPassword',
          'Contraseña',
          'Por seguridad, escribe tu contraseña actual antes de elegir una nueva.',
          [
            {
              id: 'actual',
              label: 'Contraseña actual',
              type: 'password',
              autocomplete: 'current-password'
            },
            {
              id: 'nueva',
              label: 'Contraseña nueva',
              type: 'password',
              autocomplete: 'new-password',
              hint: 'Mínimo 8 caracteres, con letras y números.'
            }
          ],
          'Cambiar contraseña'
        )}
      </section>

      <section class="ajustes__seccion" aria-labelledby="hApariencia">
        <h2 class="ajustes__h2" id="hApariencia">Apariencia</h2>
        ${grupo(
          'tema',
          'Tema',
          [
            ['system', 'Según el sistema'],
            ['light', 'Claro'],
            ['dark', 'Oscuro']
          ],
          preferenciaTema()
        )}
        ${grupo(
          'texto',
          'Tamaño del texto',
          [
            ['normal', 'Normal'],
            ['grande', 'Grande'],
            ['muy-grande', 'Muy grande']
          ],
          prefs.texto
        )}
      </section>

      <section class="ajustes__seccion" aria-labelledby="hAccesibilidad">
        <h2 class="ajustes__h2" id="hAccesibilidad">Accesibilidad</h2>
        ${interruptor('prefDaltonismo', 'Colores para daltonismo', 'Cambia el verde y el rojo de los avisos por azul y naranja. Los íconos ✓ y ✕ se mantienen.', prefs.daltonismo === 'on')}
        ${interruptor('prefMovimiento', 'Reducir animaciones', 'Quita movimientos y transiciones.', prefs.movimiento === 'reducido')}
        <p class="field__msg" id="estadoPrefs" role="status"></p>
        <p class="ajustes__desc">Estas opciones se guardan en este dispositivo y, si iniciaste sesión, también en tu cuenta.</p>
      </section>
    </main>`

  // ---------- Preferencias: se aplican al instante ----------
  const main = vista.querySelector('main')
  const estado = main.querySelector('#estadoPrefs')
  const aplicado = () => (estado.textContent = 'Cambios aplicados ✓')

  main.querySelectorAll('input[name="tema"]').forEach((radio) =>
    radio.addEventListener('change', () => {
      establecerTema(radio.value)
      aplicado()
    })
  )
  main.querySelectorAll('input[name="texto"]').forEach((radio) =>
    radio.addEventListener('change', () => {
      guardarPreferencias({ texto: radio.value })
      aplicado()
    })
  )
  main.querySelector('#prefDaltonismo').addEventListener('change', (event) => {
    guardarPreferencias({ daltonismo: event.target.checked ? 'on' : 'off' })
    aplicado()
  })
  main.querySelector('#prefMovimiento').addEventListener('change', (event) => {
    guardarPreferencias({ movimiento: event.target.checked ? 'reducido' : 'normal' })
    aplicado()
  })

  // ---------- Cuenta ----------
  enlazarForm(vista, 'formUsuario', {
    reglas: (valores) => {
      const errores = validar(valores, { username: 'username' })
      if (!errores.username && valores.username.trim().toLowerCase() === usuario.toLowerCase())
        errores.username = 'Ese ya es tu usuario.'
      return errores
    },
    async enviar({ username }) {
      const respuesta = await cambiarUsername(auth.user.id, username)
      if (respuesta.ok) return { ok: true, message: MENSAJES_AJUSTES.usuarioCambiado }
      if (respuesta.code === 'username-taken')
        return {
          ok: false,
          message: MENSAJES.usuarioEnUso,
          fieldErrors: { username: 'Ese usuario ya está en uso.' }
        }
      return { ok: false, message: MENSAJES.errorGenerico }
    },
    alExito: (form, { username }) => {
      main.querySelector('#usuarioActual').textContent = username.trim().toLowerCase()
      form.reset()
    }
  })

  enlazarForm(vista, 'formCorreo', {
    reglas: (valores) => validar(valores, { email: 'email' }),
    async enviar({ email }) {
      const respuesta = await cambiarEmail(email)
      if (respuesta.ok) return { ok: true, message: MENSAJES_AJUSTES.correoPendiente }
      if (respuesta.code === 'email-taken')
        return {
          ok: false,
          message: MENSAJES.correoEnUso,
          fieldErrors: { email: 'Este correo ya tiene una cuenta.' }
        }
      if (respuesta.code === 'rate-limit')
        return { ok: false, message: MENSAJES.demasiadosIntentos }
      return { ok: false, message: MENSAJES.errorGenerico }
    },
    alExito: (form) => form.reset()
  })

  enlazarForm(vista, 'formPassword', {
    reglas: (valores) => validar(valores, { nueva: 'password' }),
    async enviar({ actual, nueva }) {
      const respuesta = await cambiarPasswordConActual(auth.user.email, actual, nueva)
      if (respuesta.ok) return { ok: true, message: MENSAJES_AJUSTES.passwordCambiada }
      if (respuesta.code === 'wrong-current')
        return {
          ok: false,
          message: MENSAJES_AJUSTES.passwordActualIncorrecta,
          fieldErrors: { actual: 'No coincide con tu contraseña actual.' }
        }
      if (respuesta.code === 'same-password')
        return {
          ok: false,
          message: MENSAJES.passwordRepetido,
          fieldErrors: { nueva: 'Debe ser distinta a la actual.' }
        }
      if (respuesta.code === 'weak-password')
        return {
          ok: false,
          message: MENSAJES.passwordDebil,
          fieldErrors: { nueva: 'Prueba con una contraseña más larga.' }
        }
      return { ok: false, message: MENSAJES.errorGenerico }
    },
    alExito: (form) => form.reset()
  })
}
