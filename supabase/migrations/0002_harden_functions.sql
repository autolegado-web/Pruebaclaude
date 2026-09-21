-- Endurece las dos funciones que el linter de seguridad de Supabase señaló:
-- 1) search_path fijo en ambas (evita que alguien lo manipule vía search_path de sesión).
-- 2) handle_new_user ya no es ejecutable por RPC público/autenticado: solo la dispara
--    el propio trigger de auth.users, que no necesita permiso EXECUTE para hacerlo.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
