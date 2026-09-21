"use client";

import { Select } from "@/components/ui/field";
import { SORT_OPTIONS } from "@/lib/filters";
import { useCarFilters } from "@/lib/use-car-filters";

export function SortSelect() {
  const { filters, setSort } = useCarFilters();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="meta shrink-0">
        Ordenar por
      </label>
      <Select
        id="sort"
        className="h-10 w-auto min-w-[9.5rem]"
        value={filters.sort ?? "relevancia"}
        onChange={(e) => setSort(e.target.value as typeof filters.sort)}
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
