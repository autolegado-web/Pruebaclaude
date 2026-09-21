import type { Metadata } from "next";
import { SellCarForm } from "@/components/forms/sell-car-form";

export const metadata: Metadata = {
  title: "Vende tu coche",
  description: "Cuéntanos qué coche tienes y recibe una valoración sin compromiso en menos de 24 horas.",
  alternates: { canonical: "/vender" },
};

const STEPS = [
  { title: "Cuéntanos qué coche tienes", copy: "Marca, modelo, año y kilómetros. Dos minutos." },
  { title: "Analizamos el vehículo", copy: "Contrastamos estado, equipamiento y precios de mercado reales." },
  { title: "Recibes una valoración", copy: "Un rango de precio con la explicación de cómo hemos llegado a él." },
  { title: "Decides si venderlo", copy: "Sin compromiso. Si sigues adelante, nos ocupamos del papeleo." },
];

export default function SellPage() {
  return (
    <div className="page pt-28 pb-24 lg:pt-32">
      <header className="max-w-2xl">
        <h1 className="display-lg text-balance">Vende tu coche sin complicaciones.</h1>
        <p className="lede mt-4">Cuatro pasos, una valoración y cero llamadas insistentes.</p>
      </header>

      <div className="mt-16 grid gap-16 lg:grid-cols-[20rem_1fr] lg:gap-20">
        <ol className="space-y-0">
          {STEPS.map((step, i) => (
            <li key={step.title} className="rule py-6 first:border-t-0">
              <p data-numeric className="meta">
                Paso {i + 1}
              </p>
              <h2 className="mt-2 text-[1.0625rem] font-medium">{step.title}</h2>
              <p className="mt-1.5 text-[0.875rem] leading-relaxed text-graphite">{step.copy}</p>
            </li>
          ))}
        </ol>

        <section aria-labelledby="sell-form-title">
          <h2 id="sell-form-title" className="display-sm">
            Solicita tu valoración
          </h2>
          <p className="lede mt-3">Te respondemos en menos de 24 horas laborables.</p>
          <div className="mt-8">
            <SellCarForm />
          </div>
        </section>
      </div>
    </div>
  );
}
