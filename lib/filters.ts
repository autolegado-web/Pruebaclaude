import type { Car, CarFilters, SortKey } from "@/types/car";
import { slugify } from "@/lib/utils";

export const PAGE_SIZE = 12;

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "relevancia", label: "Relevancia" },
  { value: "precio-asc", label: "Precio más bajo" },
  { value: "precio-desc", label: "Precio más alto" },
  { value: "nuevos", label: "Más recientes" },
  { value: "km-asc", label: "Menos kilómetros" },
];

/* ------------------------------------------------------------------ */
/* Búsqueda libre                                                      */
/* ------------------------------------------------------------------ */

function haystack(car: Car): string {
  return slugify(
    [car.brand, car.model, car.version, car.bodyType, car.fuel, car.transmission, car.location, car.year].join(" "),
  );
}

/** Acepta "bmw", "bmw serie 3", "mercedes automático", "suv eléctrico"… */
export function matchesQuery(car: Car, query: string): boolean {
  const terms = slugify(query).split("-").filter(Boolean);
  if (terms.length === 0) return true;
  const target = haystack(car);
  return terms.every((term) => target.includes(term));
}

/* ------------------------------------------------------------------ */
/* Filtros                                                             */
/* ------------------------------------------------------------------ */

export function applyFilters(cars: Car[], filters: CarFilters): Car[] {
  return cars.filter((car) => {
    if (filters.q && !matchesQuery(car, filters.q)) return false;
    if (filters.brand?.length && !filters.brand.includes(car.brand)) return false;
    if (filters.model?.length && !filters.model.includes(car.model)) return false;
    if (filters.minPrice != null && car.price < filters.minPrice) return false;
    if (filters.maxPrice != null && car.price > filters.maxPrice) return false;
    if (filters.minYear != null && car.year < filters.minYear) return false;
    if (filters.maxMileage != null && car.mileage > filters.maxMileage) return false;
    if (filters.minPower != null && car.power < filters.minPower) return false;
    if (filters.fuel?.length && !filters.fuel.includes(car.fuel)) return false;
    if (filters.transmission?.length && !filters.transmission.includes(car.transmission)) return false;
    if (filters.bodyType?.length && !filters.bodyType.includes(car.bodyType)) return false;
    if (filters.environmentalLabel?.length && !filters.environmentalLabel.includes(car.environmentalLabel))
      return false;
    if (filters.location?.length && !filters.location.includes(car.location)) return false;
    return true;
  });
}

/** Relevancia: primero lo revisado y reciente, con algo de peso al precio. */
function relevanceScore(car: Car): number {
  const ageDays = (Date.now() - new Date(car.listedAt).getTime()) / 86_400_000;
  return (car.verified ? 40 : 0) + Math.max(0, 40 - ageDays) + (car.previousPrice ? 12 : 0);
}

export function sortCars(cars: Car[], sort: SortKey = "relevancia"): Car[] {
  const list = [...cars];
  switch (sort) {
    case "precio-asc":
      return list.sort((a, b) => a.price - b.price);
    case "precio-desc":
      return list.sort((a, b) => b.price - a.price);
    case "nuevos":
      return list.sort((a, b) => +new Date(b.listedAt) - +new Date(a.listedAt));
    case "km-asc":
      return list.sort((a, b) => a.mileage - b.mileage);
    default:
      return list.sort((a, b) => relevanceScore(b) - relevanceScore(a));
  }
}

export interface SearchResult {
  items: Car[];
  total: number;
  page: number;
  totalPages: number;
}

export function searchCars(cars: Car[], filters: CarFilters): SearchResult {
  const filtered = sortCars(applyFilters(cars, filters), filters.sort);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, filters.page ?? 1), totalPages);
  return {
    items: filtered.slice(0, page * PAGE_SIZE),
    total: filtered.length,
    page,
    totalPages,
  };
}

