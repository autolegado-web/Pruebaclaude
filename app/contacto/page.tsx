import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos y te respondemos en menos de 24 horas laborables.",
  alternates: { canonical: "/contacto" },
};

export default function ContactPage() {
  return (
    <div className="page pt-28 pb-24 lg:pt-32">
      <div className="grid gap-14 lg:grid-cols-[1fr_26rem] lg:gap-20">
        <div>
          <h1 className="display-lg text-balance">Contacto</h1>
          <p className="lede mt-4">
            Dinos qué necesitas y te respondemos por escrito. Sin llamadas que no has pedido.
          </p>

          <dl className="mt-12 max-w-sm space-y-5">
            <div className="rule pt-4">
              <dt className="text-[0.8125rem] text-graphite">Atención</dt>
              <dd className="mt-1 text-[0.9375rem]">Lunes a viernes, 9:00–19:00</dd>
            </div>
            <div className="rule pt-4">
              <dt className="text-[0.8125rem] text-graphite">Email</dt>
              <dd className="mt-1 text-[0.9375rem]">{SITE.email}</dd>
            </div>
            <div className="rule pt-4">
              <dt className="text-[0.8125rem] text-graphite">Teléfono</dt>
              <dd className="mt-1 text-[0.9375rem]" data-numeric>
                {SITE.phone}
              </dd>
            </div>
            <div className="rule pt-4">
              <dt className="text-[0.8125rem] text-graphite">Punto de entrega</dt>
              <dd className="mt-1 text-[0.9375rem]">Dirección de ejemplo, {SITE.city}</dd>
            </div>
          </dl>
          <p className="meta mt-8 max-w-sm">Datos de contacto de ejemplo para el prototipo.</p>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
