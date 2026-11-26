# Backend · Supabase

El backend de este prototipo es una base de datos en Supabase (PostgreSQL con Row Level Security).
No hay servidor propio: el frontend se comunica con Supabase mediante su API pública.

## Cómo crear la base de datos

En Supabase abre **SQL Editor → New query** y ejecuta los archivos de `supabase/` **en este orden**:

| Orden | Archivo                       | Contenido                                                            |
| ----- | ----------------------------- | -------------------------------------------------------------------- |
| 1     | `01_tablas.sql`               | Perfiles (con preferencias), problemas (con rating), etiquetas (con slug), ejemplos, envíos y vista de progreso |
| 2     | `02_funciones_y_triggers.sql` | Perfil automático, funciones del login y RPC del catálogo (`listar_problemas`, `ranking_usuarios`)             |
| 3     | `03_seguridad_rls.sql`        | Row Level Security y políticas de acceso                                                                       |
| 4     | `04_datos_ejemplo.sql`        | Etiquetas, problemas y ejemplos de entrada/salida                                                              |

Los archivos 01 a 03 no se pueden ejecutar dos veces seguidas: si necesitas empezar de cero, borra las tablas desde Supabase. El archivo 04 sí es reutilizable: sus inserciones ignoran las filas que ya existen.
