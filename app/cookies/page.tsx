import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Cookies",
  description: "Qué cookies usaría la plataforma y para qué.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return <LegalPage title="Cookies" lede="Qué cookies usaría la plataforma y para qué." />;
}
