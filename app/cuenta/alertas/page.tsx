import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AlertsManager } from "@/components/account/alerts-manager";

export const metadata: Metadata = {
  title: "Mis alertas",
  robots: { index: false },
};

export default function AccountAlertsPage() {
  return (
    <div className="page pt-28 pb-24 lg:pt-32">
      <Link href="/cuenta" className="meta inline-flex items-center gap-1.5 hover:text-ink">
        <ArrowLeft aria-hidden className="h-3.5 w-3.5" />
        Tu cuenta
      </Link>
      <h1 className="display-lg mt-4">Mis alertas</h1>
      <p className="lede mt-3">Avísanos qué buscas y te avisamos nosotros cuando aparezca.</p>
      <div className="mt-10">
        <AlertsManager />
      </div>
    </div>
  );
}
