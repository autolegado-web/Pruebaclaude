import type { Metadata } from "next";
import Link from "next/link";
import { ActiveFilters } from "@/components/search/active-filters";
import { CatalogSearch } from "@/components/search/catalog-search";
import { FilterDrawer } from "@/components/search/filter-drawer";
import { FilterSidebar } from "@/components/search/filter-sidebar";
import { LoadMore } from "@/components/search/load-more";
import { SortSelect } from "@/components/search/sort-select";
import { CarGrid } from "@/components/car/car-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cars } from "@/data/cars";
import { describeFilters, parseFilters, searchCars } from "@/lib/filters";

export const metadata: Metadata = {
  title: "Coches de ocasión y seminuevos",
  description: "Filtra por marca, precio, combustible, cambio y kilómetros. Cada coche revisado, con historial y financiación desde la ficha.",
  alternates: { canonical: "/coches" },
};

type SearchParams = Record<string, string | string[] | undefined>;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const raw = await searchParams;
  const filters = parseFilters(raw);
  const { items, total, page, totalPages } = searchCars(cars, filters);
  const remaining = total - items.length;

  return (
    <div className="page pt-28 pb-24 lg:pt-32">
      <header className="max-w-2xl">
        <h1 className="display-lg text-balance">Coches disponibles</h1>
        <p className="lede mt-4">
          Cada ficha muestra kilómetros, historial y cuota estimada antes de que tengas que preguntar.
        </p>
      </header>

      <div className="mt-10 flex items-center gap-3 lg:hidden">
        <FilterDrawer />
        <div className="ml-auto">
          <SortSelect />
        </div>
      </div>

      <div className="mt-8 grid gap-12 lg:mt-10 lg:grid-cols-[15rem_1fr] lg:gap-10">
        <FilterSidebar />

        <div className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p data-numeric className="display-sm">
                {total} {total === 1 ? "coche" : "coches"}
              </p>
              <p className="meta mt-1">{describeFilters(filters)}</p>
            </div>
            <div className="hidden items-center gap-4 lg:flex">
              <CatalogSearch />
              <SortSelect />
            </div>
          </div>
          <div className="mt-3 sm:hidden">
            <CatalogSearch />
          </div>

          <div className="mt-6">
            <ActiveFilters />
          </div>

          {items.length > 0 ? (
            <>
              <CarGrid cars={items} priorityCount={3} />
              {page < totalPages ? <LoadMore remaining={remaining} /> : null}
            </>
          ) : (
            <EmptyState
              title="Ningún coche coincide con estos filtros"
              description="Prueba a ampliar el precio, quitar una marca o subir el límite de kilómetros."
              action={
                <Button asChild variant="outline">
                  <Link href="/coches">Quitar todos los filtros</Link>
                </Button>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
