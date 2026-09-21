import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { Providers } from "@/app/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { SITE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "AUTORA · Coches de ocasión revisados",
    template: "%s | AUTORA",
  },
  description:
    "Marketplace de coches de ocasión y seminuevos revisados uno a uno. Busca, compara, calcula tu financiación y reserva online.",
  applicationName: "AUTORA",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "AUTORA",
    url: SITE.url,
    title: "AUTORA · Coches de ocasión revisados",
    description:
      "Coches seleccionados y revisados uno a uno. Precio transparente, historial disponible y financiación orientativa desde la propia ficha.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={GeistSans.variable}>
      <body className="min-h-dvh bg-paper antialiased">
        <Providers>
          <a
            href="#contenido"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
          >
            Saltar al contenido
          </a>
          <Navbar />
          <main id="contenido">{children}</main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
