"use client";

import { FilterFields } from "@/components/search/filter-fields";
import { useCarFilters } from "@/lib/use-car-filters";

export function FilterSidebar() {
  const { filters, update, clearAll } = useCarFilters();

  return (
    <aside className="hidden lg:block" aria-label="Filtros">
      <div className="sticky top-24 max-h-[calc(100svh-7rem)] overflow-y-auto pb-8 pr-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[0.9375rem] font-medium">Filtrar</h2>
          <button
            type="button"
            onClick={clearAll}
            className="text-[0.8125rem] text-graphite underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
          >
            Limpiar
          </button>
        </div>
        <div className="mt-5">
          <FilterFields value={filters} onChange={update} />
        </div>
      </div>
    </aside>
  );
}
