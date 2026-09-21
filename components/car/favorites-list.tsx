"use client";

import Link from "next/link";
import { useFavorites } from "@/app/providers";
import { CarGrid } from "@/components/car/car-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CarCardSkeleton } from "@/components/ui/skeleton";
import { cars } from "@/data/cars";

export function FavoritesList() {
  const { favorites, ready } = useFavorites();
  const items = cars.filter((c) => favorites.includes(c.id));

  if (!ready) {
    return (
      <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <CarCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Guarda tus coches favoritos y vuelve a ellos cuando quieras"
        description="Toca el corazón en cualquier ficha y aparecerá aquí."
        action={
          <Button asChild>
            <Link href="/coches">Ver coches</Link>
          </Button>
        }
      />
    );
  }

  return <CarGrid cars={items} />;
}
