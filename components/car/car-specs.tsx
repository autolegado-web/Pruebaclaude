import type { Car } from "@/types/car";
import { EnvBadge } from "@/components/ui/badge";
import { formatMileage } from "@/lib/utils";

export function CarSpecs({ car }: { car: Car }) {
  const rows: [string, React.ReactNode][] = [
    ["Año", car.year],
    ["Kilómetros", formatMileage(car.mileage)],
    ["Combustible", car.fuel],
    ["Cambio", car.transmission],
    ["Potencia", `${car.power} CV`],
    ["Carrocería", car.bodyType],
    ["Puertas / plazas", `${car.doors} / ${car.seats}`],
    ["Tracción", car.drivetrain],
    ["Color", car.color],
    ["Etiqueta DGT", <EnvBadge key="env" label={car.environmentalLabel} />],
  ];

  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md bg-line sm:grid-cols-3 lg:grid-cols-4">
      {rows.map(([label, value]) => (
        <div key={label} className="bg-paper px-4 py-3.5">
          <dt className="text-[0.75rem] text-graphite">{label}</dt>
          <dd data-numeric className="mt-0.5 text-[0.9375rem] font-medium">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function CarFeatures({ features }: { features: string[] }) {
  return (
    <ul className="columns-1 gap-x-8 sm:columns-2">
      {features.map((f) => (
        <li key={f} className="rule flex break-inside-avoid items-start gap-3 py-2.5 text-[0.9375rem] first:border-t-0">
          <span aria-hidden className="mt-[0.85em] h-px w-2.5 shrink-0 bg-ink" />
          {f}
        </li>
      ))}
    </ul>
  );
}
