import type { Metadata } from "next";
import { Ban, ClipboardList, Pencil, Plus, Trash2, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Panel de administración",
  robots: { index: false, follow: false },
};

const CAPABILITIES = [
  { icon: Plus, title: "Añadir coche", copy: "Alta de un vehículo nuevo en el catálogo, con fotos y ficha completa." },
  { icon: Pencil, title: "Editar coche", copy: "Modificar precio, kilómetros, equipamiento o estado de una unidad." },
  { icon: Trash2, title: "Eliminar coche", copy: "Retirar una ficha del catálogo público." },
  { icon: Ban, title: "Marcar como vendido", copy: "Cambia el estado sin borrar el histórico del vehículo." },
  { icon: ClipboardList, title: "Gestionar solicitudes", copy: "Solicitudes de información, reservas y valoraciones de venta." },
  { icon: Users, title: "Gestionar usuarios", copy: "Cuentas, permisos y actividad de compradores y vendedores." },
];

export default function AdminPage() {
  return (
    <div className="page pt-28 pb-24 lg:pt-32">
      <header className="max-w-2xl">
        <h1 className="display-lg text-balance">Panel de administración</h1>
        <p className="lede mt-4">
          Esta sección no forma parte de las fases prioritarias del proyecto. Aquí queda preparada la
          arquitectura para lo que vendrá una vez conectado Supabase.
        </p>
      </header>

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CAPABILITIES.map((c) => (
          <li key={c.title} className="rounded-lg border border-dashed border-line p-6">
            <c.icon aria-hidden className="h-5 w-5 text-steel" />
            <p className="mt-5 text-[0.9375rem] font-medium">{c.title}</p>
            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-graphite">{c.copy}</p>
          </li>
        ))}
      </ul>

      <p className="meta mt-14 max-w-[62ch]">
        Cada acción de esta lista corresponde a una operación sobre las tablas <code>cars</code>,{" "}
        <code>sell_requests</code>, <code>inquiries</code> y <code>reservations</code> descritas en la
        Fase C del README, protegidas por RLS y accesibles solo a usuarios con rol de administrador.
      </p>
    </div>
  );
}
