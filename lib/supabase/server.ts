import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Cliente para Server Components, Route Handlers y Server Actions. Lee y
 * escribe la sesión a través de las cookies de la petición, siguiendo el
 * patrón oficial de @supabase/ssr para el App Router.
 *
 * En un Server Component puro, `cookies().set()` no está permitido (Next lo
 * ignora silenciosamente); por eso el `catch` vacío en `setAll`. El
 * refresco real de sesión ocurre en middleware.ts.
 */
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase no está configurado. Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY (ver .env.example).",
    );
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Llamado desde un Server Component: la sesión se refresca en middleware.ts.
        }
      },
    },
  });
}

/**
 * Cliente con la service role key: se salta RLS por completo. Solo para
 * Route Handlers/Server Actions de administración, nunca para código que
 * pueda ejecutarse en el navegador (por eso no se prefija NEXT_PUBLIC_).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY (ver .env.example).");
  }

  return createServerClient<Database>(url, serviceKey, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}
