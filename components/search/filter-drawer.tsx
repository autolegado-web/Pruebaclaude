"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetClose, SheetTrigger } from "@/components/ui/sheet";
import { FilterFields } from "@/components/search/filter-fields";
import { cars } from "@/data/cars";
import { applyFilters, countActiveFilters } from "@/lib/filters";
import { useCarFilters } from "@/lib/use-car-filters";
import type { CarFilters } from "@/types/car";

export function FilterDrawer() {
  const { filters, update, clearAll } = useCarFilters();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<CarFilters>(filters);

  const active = countActiveFilters(filters);
  const liveCount = applyFilters(cars, pending).length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="md"
          className="lg:hidden"
          onClick={() => setPending(filters)}
        >
          <SlidersHorizontal aria-hidden className="h-4 w-4" />
          Filtrar{active ? ` (${active})` : ""}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        title="Filtrar"
        footer={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                clearAll();
                setOpen(false);
              }}
            >
              Limpiar
            </Button>
            <SheetClose asChild>
              <Button
                block
                size="lg"
                onClick={() => update(pending)}
              >
                Ver coches
              </Button>
            </SheetClose>
          </div>
        }
      >
        <FilterFields value={pending} onChange={(patch) => setPending((prev) => ({ ...prev, ...patch }))} />
        <p className="meta mt-6 pb-2" aria-live="polite">
          {liveCount} {liveCount === 1 ? "coche" : "coches"} con estos filtros
        </p>
      </SheetContent>
    </Sheet>
  );
}
