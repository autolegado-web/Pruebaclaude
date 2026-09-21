import type { Metadata } from "next";
import { FavoritesList } from "@/components/car/favorites-list";

export const metadata: Metadata = {
  title: "Favoritos",
  description: "Los coches que has guardado en AUTORA.",
  alternates: { canonical: "/favoritos" },
  robots: { index: false },
};

export default function FavoritesPage() {
  return (
    <div className="page pt-28 pb-24 lg:pt-32">
      <header className="max-w-2xl">
        <h1 className="display-lg text-balance">Favoritos</h1>
        <p className="lede mt-4">Los coches que has guardado, listos para comparar cuando quieras.</p>
      </header>
      <div className="mt-12">
        <FavoritesList />
      </div>
      <p className="meta mt-16 max-w-[60ch]">
        Ahora mismo tus favoritos se guardan solo en este navegador. Con cuenta de usuario pasarán a
        estar disponibles en todos tus dispositivos.
      </p>
    </div>
  );
}
