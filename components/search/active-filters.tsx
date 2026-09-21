"use client";

import { X } from "lucide-react";
import { useCarFilters } from "@/lib/use-car-filters";
import type { CarFilters } from "@/types/car";

const fmt = new Intl.NumberFormat("es-ES");

function labelFor(key: keyof CarFilters, value: CarFilters[keyof CarFilters]): string {
  switch (key) {
    case "q":
      return `“${value as string}”`;
    case "brand":
    case "model":
    case "fuel":
    case "transmission":
    case "bodyType":
    case "environmentalLabel":
    case "location":
      return (value as string[]).join(", ");
    case "minPrice":
      return `Desde ${fmt.format(value as number)} €`;
    case "maxPrice":
      return `Hasta ${fmt.format(value as number)} €`;
    case "minYear":
      return `Desde ${value}`;
    case "maxMileage":
      return `Hasta ${fmt.format(value as number)} km`;
    case "minPower":
      return `Desde ${value} CV`;
    default:
      return String(value);
  }
}

const VISIBLE_KEYS: (keyof CarFilters)[] = [
  "q", "brand", "model", "minPrice", "maxPrice", "minYear", "maxMileage",
  "minPower", "fuel", "transmission", "bodyType", "environmentalLabel", "location",
];

export function ActiveFilters() {
  const { filters, removeKey, clearAll } = useCarFilters();
  const active = VISIBLE_KEYS.filter((k) => {
    const v = filters[k];
    return Array.isArray(v) ? v.length > 0 : v != null && v !== "";
  });

  if (active.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2" aria-label="Filtros activos">
      {active.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => removeKey(key)}
          className="inline-flex items-center gap-1.5 rounded-pill bg-bone py-1.5 pl-3 pr-2 text-[0.8125rem] text-ink transition-colors hover:bg-ash"
        >
          {labelFor(key, filters[key])}
          <X aria-hidden className="h-3.5 w-3.5 text-graphite" />
        </button>
      ))}
      <button
        type="button"
        onClick={clearAll}
        className="text-[0.8125rem] text-graphite underline decoration-line underline-offset-4 hover:text-ink hover:decoration-ink"
      >
        Quitar todo
      </button>
    </div>
  );
}
