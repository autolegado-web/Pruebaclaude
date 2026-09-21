/**
 * Todo el resto de la app (providers.tsx, los formularios) sigue funcionando
 * con localStorage mientras no haya un proyecto Supabase configurado. En
 * cuanto existan estas dos variables de entorno, los repositorios de
 * `lib/supabase/*` quedan listos para usarse: no hace falta cambiar UI.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
