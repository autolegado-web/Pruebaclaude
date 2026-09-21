import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description: "Dudas habituales sobre comprar, vender, financiar y reservar en AUTORA.",
  alternates: { canonical: "/preguntas-frecuentes" },
};

const FAQS = [
  {
    q: "¿Los coches del catálogo están revisados de verdad?",
    a: "Sí. Cada vehículo pasa una inspección mecánica y estética antes de publicarse; si no la supera, no entra en el catálogo. En este prototipo la etiqueta “Revisado” es de ejemplo, pero el flujo de verificación es el que quedará operativo.",
  },
  {
    q: "¿Puedo reservar un coche sin verlo en persona?",
    a: "Sí, desde la propia ficha. La reserva bloquea el vehículo mientras completas la compra; en este prototipo el botón simula el envío porque todavía no hay backend conectado.",
  },
  {
    q: "¿Cómo se calcula la cuota de financiación?",
    a: "Con un sistema de amortización francesa (cuota constante) sobre el precio menos la entrada, al plazo y TAE que elijas. Es una simulación orientativa: la entidad financiera fija las condiciones reales.",
  },
  {
    q: "¿Qué pasa si el coche que busco no está en el catálogo?",
    a: "Puedes crear una alerta con tu búsqueda y avisaríamos en cuanto entre un coche que encaje, por email o notificación.",
  },
  {
    q: "¿Cuánto tarda una valoración al vender mi coche?",
    a: "Menos de 24 horas laborables desde que envías el formulario en /vender. La valoración es un rango de precio explicado, no un número suelto.",
  },
  {
    q: "¿Dónde se guardan mis favoritos?",
    a: "Sin cuenta, solo en este navegador. Con cuenta, pasarán a estar disponibles en cualquier dispositivo.",
  },
];

export default function FaqPage() {
  return (
    <div className="page max-w-3xl pt-28 pb-28 lg:pt-32">
      <h1 className="display-lg">Preguntas frecuentes</h1>
      <p className="lede mt-4">Lo que más se pregunta antes de comprar, vender o financiar un coche.</p>

      <div className="mt-12">
        <Accordion type="single" collapsible>
          {FAQS.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
