"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Cliente para componentes cliente ("use client"). Usa la clave anon: solo
 * puede hacer lo que las políticas RLS de supabase/migrations/0001_init.sql
 * permitan para el usuario autenticado (o para "anon" si no hay sesión).
 *
 * Lanza un error explícito si se llama sin configurar el proyecto, en vez
 * de fallar de forma confusa más abajo. Comprueba `isSupabaseConfigured()`
 * antes de llamar a esta función si el flujo debe degradar con elegancia.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase no está configurado. Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY (ver .env.example).",
    );
  }

  return createBrowserClient<Database>(url, anonKey);
}
