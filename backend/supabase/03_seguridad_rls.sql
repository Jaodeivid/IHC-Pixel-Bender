-- =====================================================================
-- Codeforces (prototipo IHC) · Supabase · Seguridad (RLS)
-- Row Level Security y políticas de acceso.
-- Ejecutar en Supabase → SQL Editor, respetando el orden 01 → 04.
-- =====================================================================

-- ---------- SEGURIDAD (Row Level Security) ----------
alter table public.profiles          enable row level security;
alter table public.problems          enable row level security;
alter table public.tags              enable row level security;
alter table public.problem_tags      enable row level security;
alter table public.problem_examples  enable row level security;
alter table public.submissions       enable row level security;

-- Perfiles: nombre de usuario público, edición solo del propio
create policy "perfiles visibles"  on public.profiles for select using (true);
create policy "editar mi perfil"   on public.profiles for update
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Catálogo: lectura pública (visitantes pueden navegar), escritura solo con clave de servicio
create policy "problemas públicos" on public.problems         for select using (true);
create policy "etiquetas públicas" on public.tags             for select using (true);
create policy "problem_tags públicos" on public.problem_tags  for select using (true);
create policy "ejemplos públicos"  on public.problem_examples for select using (true);

-- Envíos: cada usuario ve y crea solo los suyos; el veredicto lo pone el juez (servidor)
create policy "ver mis envíos"  on public.submissions for select using (user_id = (select auth.uid()));
create policy "crear mis envíos" on public.submissions for insert
  with check (user_id = (select auth.uid()) and verdict = 'pending');
