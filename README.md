# Codeforces · Prototipo IHC

Prototipo de interfaz para practicar problemas de programación. Incluye las pantallas de
inicio de sesión, registro, recuperación y restablecimiento de contraseña, conectadas a Supabase.

El proyecto está separado en dos partes independientes:

| Carpeta     | Qué contiene                                                   |
| ----------- | -------------------------------------------------------------- |
| `frontend/` | La interfaz que corre en el navegador (HTML, CSS y JavaScript) |
| `backend/`  | La base de datos de Supabase (SQL ordenado por pasos)          |

## Cómo ejecutarlo

1. **Backend:** crea la base de datos siguiendo `backend/README.md` (cuatro archivos SQL, en orden).
2. **Conexión:** en `frontend/js/config.js` coloca la URL del proyecto y la clave **publicable** (`sb_publishable_...`).
   Nunca uses la clave `sb_secret_...` en el navegador.
3. **Frontend:** sirve la carpeta `frontend/` con un servidor local (los módulos ES no funcionan abriendo el archivo directamente):

   ```bash
   cd frontend
   python3 -m http.server 5500
   ```

   y abre <http://localhost:5500>.

## Estructura

```
frontend/
  index.html
  css/            tokens, base, componentes y pantalla de login
  js/
    main.js         arranque de la aplicación
    config.js       URL y clave pública de Supabase
    router.js       rutas con hash (#/login, #/registro, ...)
    state.js        sesión del usuario
    components/     navbar, hero y formulario de autenticación reutilizable
    screens/        login, register, forgot, reset
    services/       único punto de contacto con Supabase (cliente, autenticación, problemas)
    data/           textos: hero y mensajes
    utils/          escape de HTML y validadores
backend/
  README.md
  supabase/       01_tablas, 02_funciones_y_triggers, 03_seguridad_rls, 04_datos_ejemplo
```

Regla de separación: solo `frontend/js/services/` usa el cliente de Supabase. Las pantallas y los componentes
nunca llaman a Supabase directamente.

## Convención de nomenclatura

camelCase con terminología mixta español-inglés:

- Español para nombres descriptivos y lógica del negocio: `montarLogin`, `mostrarBanner`, `rutaActual`.
- Inglés para términos técnicos habituales: `user`, `event`, `list`, `data`, `state`, `input`, `handler`, `error`, `response`.
- Constantes en `MAYUSCULAS_CON_GUION_BAJO` (`LINKS`, `MENSAJES`) y columnas SQL en `snake_case`.
- Clases e ids de CSS siguen BEM en inglés (`field__msg`, `btn--ghost`).

Ejemplos: `listaUsuarios`, `escaparHtml()`, `enviarResetPassword()`, `limpiarErroresCampos()`.
