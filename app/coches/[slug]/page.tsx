import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BuyBox } from "@/components/car/buy-box";
import { CarGallery } from "@/components/car/car-gallery";
import { CarFeatures, CarSpecs } from "@/components/car/car-specs";
import { CarGrid } from "@/components/car/car-card";
import { StickyCta } from "@/components/car/sticky-cta";
import { FinanceCalculator } from "@/components/finance/finance-calculator";
import { cars } from "@/data/cars";
import { formatMileage } from "@/lib/utils";
import { SITE } from "@/lib/site";

const TRUST = (car: (typeof cars)[number]) => [
  { title: "Vehículo revisado", copy: "Inspección mecánica y estética antes de publicarse." },
  { title: `Garantía de ${car.warranty} meses`, copy: "Incluida en el precio mostrado, sin coste adicional." },
  { title: "Historial disponible", copy: "Kilometraje y mantenimiento verificados. Te lo enviamos al pedir información." },
  { title: "Entrega", copy: `Recogida en ${car.location} o entrega en la dirección que nos indiques.` },
];

export function generateStaticParams() {
  return cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const car = cars.find((c) => c.slug === slug);
  if (!car) return {};
  const title = `${car.brand} ${car.model} ${car.version} ${car.year}`;
  const description = `${car.brand} ${car.model} ${car.version} de ${car.year} con ${formatMileage(car.mileage)}. Consulta precio, equipamiento y financiación en AUTORA.`;
  return {
    title,
    description,
    alternates: { canonical: `/coches/${car.slug}` },
    openGraph: { title: `${title} | AUTORA`, description },
  };
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = cars.find((c) => c.slug === slug);
  if (!car) notFound();

  const similar = cars
    .filter((c) => c.id !== car.id && (c.brand === car.brand || c.bodyType === car.bodyType))
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `${car.brand} ${car.model} ${car.version}`,
    brand: car.brand,
    model: car.model,
    vehicleModelDate: String(car.year),
    mileageFromOdometer: { "@type": "QuantitativeValue", value: car.mileage, unitCode: "KMT" },
    fuelType: car.fuel,
    vehicleTransmission: car.transmission,
    offers: {
      "@type": "Offer",
      price: car.price,
      priceCurrency: "EUR",
      availability: car.sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      url: `${SITE.url}/coches/${car.slug}`,
    },
  };

  return (
    <div className="pb-28 lg:pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Migas de pan" className="page meta pt-24 pb-4 lg:pt-28">
        <Link href="/coches" className="hover:text-ink">
          Coches
        </Link>
        <span className="px-2">/</span>
        <Link href={`/coches?brand=${encodeURIComponent(car.brand)}`} className="hover:text-ink">
          {car.brand}
        </Link>
        <span className="px-2">/</span>
        <span className="text-ink">
          {car.model} {car.version}
        </span>
      </nav>

      <CarGallery car={car} />

      <div className="page mt-10 grid gap-12 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
        <div className="min-w-0">
          <header>
            <h1 className="display-lg text-balance">
              {car.brand} {car.model}
            </h1>
            <p className="lede mt-2 text-[1rem]">{car.version}</p>
          </header>

          <div className="mt-8">
            <CarSpecs car={car} />
          </div>

          <section className="mt-12">
            <h2 className="text-[1.0625rem] font-medium">Descripción</h2>
            <p className="lede mt-3 max-w-[68ch] text-[0.9375rem]">{car.description}</p>
          </section>

          <section className="mt-12">
            <h2 className="text-[1.0625rem] font-medium">Equipamiento</h2>
            <div className="mt-3">
              <CarFeatures features={car.features} />
            </div>
          </section>

          <section id="financiacion" className="mt-12 scroll-mt-24">
            <h2 className="text-[1.0625rem] font-medium">Calcula tu financiación</h2>
            <div className="mt-5">
              <FinanceCalculator price={car.price} />
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-[1.0625rem] font-medium">Compra con confianza</h2>
            <ul className="mt-3">
              {TRUST(car).map((t) => (
                <li key={t.title} className="rule flex gap-3 py-3.5 first:border-t-0">
                  <div>
                    <p className="text-[0.9375rem] font-medium">{t.title}</p>
                    <p className="mt-0.5 text-[0.8125rem] text-graphite">{t.copy}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <BuyBox car={car} />
      </div>

      {similar.length > 0 ? (
        <section className="page mt-20 lg:mt-28" aria-labelledby="similar-title">
          <h2 id="similar-title" className="display-sm">
            También te puede encajar
          </h2>
          <CarGrid cars={similar} className="mt-8" />
        </section>
      ) : null}

      <StickyCta car={car} />
    </div>
  );
}
