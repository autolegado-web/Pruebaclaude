"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/app/providers";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  carId,
  label,
  tone = "surface",
  withLabel = false,
  className,
}: {
  carId: string;
  label: string;
  tone?: "surface" | "outline";
  /** Muestra "Guardar" / "Guardado" junto al icono, en vez de un botón circular. */
  withLabel?: boolean;
  className?: string;
}) {
  const { isFavorite, toggle, ready } = useFavorites();
  const active = isFavorite(carId);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(carId, label);
      }}
      aria-pressed={active}
      aria-label={active ? `Quitar ${label} de favoritos` : `Guardar ${label} en favoritos`}
      className={cn(
        "flex items-center justify-center transition-[background-color,color,transform] duration-200 active:scale-95",
        withLabel
          ? "h-11 gap-2 rounded-sm px-4 text-[0.875rem]"
          : "h-9 w-9 rounded-pill",
        tone === "surface"
          ? "bg-paper/85 text-ink backdrop-blur-sm hover:bg-paper"
          : "border border-line-strong text-ink hover:border-ink",
        className,
      )}
    >
      <Heart
        aria-hidden
        className={cn("h-[1.0625rem] w-[1.0625rem] transition-colors", active && ready && "fill-ink")}
        strokeWidth={1.75}
      />
      {withLabel ? <span>{active ? "Guardado" : "Guardar"}</span> : null}
    </button>
  );
}
