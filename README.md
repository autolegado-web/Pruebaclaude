# AUTORA — marketplace de coches

Next.js 16 (App Router) + TypeScript + Tailwind v4. Proyecto real y funcional,
construido por fases dentro del mismo repositorio: `npm install && npm run build`
compila limpio, 53 rutas, sin errores de TypeScript.

## Arrancar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build       # build de producción
npm run typecheck   # tsc --noEmit
```

Sin ninguna variable de entorno configurada, la app funciona entera con el
dataset de muestra (`data/cars.ts`) y favoritos/sesión/alertas en
`localStorage`. Ver la sección Supabase más abajo para conectar un backend real.

## 1. Lectura de la referencia visual

El vídeo de referencia es una web-portafolio cinematográfica: escenas a
pantalla completa, una palabra enorme anclada abajo a la izquierda, subtítulo
de dos líneas al 60% de opacidad, cero cromo de interfaz y el scroll usado
como cámara. Eso se tradujo a AUTORA como:

| Patrón de la referencia | Traducción en AUTORA |
|---|---|
| Escenas de 100vh con imagen a sangre | `components/home/hero.tsx`, `components/home/chapters.tsx` |
| Palabra única abajo a la izquierda | `display-xl` / `display-lg`, tracking `-0.045em` a `-0.06em` |
| Degradado inferior sobre la imagen | utilidad `scrim` en `app/globals.css` |
| Cromo de interfaz que desaparece | `Navbar` transparente sobre el hero, sólida al hacer scroll |

Lo que **no** se adopta: la referencia no vende nada. AUTORA sí, así que el
sitio invierte a claro en cuanto empieza el marketplace — oscuro es marca y
emoción, claro es decisión y comparación.

## 2. Sistema de diseño

Paleta acromática (`--color-paper/bone/ash/line/steel/graphite/ink`, más
`--color-night` para los escenarios). **Sin acento de marca**: el único color
cromático de la interfaz es la pintura real de cada coche, y solo aparece
dentro de la lámina de ese vehículo. Tipografía única (Geist Sans vía
`geist/font/sans`), jerarquía por tamaño/peso/tracking, nunca por color.

Ver `app/globals.css` para los tokens completos y las utilidades
(`display-xl/lg/md/sm`, `lede`, `meta`, `rule`, `scrim`, `skeleton`).

## 3. Imágenes

No se usan fotos de stock: una foto que no corresponde al coche es peor que
ninguna. `components/car/car-image.tsx` dibuja cada vehículo como lámina
vectorial a partir de su carrocería y su color real, en 5 tomas (perfil,
frontal, trasera, interior, detalle). Pesa unos kB, no depende de ninguna
API externa y siempre corresponde al coche mostrado.

El sistema es sustituible sin tocar componentes: en cuanto `images[].url` de
un coche deja de empezar por `sample:`, `CarImage` renderiza esa URL real con
`next/image`. `lib/supabase/cars.ts` ya hace exactamente ese mapeo.

## 4. Arquitectura

```
app/                    rutas (App Router)
  coches/                catálogo + [slug]
  vender/ financiacion/ favoritos/ como-funciona/ contacto/
  login/ registro/ cuenta/{favoritos,alertas}/
  privacidad/ cookies/ terminos/ preguntas-frecuentes/ admin/
  sitemap.ts  robots.ts  globals.css  layout.tsx  providers.tsx
components/
  ui/          primitivas (Button, Field, Sheet, Slider, Checkbox, Accordion, Toaster…)
  car/         CarCard, CarGallery, CarSpecs, CarImage, FavoriteButton, BuyBox…
  search/      FilterSidebar, FilterDrawer, ActiveFilters, SortSelect, useCarFilters
  finance/     FinanceCalculator (amortización francesa)
  forms/       SellCarForm, ContactForm
  auth/        LoginForm, RegisterForm
  account/     AccountOverview, AlertsManager
  home/        Hero, Chapters, Trust
  layout/      Navbar, Footer
