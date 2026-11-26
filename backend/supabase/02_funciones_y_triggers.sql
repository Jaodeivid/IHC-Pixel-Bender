-- =====================================================================
-- Codeforces (prototipo IHC) · Supabase · Funciones y triggers
-- Perfil automático al registrarse y funciones usadas por el frontend.
-- Ejecutar en Supabase → SQL Editor, respetando el orden 01 → 04.
-- =====================================================================

-- ---------- AUTOMATIZACIÓN: crear perfil al registrarse ----------
create function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(lower(new.raw_user_meta_data ->> 'username'), 'user_' || substr(new.id::text, 1, 8))
  );
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- FUNCIONES PARA EL LOGIN (usables sin sesión) ----------
create function public.username_available(p_username text)
returns boolean language sql stable security definer set search_path = '' as $$
  select not exists (select 1 from public.profiles where username = lower(p_username));
$$;

-- Permite iniciar sesión con usuario en vez de correo
create function public.email_by_username(p_username text)
returns text language sql stable security definer set search_path = '' as $$
  select u.email::text
  from public.profiles p join auth.users u on u.id = p.id
  where p.username = lower(p_username);
$$;

-- ---------- CATÁLOGO: búsqueda, filtros y orden del frontend ----------
create function public.listar_problemas(
  p_busqueda text    default '',
  p_dif_min  integer default null,
  p_dif_max  integer default null,
  p_tag      text    default null,
  p_orden    text    default 'relevancia',
  p_limite   integer default 100
)
returns table (
  id           bigint,
  code         text,
  title        text,
  summary      text,
  rating       integer,
  tags         text[],
  solved_count bigint
)
language sql stable set search_path = '' as $$
  with parametros as (
    select btrim(coalesce(p_busqueda, ''))                    as busqueda,
           btrim(coalesce(p_tag, ''))                         as etiqueta,
           coalesce(p_orden, 'relevancia')                    as orden,
           least(greatest(coalesce(p_limite, 100), 1), 200)   as limite
  ),
  filtrados as (
    select p.id,
           p.code,
           p.title,
           p.summary,
           p.rating,
           coalesce(t.nombres, array[]::text[]) as tags,
           coalesce(s.resueltos, 0)             as solved_count,
           row_number() over (
             order by
               case when pa.orden = 'dificultad' then p.rating end asc nulls last,
               case when pa.orden = 'resueltos' then coalesce(s.resueltos, 0) end desc nulls last,
               case when pa.orden not in ('dificultad', 'resueltos') then
                 case when upper(p.code) = upper(pa.busqueda) then 0
                      when pa.busqueda <> '' and p.code ilike pa.busqueda || '%' then 1
                      when pa.busqueda <> '' and p.title ilike pa.busqueda || '%' then 2
                      else 3 end
               end asc nulls last,
               p.code asc
           ) as posicion
    from public.problems p
    cross join parametros pa
    left join lateral (
      select array_agg(tg.name order by tg.name) as nombres
      from public.problem_tags pt
      join public.tags tg on tg.id = pt.tag_id
      where pt.problem_id = p.id
    ) t on true
    left join lateral (
      select count(*) as resueltos
      from public.submissions su
      where su.problem_id = p.id and su.verdict = 'accepted'
    ) s on true
    where (pa.busqueda = ''
           or p.code ilike '%' || pa.busqueda || '%'
           or p.title ilike '%' || pa.busqueda || '%'
           or coalesce(p.title_en, '') ilike '%' || pa.busqueda || '%')
      and (p_dif_min is null or p.rating >= p_dif_min)
      and (p_dif_max is null or p.rating <= p_dif_max)
      and (pa.etiqueta = '' or exists (
            select 1
            from public.problem_tags pt
            join public.tags tg on tg.id = pt.tag_id
            where pt.problem_id = p.id and tg.slug = pa.etiqueta
          ))
  )
  select f.id, f.code, f.title, f.summary, f.rating, f.tags, f.solved_count
  from filtrados f
  cross join parametros pa
  where f.posicion <= pa.limite
  order by f.posicion;
$$;

-- ---------- RANKING (pantalla futura; ya consumido por problemasService) ----------
create function public.ranking_usuarios(p_limite integer default 50)
returns table (
  username  text,
  resueltos bigint,
  intentos  bigint
)
language sql stable set search_path = '' as $$
  with clasificacion as (
    select pr.username,
           count(su.id) filter (where su.verdict = 'accepted') as resueltos,
           count(su.id)                                       as intentos,
           row_number() over (
             order by count(su.id) filter (where su.verdict = 'accepted') desc,
                      count(su.id) desc,
                      pr.username asc
           ) as posicion
    from public.profiles pr
    left join public.submissions su on su.user_id = pr.id
    group by pr.id, pr.username
  )
  select c.username, c.resueltos, c.intentos
  from clasificacion c
  where c.posicion <= least(greatest(coalesce(p_limite, 50), 1), 100)
  order by c.posicion;
$$;

-- Las funciones del catálogo son públicas (RLS solo permite lectura);
-- las del login siguen siendo accesibles sin sesión.
revoke all on function
  public.username_available(text),
  public.email_by_username(text),
  public.listar_problemas(text, integer, integer, text, text, integer),
  public.ranking_usuarios(integer)
from public;

grant execute on function
  public.username_available(text),
  public.email_by_username(text),
  public.listar_problemas(text, integer, integer, text, text, integer),
  public.ranking_usuarios(integer)
to anon, authenticated;
