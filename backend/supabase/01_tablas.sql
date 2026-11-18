-- =====================================================================
-- Codeforces (prototipo IHC) · Supabase · Tablas y vistas
-- Perfiles, catálogo de problemas, envíos y vista de progreso.
-- Ejecutar en Supabase → SQL Editor, respetando el orden 01 → 04.
-- =====================================================================

-- ---------- PERFILES (1 a 1 con auth.users) ----------
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text not null,
  display_name text,
  avatar_url   text,
  created_at   timestamptz not null default now(),
  constraint username_format check (username ~ '^[a-z0-9_]{3,20}$')
);
create unique index profiles_username_key on public.profiles (username);

-- ---------- CATÁLOGO DE PROBLEMAS ----------
create table public.problems (
  id              bigint generated always as identity primary key,
  code            text not null unique,                       -- p. ej. '4A'
  title           text not null,
  statement       text not null,
  difficulty      text not null check (difficulty in ('facil','media','dificil')),
  time_limit_ms   int  not null default 1000 check (time_limit_ms > 0),
  memory_limit_mb int  not null default 256  check (memory_limit_mb > 0),
  created_at      timestamptz not null default now()
);

create table public.tags (
  id   smallint generated always as identity primary key,
  name text not null unique
);

-- N a N: un problema tiene varias etiquetas, una etiqueta tiene varios problemas
create table public.problem_tags (
  problem_id bigint   not null references public.problems(id) on delete cascade,
  tag_id     smallint not null references public.tags(id)     on delete cascade,
  primary key (problem_id, tag_id)
);
create index problem_tags_tag_idx on public.problem_tags (tag_id);

-- 1 a N: ejemplos de entrada/salida de cada problema
create table public.problem_examples (
  id          bigint generated always as identity primary key,
  problem_id  bigint not null references public.problems(id) on delete cascade,
  position    smallint not null default 1,
  input       text not null,
  output      text not null,
  explanation text,
  unique (problem_id, position)
);

-- ---------- ENVÍOS DE SOLUCIONES ----------
create table public.submissions (
  id          bigint generated always as identity primary key,
  user_id     uuid   not null references public.profiles(id) on delete cascade,
  problem_id  bigint not null references public.problems(id) on delete cascade,
  language    text   not null check (language in ('python','cpp','java','javascript')),
  source_code text   not null,
  verdict     text   not null default 'pending'
              check (verdict in ('pending','accepted','wrong_answer','time_limit','runtime_error','compilation_error')),
  runtime_ms  int,
  created_at  timestamptz not null default now()
);
create index submissions_user_problem_idx on public.submissions (user_id, problem_id);
create index submissions_problem_idx      on public.submissions (problem_id);

-- ---------- VISTA DE PROGRESO (respeta RLS del usuario) ----------
create view public.user_progress with (security_invoker = true) as
select user_id,
       problem_id,
       bool_or(verdict = 'accepted')                          as solved,
       count(*)                                               as attempts,
       min(created_at) filter (where verdict = 'accepted')    as first_solved_at
from public.submissions
group by user_id, problem_id;