/* ------------------------------------------------------------------ */
/* URL <-> filtros (búsquedas compartibles)                            */
/* ------------------------------------------------------------------ */

type RawParams = Record<string, string | string[] | undefined>;

function list(value: string | string[] | undefined): string[] | undefined {
  if (!value) return undefined;
  const items = (Array.isArray(value) ? value : value.split(",")).map((v) => v.trim()).filter(Boolean);
  return items.length ? items : undefined;
}

function num(value: string | string[] | undefined): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw == null || raw === "") return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseFilters(params: RawParams): CarFilters {
  const sort = (Array.isArray(params.sort) ? params.sort[0] : params.sort) as SortKey | undefined;
  return {
    q: (Array.isArray(params.q) ? params.q[0] : params.q) || undefined,
    brand: list(params.brand),
    model: list(params.model),
    minPrice: num(params.minPrice),
    maxPrice: num(params.maxPrice),
    minYear: num(params.minYear),
    maxMileage: num(params.maxMileage),
    minPower: num(params.minPower),
    fuel: list(params.fuel) as CarFilters["fuel"],
    transmission: list(params.transmission) as CarFilters["transmission"],
    bodyType: list(params.bodyType) as CarFilters["bodyType"],
    environmentalLabel: list(params.environmentalLabel) as CarFilters["environmentalLabel"],
    location: list(params.location),
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? sort : "relevancia",
    page: num(params.page) ?? 1,
  };
}

export function filtersToQuery(filters: CarFilters): string {
  const search = new URLSearchParams();
  const put = (key: string, value: unknown) => {
    if (value == null) return;
    if (Array.isArray(value)) {
      if (value.length) search.set(key, value.join(","));
      return;
    }
    if (value === "" ) return;
    search.set(key, String(value));
  };

  put("q", filters.q);
  put("brand", filters.brand);
  put("model", filters.model);
  put("minPrice", filters.minPrice);
  put("maxPrice", filters.maxPrice);
  put("minYear", filters.minYear);
  put("maxMileage", filters.maxMileage);
  put("minPower", filters.minPower);
  put("fuel", filters.fuel);
  put("transmission", filters.transmission);
  put("bodyType", filters.bodyType);
  put("environmentalLabel", filters.environmentalLabel);
  put("location", filters.location);
  if (filters.sort && filters.sort !== "relevancia") put("sort", filters.sort);
  if (filters.page && filters.page > 1) put("page", filters.page);

  return search.toString();
}

/** Cuenta los filtros activos (sin contar orden, página ni búsqueda). */
export function countActiveFilters(filters: CarFilters): number {
  const keys: (keyof CarFilters)[] = [
    "brand", "model", "minPrice", "maxPrice", "minYear", "maxMileage",
    "minPower", "fuel", "transmission", "bodyType", "environmentalLabel", "location",
  ];
  return keys.reduce((total, key) => {
    const value = filters[key];
    if (value == null) return total;
    if (Array.isArray(value)) return total + value.length;
    return total + 1;
  }, 0);
}

/** Resumen legible de una búsqueda guardada: "BMW · Serie 3 · hasta 35.000 €". */
export function describeFilters(filters: CarFilters): string {
  const parts: string[] = [];
  if (filters.q) parts.push(`“${filters.q}”`);
  if (filters.brand?.length) parts.push(filters.brand.join(", "));
  if (filters.model?.length) parts.push(filters.model.join(", "));
  if (filters.bodyType?.length) parts.push(filters.bodyType.join(", "));
  if (filters.fuel?.length) parts.push(filters.fuel.join(", "));
  if (filters.maxPrice) parts.push(`hasta ${new Intl.NumberFormat("es-ES").format(filters.maxPrice)} €`);
  if (filters.minYear) parts.push(`desde ${filters.minYear}`);
  if (filters.maxMileage) parts.push(`menos de ${new Intl.NumberFormat("es-ES").format(filters.maxMileage)} km`);
  return parts.length ? parts.join(" · ") : "Todos los coches";
}
