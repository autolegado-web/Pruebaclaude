import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Términos",
  description: "Condiciones de uso del servicio.",
  alternates: { canonical: "/terminos" },
};

export default function TermsPage() {
  return <LegalPage title="Términos" lede="Condiciones de uso del servicio." />;
}
