import { createClient as createServerSupabase } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import type { Car, CarImage } from "@/types/car";

type CarRow = Database["public"]["Tables"]["cars"]["Row"];
type ImageRow = Database["public"]["Tables"]["car_images"]["Row"];

const VIEWS = ["perfil", "frontal", "trasera", "interior", "detalle"] as const;

/**
 * Convierte una fila de `cars` (+ sus `car_images`) en el tipo `Car` que ya
 * consume toda la interfaz. Así CarCard, CarGallery, etc. no cambian ni una
 * línea el día que esto sustituya a `data/cars.ts`: solo cambia de dónde
 * viene la lista de `Car[]`.
 */
export function rowToCar(row: CarRow, images: ImageRow[]): Car {
  const gallery: CarImage[] =
    images.length > 0
      ? images.sort((a, b) => a.position - b.position).map((img) => ({ url: img.url, alt: img.alt }))
      : VIEWS.map((view) => ({
          url: `sample:${row.body_type}:${row.color}:${view}`,
          alt: `${row.brand} ${row.model} ${row.version}, ${view}`,
        }));

  return {
    id: row.id,
    slug: row.slug,
    brand: row.brand,
    model: row.model,
    version: row.version,
    year: row.year,
    price: Number(row.price),
    previousPrice: row.previous_price != null ? Number(row.previous_price) : undefined,
    mileage: row.mileage,
    fuel: row.fuel as Car["fuel"],
    transmission: row.transmission as Car["transmission"],
    power: row.power,
    bodyType: row.body_type as Car["bodyType"],
    doors: row.doors,
    seats: row.seats,
    drivetrain: row.drivetrain as Car["drivetrain"],
    color: row.color,
    location: row.location,
    images: gallery,
    description: row.description,
    features: row.features,
    environmentalLabel: row.environmental_label as Car["environmentalLabel"],
    verified: row.verified,
    warranty: row.warranty_months,
    financing: {
      downPayment: row.financing_down_payment != null ? Number(row.financing_down_payment) : Math.round(Number(row.price) * 0.15),
      months: row.financing_months,
      apr: Number(row.financing_apr),
    },
    listedAt: row.listed_at,
    sold: row.sold,
  };
}

/** Todo el catálogo visible (RLS: select público en `cars`). */
export async function getCars(): Promise<Car[]> {
  const supabase = await createServerSupabase();
  const { data: rows, error } = await supabase.from("cars").select("*").order("listed_at", { ascending: false });
  if (error) throw error;

  const { data: images } = await supabase.from("car_images").select("*");
  const byCarId = new Map<string, ImageRow[]>();
  for (const img of images ?? []) {
    const list = byCarId.get(img.car_id) ?? [];
    list.push(img);
    byCarId.set(img.car_id, list);
  }

  return (rows ?? []).map((row) => rowToCar(row, byCarId.get(row.id) ?? []));
}

/** Un vehículo por slug, para /coches/[slug]. Devuelve null si no existe. */
export async function getCarBySlug(slug: string): Promise<Car | null> {
  const supabase = await createServerSupabase();
  const { data: row, error } = await supabase.from("cars").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  if (!row) return null;

  const { data: images } = await supabase.from("car_images").select("*").eq("car_id", row.id);
  return rowToCar(row, images ?? []);
}
