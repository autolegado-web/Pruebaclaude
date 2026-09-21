"use client";

import { useMemo } from "react";
import { CheckboxRow } from "@/components/ui/checkbox";
import { Field, Select } from "@/components/ui/field";
import { brands, cars, locations, modelsByBrand } from "@/data/cars";
import type { CarFilters } from "@/types/car";

const PRICE_STEPS = [10000, 15000, 20000, 25000, 30000, 40000, 50000, 70000, 100000];
const MILEAGE_STEPS = [20000, 40000, 60000, 80000, 100000, 120000];
const YEAR_STEPS = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
const POWER_STEPS = [100, 150, 200, 240, 300, 400];
const FUELS = ["Gasolina", "Diésel", "Híbrido", "Híbrido enchufable", "Eléctrico"] as const;
const TRANSMISSIONS = ["Manual", "Automático"] as const;
const BODY_TYPES = ["Compacto", "Berlina", "Familiar", "SUV", "Coupé"] as const;
const LABELS = ["0", "ECO", "C", "B"] as const;

function fmtPrice(n: number) {
  return new Intl.NumberFormat("es-ES").format(n);
}

/** Cuenta cuántos coches cumplirían un valor concreto, dado el resto de filtros. Ayuda a decidir, no decora. */
function countWith(base: CarFilters, patch: Partial<CarFilters>): number {
  const merged = { ...base, ...patch };
  return cars.filter((car) => {
    if (merged.brand?.length && !merged.brand.includes(car.brand)) return false;
    if (merged.fuel?.length && !merged.fuel.includes(car.fuel)) return false;
    if (merged.transmission?.length && !merged.transmission.includes(car.transmission)) return false;
    if (merged.bodyType?.length && !merged.bodyType.includes(car.bodyType)) return false;
    if (merged.environmentalLabel?.length && !merged.environmentalLabel.includes(car.environmentalLabel))
      return false;
    return true;
  }).length;
}

