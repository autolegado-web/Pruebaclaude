import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Las imágenes del catálogo se sirven desde /public por defecto.
    // Para conectar un CDN real (Supabase Storage, Cloudinary…) basta con
    // añadir el dominio aquí y cambiar la URL en data/cars.ts.
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: { optimizePackageImports: ["lucide-react"] },
};

export default nextConfig;