data/cars.ts             32 vehículos, 15 marcas — sustituible por Supabase
lib/                     filters.ts, finance.ts, utils.ts, site.ts, use-car-filters.ts
lib/supabase/            capa lista para un backend real (ver más abajo)
supabase/migrations/     esquema SQL + RLS
types/car.ts             tipado estricto de dominio
```

Ningún componente conoce si sus datos vienen de `data/cars.ts` o de
Supabase: la frontera está en `lib/filters.ts` (`Car[]` → resultados) y en
`lib/supabase/cars.ts` (fila de Postgres → `Car`).

## 5. Estado por fase

- **Fase 1-4** (referencia, UX, arquitectura, sistema de diseño) — hecho.
- **Fase 5-6** (frontend + interacciones) — hecho: home, catálogo con
  filtros/orden/búsqueda compartibles por URL, ficha con galería
  swipe/fullscreen/teclado, calculadora, vender, favoritos, cuenta, alertas,
  cómo funciona, contacto, FAQ, legales, admin (placeholder de arquitectura).
- **Fase 7** (datos) — hecho: 32 vehículos ficticios, 15 marcas, mismo
  formato que se espera de Supabase.
- **Fase 8** (backend) — **preparado, no conectado**: ver sección Supabase.
- **Fase 9** (responsive) — hecho: sidebar → drawer, hero rediseñado (no
  encogido) en móvil, galería con swipe, CTA sticky inferior en ficha.
- **Fase 10-11** (SEO/QA) — hecho: metadata dinámica por ficha, JSON-LD
  `Vehicle`/`Offer`, `sitemap.ts`, `robots.ts`; build + typecheck limpios,
  smoke test manual de las 53 rutas (200 en todas, 404 correcto en slug
  inexistente).

### Fase de calidad — resuelto en esta pasada
- `proxy.ts` (Next 16 renombró `middleware.ts`; mismo comportamiento, sin aviso de deprecación).
- ESLint configurado (`eslint.config.mjs`, flat config + `eslint-config-next`). `npm run lint`
  pasa limpio: corrigió 3 usos reales de `react-hooks/set-state-in-effect` (dos reescritos sin
  efecto — remount por `key={pathname}` en el menú móvil, sincronización en `onClick` en el
  drawer de filtros — y uno documentado con `eslint-disable` justificado: la hidratación única
  de `localStorage` en `providers.tsx`, que sí necesita un efecto para no romper la hidratación SSR).
- Auditoría de contraste WCAG (calculada, no solo revisada a ojo): `--color-steel` daba 2.61:1
  sobre blanco en textos reales (specs, precios, hints, aviso legal, footer…), muy por debajo del
  4.5:1 exigido — se movieron esos ~10 usos a `graphite` (5.25:1) y `steel` quedó reservado a lo
  exento por WCAG (placeholder, disabled, iconos decorativos). También se encontró que el borde
  de reposo de inputs, checkboxes y botones/chips outline (`border-line`, 1.32:1) no llegaba al
  3:1 que exige 1.4.11 para el límite de un control interactivo; se añadió `--color-line-strong`
  (3.45:1) para esos casos, con una progresión resting → hover → focus coherente.

### Pendiente conocido
- El pase de contraste cubrió texto y bordes de controles; no incluyó una auditoría de foco por
  teclado con lector de pantalla real ni pruebas con usuarios.
- Sin acceso de red a `*.supabase.co` ni conector de GitHub en este entorno — ver limitaciones en
  la sección Supabase.

## 6. Supabase (Fase C)

Este entorno de construcción no tiene salida de red hacia `*.supabase.co`,
así que la conexión no se ha podido probar en vivo. Lo que sí está hecho y
compila:

- **`supabase/migrations/0001_init.sql`** — 10 tablas (`profiles`, `cars`,
  `car_images`, `favorites`, `saved_searches`, `inquiries`, `sell_requests`,
  `reservations`, `messages`, `reviews`), todas con Row Level Security: cada
  usuario solo lee/escribe sus propias filas; `cars` es de lectura pública y
  escritura solo para `profiles.is_admin`.
- **`supabase/seed.sql`** — los 32 vehículos de `data/cars.ts`, generados con
  `npx tsx scripts/gen-seed.ts` (regenerar tras editar el dataset).
- **`lib/supabase/client.ts` / `server.ts`** — clientes browser y servidor
  (`@supabase/ssr`), más `createAdminClient()` con la service role key para
  `/admin`.
- **`lib/supabase/cars.ts`** — `getCars()` / `getCarBySlug()`: convierten
  filas de Postgres al tipo `Car` que ya consume toda la UI.
- **`lib/supabase/favorites.ts`** — mismo contrato que el `favorites` de
  `app/providers.tsx`, contra la tabla real.
- **`proxy.ts`** — refresca la sesión en cada navegación; no hace nada
  si Supabase no está configurado.
- **`.env.example`** — variables a copiar a `.env.local`.

### Para dejarlo en producción

1. Crear un proyecto en supabase.com y copiar `.env.example` a `.env.local`.
2. `npx supabase db push` (o pegar `0001_init.sql` en el SQL Editor) y luego
   `supabase/seed.sql`.
3. Sustituir en `app/coches/page.tsx` y `app/coches/[slug]/page.tsx` el
   `import { cars } from "@/data/cars"` por `await getCars()` /
   `await getCarBySlug(slug)` de `lib/supabase/cars.ts`.
4. En `app/providers.tsx`, sustituir el `read/write` de `localStorage` para
   favoritos por `lib/supabase/favorites.ts`, condicionado a
   `isSupabaseConfigured()` para no romper el modo de muestra.
5. Regenerar `lib/supabase/database.types.ts` de verdad con
   `npx supabase gen types typescript` en cuanto exista el proyecto (el
   archivo actual está escrito a mano, reflejando la migración).

## 7. Contenido ficticio

Vehículos, precios, ubicaciones, datos de contacto y textos legales son de
ejemplo. La calculadora es orientativa y no constituye oferta financiera.
Las páginas legales son marcadores de posición: deben redactarlas
profesionales con los datos reales del operador.
