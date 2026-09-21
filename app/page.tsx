import Link from "next/link";
import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Chapters } from "@/components/home/chapters";
import { Trust } from "@/components/home/trust";
import { SearchPanel } from "@/components/search/search-panel";
import { CarGrid } from "@/components/car/car-card";
import { Button } from "@/components/ui/button";
import { cars } from "@/data/cars";
import { sortCars } from "@/lib/filters";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "AUTORA · Coches de ocasión revisados",
  description:
    "Marketplace de coches de ocasión, seminuevos y premium. Busca por marca, precio o etiqueta, calcula tu cuota y reserva online.",
  alternates: { canonical: "/" },
};

const STEPS = [
  { title: "Busca", copy: "Filtra por marca, presupuesto, etiqueta o kilómetros. La búsqueda se guarda en la URL: puedes compartirla." },
  { title: "Compara", copy: "Guarda favoritos y ponlos uno al lado del otro con las mismas cifras a la vista." },
  { title: "Conoce el coche", copy: "Galería completa, equipamiento, historial y estado de la unidad concreta." },
  { title: "Calcula", copy: "Ajusta entrada y plazo y mira la cuota estimada antes de hablar con nadie." },
  { title: "Reserva", copy: "Solicita información o reserva online. Te confirmamos disponibilidad y siguientes pasos." },
];

export default function HomePage() {
  const featured = sortCars(cars, "nuevos").slice(0, 6);

  const organization = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: SITE.name,
    url: SITE.url,
    email: SITE.email,
    telephone: SITE.phone,
    areaServed: "ES",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />

      <Hero />

      <div className="page relative z-10 -mt-10 lg:-mt-14">
        <SearchPanel className="shadow-[0_1px_40px_-12px_rgba(0,0,0,0.25)]" />
      </div>

      <section aria-labelledby="featured-title" className="page mt-20 lg:mt-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="featured-title" className="display-md text-balance">
              Últimos coches revisados
            </h2>
            <p className="lede mt-3">
              Las unidades que han pasado el punto de control esta semana.
            </p>
          </div>
          <Link
            href="/coches"
            className="text-sm text-graphite underline decoration-line underline-offset-[6px] transition-colors hover:text-ink hover:decoration-ink"
          >
            Ver los {cars.length} coches
          </Link>
        </div>

        <CarGrid cars={featured} className="mt-10" priorityCount={3} />
      </section>

      <Chapters />

      <section aria-labelledby="steps-title" className="page mt-24 lg:mt-32">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <div>
            <h2 id="steps-title" className="display-md text-balance">
              Cómo funciona
            </h2>
            <p className="lede mt-4">
              Cinco pasos, sin visitas obligatorias ni llamadas para conocer el precio.
            </p>
            <Button asChild variant="outline" size="md" className="mt-6">
              <Link href="/como-funciona">Ver el proceso completo</Link>
            </Button>
          </div>

          <ol className="grid gap-px overflow-hidden rounded-md bg-line sm:grid-cols-2">
            {STEPS.map((step, index) => (
              <li key={step.title} className="bg-paper p-6">
                <p data-numeric className="text-[0.75rem] text-graphite">
                  Paso {index + 1}
                </p>
                <h3 className="mt-3 text-[1.0625rem] font-medium tracking-[-0.025em]">{step.title}</h3>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-graphite">{step.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Trust />

      <section className="page mt-24 lg:mt-32">
        <div className="dark-surface relative overflow-hidden rounded-lg bg-night px-6 py-14 text-paper sm:px-10 lg:px-16 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="display-lg text-balance">Vende tu coche sin complicaciones.</h2>
            <p className="mt-5 max-w-[46ch] text-[0.9375rem] leading-relaxed text-white/70">
              Cuéntanos qué tienes, lo analizamos y te damos una valoración. Si te encaja,
              nos ocupamos del resto. Si no, no pasa nada.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="light">
                <Link href="/vender">Solicitar valoración</Link>
              </Button>
              <Button asChild size="lg" variant="onDark">
                <Link href="/como-funciona#vender">Cómo funciona la venta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