export function FilterFields({
  value,
  onChange,
}: {
  value: CarFilters;
  onChange: (patch: Partial<CarFilters>) => void;
}) {
  const models = useMemo(
    () => (value.brand?.[0] ? (modelsByBrand[value.brand[0]] ?? []) : []),
    [value.brand],
  );

  const toggle = <K extends "fuel" | "transmission" | "bodyType" | "environmentalLabel">(
    key: K,
    item: string,
  ) => {
    const current = (value[key] as string[] | undefined) ?? [];
    const next = current.includes(item) ? current.filter((v) => v !== item) : [...current, item];
    onChange({ [key]: next.length ? next : undefined } as Partial<CarFilters>);
  };

  return (
    <div className="space-y-7">
      <div className="grid gap-3">
        <Field label="Marca" htmlFor="f-brand">
          <Select
            id="f-brand"
            value={value.brand?.[0] ?? ""}
            onChange={(e) => onChange({ brand: e.target.value ? [e.target.value] : undefined, model: undefined })}
          >
            <option value="">Todas</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Modelo" htmlFor="f-model">
          <Select
            id="f-model"
            disabled={models.length === 0}
            value={value.model?.[0] ?? ""}
            onChange={(e) => onChange({ model: e.target.value ? [e.target.value] : undefined })}
          >
            <option value="">{models.length ? "Todos" : "Elige marca primero"}</option>
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="rule pt-6">
        <p className="text-[0.8125rem] font-medium text-ink">Precio</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Field label="Mínimo" htmlFor="f-minp">
            <Select
              id="f-minp"
              value={value.minPrice ?? ""}
              onChange={(e) => onChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
            >
              <option value="">Sin mínimo</option>
              {PRICE_STEPS.map((p) => (
                <option key={p} value={p} disabled={Boolean(value.maxPrice && p >= value.maxPrice)}>
                  {fmtPrice(p)} €
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Máximo" htmlFor="f-maxp">
            <Select
              id="f-maxp"
              value={value.maxPrice ?? ""}
              onChange={(e) => onChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            >
              <option value="">Sin máximo</option>
              {PRICE_STEPS.map((p) => (
                <option key={p} value={p} disabled={Boolean(value.minPrice && p <= value.minPrice)}>
                  {fmtPrice(p)} €
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </div>

      <div className="rule pt-6">
        <p className="text-[0.8125rem] font-medium text-ink">Año y kilómetros</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Field label="Desde año" htmlFor="f-year">
            <Select
              id="f-year"
              value={value.minYear ?? ""}
              onChange={(e) => onChange({ minYear: e.target.value ? Number(e.target.value) : undefined })}
            >
              <option value="">Cualquiera</option>
              {YEAR_STEPS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Hasta km" htmlFor="f-km">
            <Select
              id="f-km"
              value={value.maxMileage ?? ""}
              onChange={(e) => onChange({ maxMileage: e.target.value ? Number(e.target.value) : undefined })}
            >
              <option value="">Sin límite</option>
              {MILEAGE_STEPS.map((k) => (
                <option key={k} value={k}>
                  {fmtPrice(k)}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </div>

      <div className="rule pt-6">
        <p className="mb-2 text-[0.8125rem] font-medium text-ink">Combustible</p>
        {FUELS.map((f) => (
          <CheckboxRow
            key={f}
            id={`f-fuel-${f}`}
            label={f}
            count={countWith(value, { fuel: [f] })}
            checked={Boolean(value.fuel?.includes(f))}
            onCheckedChange={() => toggle("fuel", f)}
          />
        ))}
      </div>

      <div className="rule pt-6">
        <p className="mb-2 text-[0.8125rem] font-medium text-ink">Cambio</p>
        {TRANSMISSIONS.map((t) => (
          <CheckboxRow
            key={t}
            id={`f-trans-${t}`}
            label={t}
            count={countWith(value, { transmission: [t] })}
            checked={Boolean(value.transmission?.includes(t))}
            onCheckedChange={() => toggle("transmission", t)}
          />
        ))}
      </div>

      <div className="rule pt-6">
        <p className="mb-2 text-[0.8125rem] font-medium text-ink">Carrocería</p>
        {BODY_TYPES.map((b) => (
          <CheckboxRow
            key={b}
            id={`f-body-${b}`}
            label={b}
            count={countWith(value, { bodyType: [b] })}
            checked={Boolean(value.bodyType?.includes(b))}
            onCheckedChange={() => toggle("bodyType", b)}
          />
        ))}
      </div>

      <div className="rule pt-6">
        <p className="mb-2 text-[0.8125rem] font-medium text-ink">Etiqueta ambiental</p>
        <div className="flex flex-wrap gap-2">
          {LABELS.map((l) => {
            const active = Boolean(value.environmentalLabel?.includes(l));
            return (
              <button
                key={l}
                type="button"
                onClick={() => toggle("environmentalLabel", l)}
                aria-pressed={active}
                className={
                  "h-8 rounded-pill border px-3 text-[0.75rem] font-medium transition-colors " +
                  (active ? "border-ink bg-ink text-paper" : "border-line-strong text-graphite hover:border-ink hover:text-ink")
                }
              >
                {l}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rule pt-6">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Desde CV" htmlFor="f-power">
            <Select
              id="f-power"
              value={value.minPower ?? ""}
              onChange={(e) => onChange({ minPower: e.target.value ? Number(e.target.value) : undefined })}
            >
              <option value="">Cualquiera</option>
              {POWER_STEPS.map((p) => (
                <option key={p} value={p}>
                  {p} CV
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Ubicación" htmlFor="f-loc">
            <Select
              id="f-loc"
              value={value.location?.[0] ?? ""}
              onChange={(e) => onChange({ location: e.target.value ? [e.target.value] : undefined })}
            >
              <option value="">Toda España</option>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </div>
    </div>
  );
}
