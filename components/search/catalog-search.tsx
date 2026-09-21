"use client";

import { Search } from "lucide-react";
import { useCarFilters } from "@/lib/use-car-filters";

export function CatalogSearch() {
  const { filters, update } = useCarFilters();

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const q = String(data.get("q") ?? "").trim();
        update({ q: q || undefined });
      }}
      className="relative w-full sm:max-w-xs"
    >
      <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel" />
      <input
        key={filters.q ?? ""}
        type="search"
        name="q"
        defaultValue={filters.q ?? ""}
        placeholder="BMW Serie 3, SUV eléctrico…"
        aria-label="Buscar en el catálogo"
        className="h-10 w-full rounded-sm border border-line-strong bg-paper pl-9 pr-3 text-sm transition-colors placeholder:text-steel hover:border-graphite focus:border-ink focus:outline-none"
      />
    </form>
  );
}
