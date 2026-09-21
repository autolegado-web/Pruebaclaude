import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Cómo funciona",
  description: "Cómo comprar y cómo vender un coche en AUTORA, paso a paso.",
  alternates: { canonical: "/como-funciona" },
};

const BUY_STEPS = [
  { title: "Busca", copy: "Filtra por marca, precio, combustible o kilómetros. La URL guarda tu búsqueda, así que puedes compartirla." },
  { title: "Compara", copy: "Guarda tus candidatos en favoritos y míralos juntos, con las mismas cifras a la vista." },
  { title: "Conoce el vehículo", copy: "Cada ficha incluye historial, equipamiento real y el informe de revisión de esa unidad concreta." },
  { title: "Solicita información", copy: "Te enviamos el informe completo y resolvemos dudas por escrito, sin llamadas que no has pedido." },
  { title: "Compra", copy: "Reservas, firmamos y gestionamos la transferencia. Recoges el coche o te lo llevamos." },
];

const SELL_STEPS = [
  { title: "Cuéntanos qué coche tienes", copy: "Datos básicos del vehículo en un formulario de dos minutos." },
  { title: "Analizamos el vehículo", copy: "Contrastamos estado, equipamiento y precios reales de mercado." },
  { title: "Recibes una valoración", copy: "Un rango de precio explicado, no un número suelto sin justificar." },
  { title: "Decides si venderlo", copy: "Sin compromiso. Si aceptas, nos encargamos del papeleo." },
];

function StepList({ steps }: { steps: { title: string; copy: string }[] }) {
  return (
    <ol className="mt-8 grid gap-0 sm:grid-cols-2 sm:gap-x-10">
      {steps.map((step, i) => (
        <li key={step.title} className="rule py-6 first:border-t-0 sm:first:border-t sm:[&:nth-child(-n+2)]:border-t-0">
          <p data-numeric className="meta">
            {String(i + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-2 text-[1.0625rem] font-medium">{step.title}</h3>
          <p className="mt-1.5 max-w-[42ch] text-[0.875rem] leading-relaxed text-graphite">{step.copy}</p>
        </li>
      ))}
    </ol>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="page pt-28 pb-24 lg:pt-32">
      <header className="max-w-2xl">
        <h1 className="display-lg text-balance">Cómo funciona</h1>
        <p className="lede mt-4">
          Comprar un coche de segunda mano no debería requerir un máster. Esto es todo el proceso.
        </p>
      </header>

      <section className="mt-16 lg:mt-20" aria-labelledby="buy-title">
        <h2 id="buy-title" className="display-md">
          Comprar
        </h2>
        <StepList steps={BUY_STEPS} />
      </section>

      <section id="vender" className="mt-20 scroll-mt-24 lg:mt-28" aria-labelledby="sell-title">
        <h2 id="sell-title" className="display-md">
          Vender
        </h2>
        <StepList steps={SELL_STEPS} />
      </section>

      <div className="mt-16 flex flex-wrap gap-3 lg:mt-20">
        <Button asChild size="lg">
          <Link href="/coches">Ver coches</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/vender">Vender mi coche</Link>
        </Button>
      </div>
    </div>
  );
}
