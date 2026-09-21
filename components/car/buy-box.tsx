import Link from "next/link";
import type { Car } from "@/types/car";
import { FavoriteButton } from "@/components/car/favorite-button";
import { MockCtaButton } from "@/components/car/mock-cta-button";
import { estimateMonthly } from "@/lib/finance";
import { formatMonthly, formatPrice } from "@/lib/utils";

export function BuyBox({ car }: { car: Car }) {
  const monthly = estimateMonthly(car.price, car.financing.apr);

  return (
    <aside className="lg:sticky lg:top-24" aria-label="Comprar este vehículo">
      <div className="rounded-lg border border-line p-6">
        <p className="text-[0.8125rem] text-graphite">Precio con garantía incluida</p>
        <p data-numeric className="mt-1 text-[2.125rem] font-medium leading-none tracking-[-0.03em]">
          {formatPrice(car.price)}
        </p>
        <p data-numeric className="mt-2.5 text-[0.8125rem] text-graphite">
          o desde <span className="font-medium text-ink">{formatMonthly(monthly)}</span> en{" "}
          {car.financing.months} meses con {formatPrice(car.financing.downPayment || Math.round(car.price * 0.15))}{" "}
          de entrada
        </p>

        <div className="mt-5 grid gap-2.5">
          <MockCtaButton size="lg" block toastMessage="Te hemos enviado el proceso de compra por email">
            Quiero comprarlo
          </MockCtaButton>
          <MockCtaButton variant="outline" block toastMessage="Solicitud enviada. Te respondemos por email">
            Solicitar información
          </MockCtaButton>
          <MockCtaButton variant="secondary" block toastMessage="Reserva iniciada. Revisa tu correo">
            Reservar coche
          </MockCtaButton>
        </div>

        <div className="mt-3 flex items-center gap-2.5">
          <Link
            href="#financiacion"
            className="flex-1 rounded-sm border border-line-strong py-2.5 text-center text-[0.8125rem] text-ink transition-colors hover:border-ink"
          >
            Calcular financiación
          </Link>
          <FavoriteButton
            carId={car.id}
            label={`${car.brand} ${car.model}`}
            tone="outline"
            withLabel
            className="flex-1"
          />
        </div>

        <hr className="mt-5 border-line" />
        <p className="mt-4 text-[0.75rem] text-graphite">
          Ref. {car.id.toUpperCase()} · Publicado en {car.location}
        </p>
      </div>
    </aside>
  );
}
