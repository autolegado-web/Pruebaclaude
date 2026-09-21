"use client";

import Link from "next/link";
import { Heart, Bell, FileText, LogOut } from "lucide-react";
import { useAuth, useFavorites, useSavedSearches } from "@/app/providers";
import { Button } from "@/components/ui/button";

export function AccountOverview() {
  const { session, ready, signOut } = useAuth();
  const { favorites } = useFavorites();
  const { searches } = useSavedSearches();

  if (ready && !session) {
    return (
      <div className="rule flex flex-col items-start gap-3 py-16">
        <h1 className="display-sm">Inicia sesión para ver tu cuenta</h1>
        <p className="lede">Guarda favoritos y alertas, y consulta tus solicitudes en un solo sitio.</p>
        <Button asChild className="mt-2">
          <Link href="/login">Iniciar sesión</Link>
        </Button>
      </div>
    );
  }

  const cards = [
    { href: "/cuenta/favoritos", icon: Heart, title: "Favoritos", value: favorites.length },
    { href: "/cuenta/alertas", icon: Bell, title: "Alertas", value: searches.length },
    { href: "/vender", icon: FileText, title: "Solicitudes de venta", value: 0 },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="display-lg">Hola{session ? `, ${session.name.split(" ")[0]}` : ""}</h1>
          <p className="lede mt-2">{session?.email}</p>
        </div>
        {session ? (
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 text-[0.875rem] text-graphite transition-colors hover:text-ink"
          >
            <LogOut aria-hidden className="h-4 w-4" />
            Cerrar sesión
          </button>
        ) : null}
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group rounded-lg border border-line p-6 transition-colors hover:border-ink"
          >
            <c.icon aria-hidden className="h-5 w-5 text-graphite transition-colors group-hover:text-ink" />
            <p data-numeric className="mt-6 text-[1.75rem] font-medium leading-none tracking-[-0.03em]">
              {c.value}
            </p>
            <p className="mt-2 text-[0.875rem] text-graphite">{c.title}</p>
          </Link>
        ))}
      </div>

      <p className="meta mt-12 max-w-[60ch]">
        Cuenta de demostración. Cuando se conecte Supabase, estos datos se sincronizarán entre
        dispositivos y las solicitudes de venta aparecerán aquí con su estado real.
      </p>
    </div>
  );
}
