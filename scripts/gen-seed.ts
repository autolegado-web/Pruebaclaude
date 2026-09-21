import { writeFileSync } from "node:fs";
import { cars } from "../data/cars";

function esc(s: unknown) {
  return String(s).replace(/'/g, "''");
}
function arr(a: string[]) {
  return `ARRAY[${a.map((x) => `'${esc(x)}'`).join(", ")}]::text[]`;
}
function nullable(v: number | undefined) {
  return v == null ? "null" : String(v);
}

const out: string[] = [];
out.push("-- =========================================================================");
out.push("-- AUTORA · datos de ejemplo (generados desde data/cars.ts)");
out.push(`-- ${cars.length} vehículos ficticios, ${new Set(cars.map((c) => c.brand)).size} marcas. Precios y datos orientativos.`);
out.push("-- =========================================================================\n");

out.push("insert into public.cars (");
out.push("  slug, brand, model, version, year, price, previous_price, mileage, fuel, transmission,");
out.push("  power, body_type, doors, seats, drivetrain, color, location, description, features,");
out.push("  environmental_label, verified, warranty_months, financing_down_payment, financing_months,");
out.push("  financing_apr, listed_at");
out.push(") values");

const rows = cars.map(
  (c) =>
    `  ('${esc(c.slug)}', '${esc(c.brand)}', '${esc(c.model)}', '${esc(c.version)}', ${c.year}, ${c.price}, ${nullable(c.previousPrice)}, ${c.mileage}, '${esc(c.fuel)}', '${esc(c.transmission)}', ${c.power}, '${esc(c.bodyType)}', ${c.doors}, ${c.seats}, '${esc(c.drivetrain)}', '${esc(c.color)}', '${esc(c.location)}', '${esc(c.description)}', ${arr(c.features)}, '${esc(c.environmentalLabel)}', ${c.verified}, ${c.warranty}, ${nullable(c.financing.downPayment)}, ${c.financing.months}, ${c.financing.apr}, '${c.listedAt}')`,
);
out.push(rows.join(",\n") + ";\n");

out.push("-- Imágenes: en el prototipo se dibujan con components/car/car-image.tsx a partir de");
out.push("-- `sample:<carrocería>:<pintura>:<toma>`. Al conectar fotografía real, inserta aquí las");
out.push("-- URLs reales referenciando el coche por su slug, por ejemplo:");
out.push("--");
out.push("-- insert into public.car_images (car_id, url, alt, position)");
out.push("-- select id, 'https://.../foto-1.jpg', brand || ' ' || model || ', vista lateral', 0");
out.push("-- from public.cars where slug = 'bmw-serie-3-320d-m-sport-2022';");

writeFileSync(new URL("../supabase/seed.sql", import.meta.url), out.join("\n") + "\n");
console.log(`Escritas ${cars.length} filas en supabase/seed.sql`);
