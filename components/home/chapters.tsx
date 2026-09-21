import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BodyType, Car } from "@/types/car";
import { carProfilePath } from "@/components/car/car-image";
import { cars } from "@/data/cars";

interface Chapter {
  title: string;
  copy: string;
  href: string;
  body: BodyType;
  sky: [string, string];
  glow: string;
  match: (car: Car) => boolean;
}

function ChapterScene({ chapter, uid }: { chapter: Chapter; uid: string }) {
  return (
    <svg
      viewBox="0 0 400 520"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full transition-transform duration-[700ms] ease-[var(--ease-out-quint)] group-hover:scale-[1.04]"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={chapter.sky[0]} />
          <stop offset="100%" stopColor={chapter.sky[1]} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="62%" r="52%">
          <stop offset="0%" stopColor={chapter.glow} stopOpacity="0.8" />
          <stop offset="100%" stopColor={chapter.glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="520" fill={`url(#sky-${uid})`} />
      <ellipse cx="200" cy="330" rx="230" ry="130" fill={`url(#glow-${uid})`} />
      <rect y="330" width="400" height="190" fill="#000000" opacity="0.55" />
      <g transform="translate(0,182) scale(1)">
        <ellipse cx="200" cy="146" rx="170" ry="11" fill="#000" opacity="0.5" />
        <path d={carProfilePath(chapter.body)} fill="#050505" />
        <path d={carProfilePath(chapter.body)} fill="none" stroke={chapter.glow} strokeOpacity="0.4" strokeWidth="1.4" />
      </g>
      <rect y="300" width="400" height="220" fill="#000000" opacity="0.35" />
    </svg>
  );
}

const CHAPTERS: Chapter[] = [
  {
    title: "Eléctricos",
    copy: "Etiqueta 0, sin restricciones de acceso y con el estado de la batería verificado.",
    href: "/coches?fuel=El%C3%A9ctrico",
    body: "Berlina",
    sky: ["#0a1620", "#0c2431"],
    glow: "#6fd3e4",
    match: (car) => car.fuel === "Eléctrico",
  },
  {
    title: "SUV",
    copy: "Altura, maletero y plazas de verdad para quien necesita que el coche aguante el día a día.",
    href: "/coches?bodyType=SUV",
    body: "SUV",
    sky: ["#131010", "#2a1d14"],
    glow: "#e0a468",
    match: (car) => car.bodyType === "SUV",
  },
  {
    title: "Hasta 25.000 €",
    copy: "Lo que cabe en un presupuesto ajustado sin renunciar a la revisión ni a la garantía.",
    href: "/coches?maxPrice=25000",
    body: "Compacto",
    sky: ["#0d0f12", "#1f242a"],
    glow: "#b9c4cf",
    match: (car) => car.price <= 25000,
  },
];

export function Chapters() {
  return (
    <section aria-labelledby="chapters-title" className="page mt-24 lg:mt-32">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="chapters-title" className="display-md max-w-[18ch] text-balance">
          Empieza por lo que ya tienes claro
        </h2>
        <Link
          href="/coches"
          className="text-sm text-graphite underline decoration-line underline-offset-[6px] transition-colors hover:text-ink hover:decoration-ink"
        >
          Ver el catálogo completo
        </Link>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHAPTERS.map((chapter, index) => (
          <li key={chapter.title} className={index === 0 ? "sm:col-span-2 lg:col-span-1" : undefined}>
            <Link
              href={chapter.href}
              className="dark-surface group relative flex aspect-[16/10] flex-col justify-end overflow-hidden rounded-md bg-night text-paper sm:aspect-[4/5] lg:aspect-[3/4]"
            >
              <div className="absolute inset-0 -z-10">
                <ChapterScene chapter={chapter} uid={chapter.title.replace(/\W/g, "")} />
              </div>
              <div className="relative p-6">
                <h3 className="display-sm flex items-center gap-2 text-[1.375rem]">
                  {chapter.title}
                  <ArrowUpRight
                    aria-hidden
                    className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </h3>
                <p className="mt-2 max-w-[34ch] text-[0.8125rem] leading-relaxed text-white/65">
                  {chapter.copy}
                </p>
                <p data-numeric className="mt-4 text-[0.75rem] text-white/45">
                  {cars.filter(chapter.match).length} coches disponibles
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
