"use client";

import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { useToasts } from "@/app/providers";

type Status = "idle" | "loading" | "done";

export function ContactForm() {
  const { notify } = useToasts();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextErrors: Record<string, string> = {};
    if (!String(data.get("name") ?? "").trim()) nextErrors.name = "Este campo es obligatorio.";
    const email = String(data.get("email") ?? "");
    if (!email.trim()) nextErrors.email = "Este campo es obligatorio.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Escribe un email válido.";
    if (!String(data.get("message") ?? "").trim()) nextErrors.message = "Este campo es obligatorio.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      notify("Revisa los campos marcados.", { tone: "error" });
      return;
    }

    setStatus("loading");
    await new Promise((r) => setTimeout(r, 800)); // ← aquí irá supabase.from("inquiries").insert(...)
    setStatus("done");
    notify("Mensaje enviado.");
  };

  if (status === "done") {
    return (
      <div className="rule flex flex-col items-start gap-3 py-14">
        <span className="flex h-10 w-10 items-center justify-center rounded-pill bg-ink text-paper">
          <Check aria-hidden className="h-5 w-5" />
        </span>
        <h2 className="display-sm">Mensaje enviado</h2>
        <p className="lede">Te respondemos en menos de 24 horas laborables.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Field label="Nombre *" htmlFor="k-name" error={errors.name}>
        <Input id="k-name" name="name" required autoComplete="name" aria-invalid={Boolean(errors.name)} />
      </Field>
      <Field label="Email *" htmlFor="k-email" error={errors.email}>
        <Input id="k-email" name="email" type="email" required autoComplete="email" aria-invalid={Boolean(errors.email)} />
      </Field>
      <Field label="Mensaje *" htmlFor="k-msg" error={errors.message}>
        <Textarea id="k-msg" name="message" required placeholder="¿En qué podemos ayudarte?" aria-invalid={Boolean(errors.message)} />
      </Field>
      <Button type="submit" size="lg" loading={status === "loading"}>
        Enviar mensaje
      </Button>
    </form>
  );
}
