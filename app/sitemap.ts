import type { MetadataRoute } from "next";
import { cars } from "@/data/cars";
import { SITE } from "@/lib/site";

const STATIC_ROUTES = [
  "",
  "/coches",
  "/vender",
  "/financiacion",
  "/como-funciona",
  "/contacto",
  "/favoritos",
  "/privacidad",
  "/cookies",
  "/terminos",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/coches" ? "daily" : "monthly",
    priority: path === "" ? 1 : path === "/coches" ? 0.9 : 0.5,
  }));

  const carEntries: MetadataRoute.Sitemap = cars.map((car) => ({
    url: `${SITE.url}/coches/${car.slug}`,
    lastModified: new Date(car.listedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...carEntries];
}
