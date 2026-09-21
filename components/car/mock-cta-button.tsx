"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useToasts } from "@/app/providers";

/**
 * Todas las acciones de compra (solicitar información, comprar, reservar)
 * no tienen backend todavía. En lugar de un botón que no hace nada, simulan
 * el viaje completo: carga → confirmación → aviso. El día que exista
 * `POST /api/inquiries`, solo cambia el contenido de `onRun`.
 */
export function MockCtaButton({
  toastMessage,
  doneLabel = "Hecho",
  children,
  onRun,
  ...props
}: Omit<ButtonProps, "loading" | "onClick"> & {
  toastMessage: string;
  doneLabel?: string;
  onRun?: () => void;
}) {
  const { notify } = useToasts();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  return (
    <Button
      {...props}
      loading={state === "loading"}
      onClick={async () => {
        setState("loading");
        await new Promise((r) => setTimeout(r, 700));
        setState("done");
        notify(`${toastMessage} (simulado: todavía no hay backend conectado).`);
        onRun?.();
        setTimeout(() => setState("idle"), 2200);
      }}
    >
      {state === "done" ? (
        <>
          <Check aria-hidden className="h-4 w-4" />
          {doneLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
