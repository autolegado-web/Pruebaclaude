import Link from "next/link";
import type { Car } from "@/types/car";
import { CarImage } from "@/components/car/car-image";
import { FavoriteButton } from "@/components/car/favorite-button";
import { EnvBadge } from "@/components/ui/badge";
import { estimateMonthly } from "@/lib/finance";
import { cn, formatMileage, formatMonthly, formatPrice } from "@/lib/utils";

export function CarCard({
  car,
  priority = false,
  sizes,
}: {
  car: Car;
  priority?: boolean;
  sizes?: string;
}) {
  const title = `${car.brand} ${car.model}`;
  const monthly = estimateMonthly(car.price, car.financing.apr);

  return (
    <article className="group relative">
      <div className="relative overflow-hidden rounded-sm bg-ash">
        <div className="aspect-[4/3] w-full">
          <CarImage
            url={car.images[0].url}
            alt={car.images[0].alt}
            bodyType={car.bodyType}
            priority={priority}
            sizes={sizes ?? "(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30vw"}
            className="transition-transform duration-[600ms] ease-[var(--ease-out-quint)] group-hover:scale-[1.035]"
          />
        </div>

        {car.verified ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-xs bg-paper/90 px-2 py-1 text-[0.6875rem] text-ink backdrop-blur-sm">
            <span aria-hidden className="h-1.5 w-1.5 rounded-pill bg-[var(--color-verified)]" />
            Revisado
          </span>
        ) : null}

        <FavoriteButton
          carId={car.id}
          label={`${title} ${car.version}`}
          className="absolute right-2.5 top-2.5"
        />
      </div>

      <div className="pt-4">
        <h3 className="display-sm text-[1.0625rem] leading-tight">
          <Link href={`/coches/${car.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {title}
          </Link>
        </h3>
        <p className="mt-1 truncate text-[0.8125rem] text-graphite">{car.version}</p>

        <ul className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-graphite">
          <li data-numeric>{car.year}</li>
          <li data-numeric>{formatMileage(car.mileage)}</li>
          <li>{car.fuel}</li>
          <li>{car.transmission}</li>
        </ul>

        <div className="rule mt-3.5 flex items-end justify-between gap-3 pt-3 transition-colors duration-300 group-hover:border-ink">
          <div>
            <p data-numeric className="text-[1.0625rem] font-medium tracking-[-0.03em]">
              {formatPrice(car.price)}
            </p>
            {car.previousPrice ? (
              <p data-numeric className="mt-0.5 text-[0.75rem] text-graphite line-through">
                {formatPrice(car.previousPrice)}
              </p>
            ) : null}
          </div>
          <div className="text-right">
            <p data-numeric className="text-[0.8125rem] text-graphite">
              desde {formatMonthly(monthly)}
            </p>
            <p className="mt-0.5 flex items-center justify-end gap-2 text-[0.75rem] text-graphite">
              <EnvBadge label={car.environmentalLabel} />
              {car.location}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export function CarGrid({
  cars,
  className,
  priorityCount = 0,
  sizes,
}: {
  cars: Car[];
  className?: string;
  priorityCount?: number;
  sizes?: string;
}) {
  return (
    <ul className={cn("grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {cars.map((car, index) => (
        <li key={car.id}>
          <CarCard car={car} priority={index < priorityCount} sizes={sizes} />
        </li>
      ))}
    </ul>
  );
}
