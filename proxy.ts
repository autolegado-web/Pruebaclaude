import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

/**
 * Refresca el token de sesión de Supabase en cada navegación, siguiendo el
 * patrón oficial de @supabase/ssr. Si el proyecto no tiene Supabase
 * configurado (caso por defecto de este prototipo), no hace nada: el resto
 * de la app sigue funcionando con la sesión mock de app/providers.tsx.
 *
 * Next.js 16 renombró `middleware.ts` a `proxy.ts` (y la función exportada
 * de `middleware` a `proxy`); la firma y el comportamiento no cambian.
 */
export async function proxy(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"],
};
