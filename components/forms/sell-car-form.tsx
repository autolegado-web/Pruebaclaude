"use client";

import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { useToasts } from "@/app/providers";
import { brands } from "@/data/cars";

const FUELS = ["Gasolina", "Diésel", "Híbrido", "Híbrido enchufable", "Eléctrico"];
const TRANSMISSIONS = ["Manual", "Automático"];

type Status = "idle" | "loading" | "done";

export function SellCarForm() {
  const { notify } = useToasts();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const required = ["brand", "model", "year", "km", "fuel", "transmission", "name", "email"];
    const nextErrors: Record<string, string> = {};
    for (const field of required) {
      if (!String(data.get(field) ?? "").trim()) nextErrors[field] = "Este campo es obligatorio.";
    }
    const email = String(data.get("email") ?? "");
    if (email && !/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Escribe un email válido.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      notify("Revisa los campos marcados.", { tone: "error" });
      return;
    }

    setStatus("loading");
    await new Promise((r) => setTimeout(r, 900)); // ← aquí irá supabase.from("sell_requests").insert(...)
    setStatus("done");
    notify("Solicitud de valoración enviada.");
  };

  if (status === "done") {
    return (
      <div className="rule flex flex-col items-start gap-3 py-16">
        <span className="flex h-10 w-10 items-center justify-center rounded-pill bg-ink text-paper">
          <Check aria-hidden className="h-5 w-5" />
        </span>
        <h2 className="display-sm">Solicitud recibida</h2>
        <p className="lede">
          Te responderemos en menos de 24 horas laborables. Este prototipo no envía nada todavía: el
          formulario está listo para conectarse a Supabase.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Marca *" htmlFor="s-brand" error={errors.brand}>
          <Select id="s-brand" name="brand" required aria-invalid={Boolean(errors.brand)}>
            <option value="">Selecciona</option>
            {brands.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </Select>
        </Field>
        <Field label="Modelo *" htmlFor="s-model" error={errors.model}>
          <Input id="s-model" name="model" required placeholder="Serie 3" aria-invalid={Boolean(errors.model)} />
        </Field>
        <Field label="Versión" htmlFor="s-version">
          <Input id="s-version" name="version" placeholder="320d M Sport" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Año *" htmlFor="s-year" error={errors.year}>
          <Input id="s-year" name="year" type="number" min={1990} max={2026} required placeholder="2022" data-numeric aria-invalid={Boolean(errors.year)} />
        </Field>
        <Field label="Kilómetros *" htmlFor="s-km" error={errors.km}>
          <Input id="s-km" name="km" type="number" min={0} required placeholder="48500" data-numeric aria-invalid={Boolean(errors.km)} />
        </Field>
        <Field label="Matrícula" htmlFor="s-plate">
          <Input id="s-plate" name="plate" placeholder="0000 ABC" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Combustible *" htmlFor="s-fuel" error={errors.fuel}>
          <Select id="s-fuel" name="fuel" required aria-invalid={Boolean(errors.fuel)}>
            <option value="">Selecciona</option>
            {FUELS.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </Select>
        </Field>
        <Field label="Cambio *" htmlFor="s-trans" error={errors.transmission}>
          <Select id="s-trans" name="transmission" required aria-invalid={Boolean(errors.transmission)}>
            <option value="">Selecciona</option>
            {TRANSMISSIONS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </Field>
        <Field label="Estado general" htmlFor="s-state">
          <Select id="s-state" name="state" defaultValue="Buen estado">
            <option>Como nuevo</option>
            <option>Buen estado</option>
            <option>Con detalles a reparar</option>
          </Select>
        </Field>
      </div>

      <Field label="Fotos o comentarios" htmlFor="s-notes" hint="En producción aquí se suben fotos del vehículo.">
        <Textarea id="s-notes" name="notes" placeholder="Cuéntanos golpes, reparaciones recientes o extras." />
      </Field>

      <hr className="border-line" />

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Nombre *" htmlFor="s-name" error={errors.name}>
          <Input id="s-name" name="name" required autoComplete="name" aria-invalid={Boolean(errors.name)} />
        </Field>
        <Field label="Email *" htmlFor="s-email" error={errors.email}>
          <Input id="s-email" name="email" type="email" required autoComplete="email" aria-invalid={Boolean(errors.email)} />
        </Field>
        <Field label="Teléfono" htmlFor="s-phone">
          <Input id="s-phone" name="phone" type="tel" autoComplete="tel" />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <Button type="submit" size="lg" loading={status === "loading"}>
          Solicitar valoración
        </Button>
        <p className="meta max-w-[38ch]">Al enviar aceptas que contactemos contigo sobre esta valoración.</p>
      </div>
    </form>
  );
}
