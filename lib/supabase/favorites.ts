"use client";

import { createClient } from "@/lib/supabase/client";

/**
 * Mismo contrato que el `favorites` de app/providers.tsx (lista de ids,
 * toggle), pero contra la tabla `favorites` con RLS: cada fila solo es
 * visible o escribible por su propio `user_id` (ver migración 0001).
 *
 * Para pasar los favoritos de localStorage a Supabase, el cambio queda
 * contenido en app/providers.tsx: sustituir `read/write(KEYS.favorites)`
 * por estas tres funciones, sin tocar FavoriteButton ni CarCard.
 */
export async function listFavoriteIds(userId: string): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("favorites").select("car_id").eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).map((row) => row.car_id);
}

export async function addFavorite(userId: string, carId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("favorites").insert({ user_id: userId, car_id: carId });
  if (error) throw error;
}

export async function removeFavorite(userId: string, carId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("car_id", carId);
  if (error) throw error;
}
