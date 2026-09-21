import { cn } from "@/lib/utils";

export const TRUST_POINTS = [
  {
    title: "Vehículo revisado",
    copy: "Revisión mecánica y estética antes de publicarse. Si algo no pasa el punto de control, no entra en el catálogo.",
  },
  {
    title: "Garantía incluida",
    copy: "Cada ficha indica los meses de garantía que acompañan a esa unidad concreta.",
  },
  {
    title: "Historial disponible",
    copy: "Kilometraje, propietarios e informe de mantenimiento a la vista antes de reservar.",
  },
  {
    title: "Financiación a medida",
    copy: "Simula la cuota desde la propia ficha y decide con el número delante.",
  },
  {
    title: "Entrega donde quieras",
    copy: "Recogida en punto AUTORA o entrega en la dirección que nos indiques.",
  },
  {
    title: "Compra segura",
    copy: "Reserva online, documentación gestionada y devolución sujeta a las condiciones del contrato.",
  },
] as const;

export function Trust({
  title = "Compra con confianza",
  lede = "Lo que hacemos antes de que un coche llegue a tu pantalla.",
  className,
  columns = 3,
}: {
  title?: string;
  lede?: string;
  className?: string;
  columns?: 2 | 3;
}) {
  return (
    <section aria-labelledby="trust-title" className={cn("page mt-24 lg:mt-32", className)}>
      <div className="max-w-2xl">
        <h2 id="trust-title" className="display-md text-balance">
          {title}
        </h2>
        <p className="lede mt-4">{lede}</p>
      </div>

      <dl
        className={cn(
          "mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2",
          columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2",
        )}
      >
        {TRUST_POINTS.map((point) => (
          <div key={point.title} className="rule pt-5">
            <dt className="text-[0.9375rem] font-medium tracking-[-0.02em]">{point.title}</dt>
            <dd className="mt-2 max-w-[44ch] text-[0.875rem] leading-relaxed text-graphite">{point.copy}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-10 max-w-2xl text-[0.75rem] leading-relaxed text-graphite">
        Contenido de demostración. Las condiciones de garantía, entrega y devolución se
        detallarán en el contrato de compraventa y en los términos del servicio.
      </p>
    </section>
  );
}
