"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { filtersToQuery, parseFilters } from "@/lib/filters";
import type { CarFilters } from "@/types/car";

/**
 * Única fuente de verdad para los filtros del catálogo: la URL.
 * Así toda búsqueda es compartible (/coches?brand=BMW&maxPrice=35000) y
 * sobrevive a recargar la página o pegar el enlace en otro sitio.
 */
export function useCarFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseFilters(Object.fromEntries(searchParams.entries())),
    [searchParams],
  );

  const push = useCallback(
    (next: CarFilters) => {
      const query = filtersToQuery(next);
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  /** Cambia uno o varios campos y vuelve a la página 1. */
  const update = useCallback(
    (patch: Partial<CarFilters>) => push({ ...filters, ...patch, page: 1 }),
    [filters, push],
  );

  /** Quita un único filtro (usado por los chips de "filtros activos"). */
  const removeKey = useCallback(
    (key: keyof CarFilters) => {
      const next = { ...filters };
      delete next[key];
      push({ ...next, page: 1 });
    },
    [filters, push],
  );

  const clearAll = useCallback(() => push({ sort: filters.sort }), [filters.sort, push]);

  const setSort = useCallback((sort: CarFilters["sort"]) => push({ ...filters, sort, page: 1 }), [filters, push]);

  const loadMore = useCallback(() => push({ ...filters, page: (filters.page ?? 1) + 1 }), [filters, push]);

  return { filters, update, removeKey, clearAll, setSort, loadMore };
}
