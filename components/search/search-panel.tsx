"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Select } from "@/components/ui/field";
import { brands, modelsByBrand } from "@/data/cars";
import { filtersToQuery } from "@/lib/filters";
import type { CarFilters } from "@/types/car";
import { cn } from "@/lib/utils";

const PRICE_STEPS = [10000, 15000, 20000, 25000, 30000, 40000, 50000, 70000];
const MILEAGE_STEPS = [20000, 40000, 60000, 80000, 120000];
const YEAR_STEPS = [2018, 2019, 2020, 2021, 2022, 2023];
const FUELS = ["Gasolina", "Diésel", "Híbrido", "Híbrido enchufable", "Eléctrico"] as const;

export function SearchPanel({ className }: { className?: string }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [state, setState] = useState<CarFilters>({});

  const models = useMemo(
    () => (state.brand?.[0] ? (modelsByBrand[state.brand[0]] ?? []) : []),
    [state.brand],
  );

  const set = (patch: Partial<CarFilters>) => setState((prev) => ({ ...prev, ...patch }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const query = filtersToQuery(state);
    router.push(query ? `/coches?${query}` : "/coches");
  };

  return (
    <form
      onSubmit={submit}
      aria-label="Búsqueda de coches"
      className={cn("rounded-md border border-line bg-paper p-4 sm:p-5", className)}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] lg:items-end lg:gap-3">
        <Field label="Marca" htmlFor="q-brand">
          <Select
            id="q-brand"
            value={state.brand?.[0] ?? ""}
            onChange={(e) => set({ brand: e.target.value ? [e.target.value] : undefined, model: undefined })}
          >
            <option value="">Todas</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Modelo" htmlFor="q-model">
          <Select
            id="q-model"
            disabled={models.length === 0}
            value={state.model?.[0] ?? ""}
            onChange={(e) => set({ model: e.target.value ? [e.target.value] : undefined })}
          >
            <option value="">{models.length ? "Todos" : "Elige marca"}</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Precio máximo" htmlFor="q-price">
          <Select
            id="q-price"
            value={state.maxPrice ?? ""}
            onChange={(e) => set({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
          >
            <option value="">Sin límite</option>
            {PRICE_STEPS.map((price) => (
              <option key={price} value={price}>
                Hasta {new Intl.NumberFormat("es-ES").format(price)} €
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Combustible" htmlFor="q-fuel">
          <Select
            id="q-fuel"
            value={state.fuel?.[0] ?? ""}
            onChange={(e) =>
              set({ fuel: e.target.value ? ([e.target.value] as CarFilters["fuel"]) : undefined })
            }
          >
            <option value="">Cualquiera</option>
            {FUELS.map((fuel) => (
              <option key={fuel} value={fuel}>
                {fuel}
              </option>
            ))}
          </Select>
        </Field>

        <Button type="submit" size="lg" className="h-11 w-full lg:w-auto lg:px-6">
          <Search aria-hidden className="h-4 w-4" />
          Buscar coches
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            key="advanced"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-3 pt-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Cambio" htmlFor="q-transmission">
                <Select
                  id="q-transmission"
                  value={state.transmission?.[0] ?? ""}
                  onChange={(e) =>
                    set({
                      transmission: e.target.value
                        ? ([e.target.value] as CarFilters["transmission"])
                        : undefined,
                    })
                  }
                >
                  <option value="">Cualquiera</option>
                  <option value="Automático">Automático</option>
                  <option value="Manual">Manual</option>
                </Select>
              </Field>

              <Field label="Kilómetros máximos" htmlFor="q-mileage">
                <Select
                  id="q-mileage"
                  value={state.maxMileage ?? ""}
                  onChange={(e) => set({ maxMileage: e.target.value ? Number(e.target.value) : undefined })}
                >
                  <option value="">Sin límite</option>
                  {MILEAGE_STEPS.map((km) => (
                    <option key={km} value={km}>
                      Hasta {new Intl.NumberFormat("es-ES").format(km)} km
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Año mínimo" htmlFor="q-year">
                <Select
                  id="q-year"
                  value={state.minYear ?? ""}
                  onChange={(e) => set({ minYear: e.target.value ? Number(e.target.value) : undefined })}
                >
                  <option value="">Cualquiera</option>
                  {YEAR_STEPS.map((year) => (
                    <option key={year} value={year}>
                      Desde {year}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Carrocería" htmlFor="q-body">
                <Select
                  id="q-body"
                  value={state.bodyType?.[0] ?? ""}
                  onChange={(e) =>
                    set({
                      bodyType: e.target.value ? ([e.target.value] as CarFilters["bodyType"]) : undefined,
                    })
                  }
                >
                  <option value="">Cualquiera</option>
                  {["Berlina", "SUV", "Compacto", "Familiar", "Coupé"].map((body) => (
                    <option key={body} value={body}>
                      {body}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="mt-4 inline-flex items-center gap-2 text-[0.8125rem] text-graphite transition-colors hover:text-ink"
      >
        <SlidersHorizontal aria-hidden className="h-3.5 w-3.5" />
        {expanded ? "Menos opciones" : "Más opciones"}
      </button>
    </form>
  );
}
