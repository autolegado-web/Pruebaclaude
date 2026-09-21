import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/["'’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const eur = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const decimal = new Intl.NumberFormat("es-ES");

export function formatPrice(value: number): string {
  return eur.format(value);
}

export function formatNumber(value: number): string {
  return decimal.format(value);
}

export function formatMileage(value: number): string {
  return `${decimal.format(value)} km`;
}

export function formatMonthly(value: number): string {
  return `${eur.format(value)}/mes`;
}

/** "hace 3 días", "hoy" — para señalar novedad sin ruido visual. */
export function relativeDays(iso: string, now = new Date()): string {
  const diff = Math.round((now.getTime() - new Date(iso).getTime()) / 86_400_000);
  if (diff <= 0) return "Publicado hoy";
  if (diff === 1) return "Publicado ayer";
  if (diff < 7) return `Publicado hace ${diff} días`;
  if (diff < 14) return "Publicado hace una semana";
  if (diff < 31) return `Publicado hace ${Math.floor(diff / 7)} semanas`;
  return `Publicado hace ${Math.floor(diff / 30)} meses`;
}
