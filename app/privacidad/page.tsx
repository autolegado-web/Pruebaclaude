import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacidad",
  description: "Cómo trataríamos los datos personales en AUTORA.",
  alternates: { canonical: "/privacidad" },
};

export default function PrivacyPage() {
  return <LegalPage title="Privacidad" lede="Cómo trataríamos los datos personales en AUTORA." />;
}
