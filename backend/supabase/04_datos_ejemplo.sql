-- =====================================================================
-- Codeforces (prototipo IHC) · Supabase · Datos de ejemplo
-- Etiquetas, problemas y ejemplos de entrada/salida usados por el frontend.
-- Ejecutar en Supabase → SQL Editor, respetando el orden 01 → 04.
-- Se puede volver a ejecutar: las inserciones ignoran filas ya existentes.
-- =====================================================================

-- ---------- DATOS DE EJEMPLO ----------
insert into public.tags (name, slug) values
  ('Matemática', 'matematica'),
  ('Cadenas', 'cadenas'),
  ('Implementación', 'implementacion'),
  ('Voraz', 'voraz')
on conflict (name) do nothing;

insert into public.problems (code, title, title_en, summary, statement, rating) values
  ('4A',   'Sandía', 'Watermelon',
          'Comprueba si un peso se puede repartir en dos partes pares.',
          'Pete y Billy quieren repartir una sandía de w kilos en dos partes pares. ¿Pueden hacerlo?', 1200),
  ('71A',  'Palabras demasiado largas', 'Too Long Words',
          'Abrevia las palabras de más de diez caracteres.',
          'Abrevia toda palabra de más de 10 letras con su primera letra, la cantidad de letras del medio y la última.', 800),
  ('231A', 'Equipo', 'Team',
          'Cuenta los problemas que resuelve el equipo.',
          'Tres amigos resuelven un problema si al menos dos están seguros. Cuenta cuántos problemas resolverán.', 800),
  ('158A', 'Siguiente ronda', 'Next Round',
          'Calcula cuántos participantes pasan de ronda.',
          'Cuenta cuántos participantes pasan a la siguiente ronda según el puntaje del puesto k.', 1000),
  ('266A', 'Piedras sobre la mesa', 'Stones on the Table',
          'Quita piedras hasta que no haya dos iguales seguidas.',
          'Calcula cuántas piedras hay que quitar para que no haya dos del mismo color seguidas.', 1100),
  ('50A',  'Fichas de dominó', 'Domino Principle',
          'Calcula cuántas fichas caben en un tablero.',
          'Calcula cuántas fichas de 2x1 caben en un tablero de M x N casillas sin superponerse.', 1300),
  ('112A', 'Petya y las cadenas', 'Petya and Strings',
          'Compara dos cadenas sin distinguir mayúsculas.',
          'Compara dos cadenas ignorando mayúsculas y minúsculas y devuelve -1, 0 o 1.', 1200),
  ('339B', 'Ruta de Xenia', 'Xenia and Ringroad',
          'Calcula el tiempo mínimo para recorrer las casas.',
          'Calcula el tiempo mínimo para completar todas las tareas recorriendo un anillo de casas.', 1900)
on conflict (code) do nothing;

insert into public.problem_tags (problem_id, tag_id)
select p.id, t.id
from (values ('4A','Matemática'), ('71A','Cadenas'), ('231A','Implementación'), ('158A','Implementación'),
             ('266A','Cadenas'), ('266A','Implementación'), ('50A','Matemática'), ('50A','Voraz'),
             ('112A','Cadenas'), ('339B','Implementación')) as v(code, tag)
join public.problems p on p.code = v.code
join public.tags t     on t.name = v.tag
on conflict (problem_id, tag_id) do nothing;

insert into public.problem_examples (problem_id, position, input, output, explanation)
select p.id, v.position, v.input, v.output, v.explanation
from (values
  ('4A',   1, E'6\n2 5 3 8 1 11\n',      E'NO\nNO\nNO\nYES\nNO\nNO\n',
   'Solo 8 se puede dividir en dos partes pares: 4 y 4.'),
  ('71A',  1, E'4\nword\nlocalization\ninternationalization\ncodeforces\n',
            E'word\nl10n\ni18n\ncodeforces\n',
   'Se reemplazan las letras intermedias por su número cuando hay más de 10.'),
  ('231A', 1, E'3\n1 1 0\n1 1 1\n0 0 0\n', E'2\n',
   'Basta con que dos de los tres amigos estén seguros.'),
  ('158A', 1, E'5 2\n1 2 3 4 5\n',        E'4\n',
   'Los cuatro últimos puntajes son mayores o iguales que el del puesto k.'),
  ('266A', 1, E'4\naabb\n',               E'2\n',
   'Hay dos pares consecutivos: aa y bb.'),
  ('50A',  1, E'2 4\n',                   E'4\n',
   'Caben (2 x 4) / 2 = 4 fichas.'),
  ('112A', 1, E'aA\na\n',                 E'0\n',
   'Ignorando mayúsculas, las dos cadenas son iguales.'),
  ('339B', 1, E'4 2\n2 4\n',              E'3\n',
   'Desde la casa 1 ir a la 2 cuesta 1 paso y de la 2 a la 4, dos pasos más.')
) as v(code, position, input, output, explanation)
join public.problems p on p.code = v.code
on conflict (problem_id, position) do nothing;
