"use client";

import { useState, type FormEvent } from "react";
import { Bell, Mail, Smartphone, Trash2 } from "lucide-react";
import { useSavedSearches, type SavedSearch } from "@/app/providers";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/empty-state";
import { brands } from "@/data/cars";
import { describeFilters } from "@/lib/filters";

export function AlertsManager() {
  const { searches, save, remove } = useSavedSearches();

  return (
    <div className="grid gap-14 lg:grid-cols-[1fr_20rem]">
      <div>
        <h2 className="text-[1.0625rem] font-medium">Tus alertas</h2>
        {searches.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="Todavía no tienes alertas"
              description="Crea una a la derecha: te avisaríamos cuando entre un coche que encaje."
            />
          </div>
        ) : (
          <ul className="mt-4">
            {searches.map((s) => (
              <li key={s.id} className="rule flex items-start justify-between gap-4 py-5 first:border-t-0">
                <div>
                  <p className="flex items-center gap-2 text-[0.9375rem] font-medium">
                    <Bell aria-hidden className="h-4 w-4 text-graphite" />
                    {s.name}
                  </p>
                  <p className="mt-1 text-[0.8125rem] text-graphite">{describeFilters(s.filters)}</p>
                  <p className="mt-2 flex items-center gap-3 text-[0.75rem] text-graphite">
                    {s.channels.email ? (
                      <span className="inline-flex items-center gap-1">
                        <Mail aria-hidden className="h-3.5 w-3.5" /> Email
                      </span>
                    ) : null}
                    {s.channels.push ? (
                      <span className="inline-flex items-center gap-1">
                        <Smartphone aria-hidden className="h-3.5 w-3.5" /> Push
                      </span>
                    ) : null}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(s.id)}
                  aria-label={`Eliminar alerta ${s.name}`}
                  className="rounded-sm p-2 text-graphite transition-colors hover:bg-bone hover:text-[var(--color-alert)]"
                >
                  <Trash2 aria-hidden className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <NewAlertForm onSave={save} />
    </div>
  );
}

function NewAlertForm({ onSave }: { onSave: (s: Omit<SavedSearch, "id" | "createdAt">) => void }) {
  const [brand, setBrand] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minYear, setMinYear] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim() || "Nueva alerta";
    const filters = {
      brand: brand ? [brand] : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minYear: minYear ? Number(minYear) : undefined,
    };
    onSave({
      name,
      query: "",
      filters,
      channels: { email: data.get("email") === "on", push: data.get("push") === "on" },
    });
    event.currentTarget.reset();
    setBrand("");
    setMaxPrice("");
    setMinYear("");
  };

  return (
    <form onSubmit={onSubmit} className="h-fit rounded-lg border border-line p-6">
      <h2 className="text-[0.9375rem] font-medium">Crear alerta</h2>
      <div className="mt-5 space-y-4">
        <Field label="Nombre de la alerta" htmlFor="a-name">
          <Input id="a-name" name="name" placeholder="BMW Serie 3 hasta 35.000 €" />
        </Field>
        <Field label="Marca" htmlFor="a-brand">
          <Select id="a-brand" value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="">Cualquiera</option>
            {brands.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Precio máximo" htmlFor="a-price">
            <Input
              id="a-price"
              type="number"
              inputMode="numeric"
              data-numeric
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="35000"
            />
          </Field>
          <Field label="Desde año" htmlFor="a-year">
            <Input
              id="a-year"
              type="number"
              inputMode="numeric"
              data-numeric
              value={minYear}
              onChange={(e) => setMinYear(e.target.value)}
              placeholder="2021"
            />
          </Field>
        </div>
        <div className="flex flex-col gap-2 pt-1 text-[0.875rem]">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="email" defaultChecked className="h-4 w-4 accent-ink" />
            Avisar por email
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="push" className="h-4 w-4 accent-ink" />
            Avisar por notificación push
          </label>
        </div>
      </div>
      <Button type="submit" block className="mt-6">
        Guardar alerta
      </Button>
      <p className="meta mt-3">Las notificaciones reales llegarán cuando se conecte el envío por email y push.</p>
    </form>
  );
}
