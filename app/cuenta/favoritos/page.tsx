import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FavoritesList } from "@/components/car/favorites-list";

export const metadata: Metadata = {
  title: "Mis favoritos",
  robots: { index: false },
};

export default function AccountFavoritesPage() {
  return (
    <div className="page pt-28 pb-24 lg:pt-32">
      <Link href="/cuenta" className="meta inline-flex items-center gap-1.5 hover:text-ink">
        <ArrowLeft aria-hidden className="h-3.5 w-3.5" />
        Tu cuenta
      </Link>
      <h1 className="display-lg mt-4">Mis favoritos</h1>
      <div className="mt-10">
        <FavoritesList />
      </div>
    </div>
  );
}
