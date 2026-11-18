-- =====================================================================
-- Codeforces (prototipo IHC) · Supabase · Datos de ejemplo
-- Etiquetas y problemas de prueba.
-- Ejecutar en Supabase → SQL Editor, respetando el orden 01 → 04.
-- =====================================================================

-- ---------- DATOS DE EJEMPLO ----------
insert into public.tags (name) values ('Matemática'), ('Cadenas'), ('Implementación'), ('Voraz');

insert into public.problems (code, title, statement, difficulty) values
 ('4A',   'Sandía',                    'Pete y Billy quieren repartir una sandía de w kilos en dos partes pares. ¿Pueden hacerlo?', 'facil'),
 ('71A',  'Palabras demasiado largas', 'Abrevia toda palabra de más de 10 letras con su primera letra, la cantidad de letras del medio y la última.', 'facil'),
 ('231A', 'Equipo',                    'Tres amigos resuelven un problema si al menos dos están seguros. Cuenta cuántos problemas resolverán.', 'facil'),
 ('158A', 'Siguiente ronda',           'Cuenta cuántos participantes pasan a la siguiente ronda según el puntaje del puesto k.', 'facil'),
 ('266A', 'Piedras sobre la mesa',     'Calcula cuántas piedras hay que quitar para que no haya dos del mismo color seguidas.', 'facil'),
 ('50A',  'Fichas de dominó',          'Calcula cuántas fichas de 2x1 caben en un tablero de M x N casillas sin superponerse.', 'media'),
 ('112A', 'Petya y las cadenas',       'Compara dos cadenas ignorando mayúsculas y minúsculas y devuelve -1, 0 o 1.', 'media'),
 ('339B', 'Ruta de Xenia',             'Calcula el tiempo mínimo para completar todas las tareas recorriendo un anillo de casas.', 'dificil');

insert into public.problem_tags (problem_id, tag_id)
select p.id, t.id
from (values ('4A','Matemática'), ('71A','Cadenas'), ('231A','Implementación'), ('158A','Implementación'),
             ('266A','Cadenas'), ('266A','Implementación'), ('50A','Matemática'), ('50A','Voraz'),
             ('112A','Cadenas'), ('339B','Implementación')) as v(code, tag)
join public.problems p on p.code = v.code
join public.tags t     on t.name = v.tag;
