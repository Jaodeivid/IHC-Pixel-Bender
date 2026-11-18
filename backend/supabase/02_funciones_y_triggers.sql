-- =====================================================================
-- Codeforces (prototipo IHC) · Supabase · Funciones y triggers
-- Perfil automático al registrarse y funciones usadas por el login.
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

revoke all on function public.username_available(text), public.email_by_username(text) from public;
grant execute on function public.username_available(text), public.email_by_username(text) to anon, authenticated;
