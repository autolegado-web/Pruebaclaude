import Image from "next/image";
import type { BodyType } from "@/types/car";
import { cn } from "@/lib/utils";

/**
 * Sistema de imágenes del catálogo.
 *
 * `url` admite dos formas:
 *   1. Una URL real (`/cars/bmw-320d/01.jpg` o `https://cdn…/01.jpg`) → se
 *      renderiza con next/image, con lazy loading y formatos modernos.
 *   2. Un descriptor `sample:<carrocería>:<pintura>:<toma>` → se dibuja un
 *      estudio vectorial coherente con el vehículo. Sin peticiones externas,
 *      sin API que se pueda caer y sin fotos que no correspondan al coche.
 *
 * Para pasar a fotografía real solo hay que cambiar `images[].url` en los
 * datos. Ningún componente necesita cambios.
 */

type View = "perfil" | "frontal" | "trasera" | "interior" | "detalle";

interface Profile {
  x0: number;
  hoodY: number;
  wsBaseX: number;
  roofFrontX: number;
  roofY: number;
  roofRearX: number;
  rearGlassBX: number;
  deckY: number;
  rearX: number;
  frontAxle: number;
  rearAxle: number;
}

const BOTTOM = 116;
const GROUND = 140;

const PROFILES: Record<BodyType, Profile> = {
  Berlina:      { x0: 26, hoodY: 90, wsBaseX: 132, roofFrontX: 176, roofY: 50, roofRearX: 252, rearGlassBX: 320, deckY: 84, rearX: 376, frontAxle: 96, rearAxle: 306 },
  Compacto:     { x0: 42, hoodY: 88, wsBaseX: 126, roofFrontX: 166, roofY: 46, roofRearX: 260, rearGlassBX: 316, deckY: 72, rearX: 346, frontAxle: 104, rearAxle: 292 },
  SUV:          { x0: 28, hoodY: 82, wsBaseX: 128, roofFrontX: 166, roofY: 34, roofRearX: 300, rearGlassBX: 350, deckY: 62, rearX: 372, frontAxle: 98, rearAxle: 306 },
  Familiar:     { x0: 26, hoodY: 90, wsBaseX: 132, roofFrontX: 176, roofY: 48, roofRearX: 314, rearGlassBX: 352, deckY: 68, rearX: 378, frontAxle: 96, rearAxle: 308 },
  Coupé:        { x0: 24, hoodY: 94, wsBaseX: 142, roofFrontX: 188, roofY: 52, roofRearX: 234, rearGlassBX: 330, deckY: 90, rearX: 378, frontAxle: 98, rearAxle: 308 },
  Cabrio:       { x0: 24, hoodY: 94, wsBaseX: 142, roofFrontX: 186, roofY: 64, roofRearX: 196, rearGlassBX: 300, deckY: 94, rearX: 376, frontAxle: 98, rearAxle: 306 },
  Monovolumen:  { x0: 34, hoodY: 86, wsBaseX: 110, roofFrontX: 148, roofY: 30, roofRearX: 318, rearGlassBX: 356, deckY: 58, rearX: 370, frontAxle: 100, rearAxle: 304 },
  "Pick-up":    { x0: 26, hoodY: 86, wsBaseX: 124, roofFrontX: 160, roofY: 40, roofRearX: 242, rearGlassBX: 266, deckY: 78, rearX: 382, frontAxle: 96, rearAxle: 312 },
};

export function carProfilePath(bodyType: BodyType): string {
  return bodyPath(PROFILES[bodyType] ?? PROFILES.Berlina);
}

export const CAR_PROFILE_GEOMETRY = { bottom: BOTTOM, ground: GROUND, axles: PROFILES };

function bodyPath(p: Profile): string {
  return [
    `M ${p.x0} ${BOTTOM}`,
    `L ${p.x0} ${p.hoodY + 8}`,
    `Q ${p.x0 + 2} ${p.hoodY} ${p.x0 + 20} ${p.hoodY - 1}`,
    `L ${p.wsBaseX} ${p.hoodY - 8}`,
    `Q ${p.wsBaseX + 12} ${p.hoodY - 10} ${p.roofFrontX} ${p.roofY}`,
    `L ${p.roofRearX} ${p.roofY}`,
    `Q ${p.roofRearX + 16} ${p.roofY + 1} ${p.rearGlassBX} ${p.deckY}`,
    `L ${p.rearX - 16} ${p.deckY + 3}`,
    `Q ${p.rearX} ${p.deckY + 6} ${p.rearX} ${p.deckY + 18}`,
    `L ${p.rearX} ${BOTTOM}`,
    "Z",
  ].join(" ");
}

function glassPath(p: Profile): string {
  const isPickup = p.rearGlassBX - p.roofRearX < 40;
  const rearBottomX = isPickup ? p.rearGlassBX - 4 : p.rearGlassBX - 14;
  const rearBottomY = isPickup ? p.deckY - 2 : p.deckY - 6;
  return [
    `M ${p.wsBaseX + 10} ${p.hoodY - 12}`,
    `L ${p.roofFrontX + 10} ${p.roofY + 9}`,
    `L ${p.roofRearX - 8} ${p.roofY + 9}`,
    `L ${rearBottomX} ${rearBottomY}`,
    "Z",
  ].join(" ");
}

function Wheel({ cx, paint }: { cx: number; paint: string }) {
  return (
    <g>
      <circle cx={cx} cy={112} r={26} fill="#15161a" />
      <circle cx={cx} cy={112} r={15} fill="#c9c9c9" />
      <circle cx={cx} cy={112} r={15} fill="none" stroke={paint} strokeOpacity="0.35" strokeWidth="1.5" />
      <circle cx={cx} cy={112} r={4.5} fill="#8d8f93" />
    </g>
  );
}

const VIEW_TRANSFORM: Record<Exclude<View, "interior">, string> = {
  perfil: "translate(0,0) scale(1)",
  frontal: "translate(-18,-14) scale(1.26)",
  trasera: "translate(-262,-12) scale(1.24)",
  detalle: "translate(-150,-170) scale(2.4)",
};

function isLight(hex: string): boolean {
  const v = hex.replace("#", "");
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 165;
}

function SampleInterior({ paint, uid }: { paint: string; uid: string }) {
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full" role="presentation" aria-hidden="true">
      <defs>
        <linearGradient id={`cab-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2c30" />
          <stop offset="100%" stopColor="#121316" />
        </linearGradient>
        <linearGradient id={`win-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9d2da" />
          <stop offset="100%" stopColor="#8d9aa6" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill={`url(#cab-${uid})`} />
      <rect x="28" y="24" width="344" height="78" rx="6" fill={`url(#win-${uid})`} opacity="0.85" />
      <path d="M0 108 L400 96 L400 130 L0 140 Z" fill="#15171a" />
      <rect x="196" y="112" width="150" height="30" rx="4" fill="#0c0d0f" />
      <rect x="204" y="119" width="58" height="4" rx="2" fill={paint} opacity="0.75" />
      <rect x="204" y="128" width="98" height="3" rx="1.5" fill="#63676c" />
      <g stroke="#3a3d42" strokeWidth="6" fill="none" strokeLinecap="round">
        <circle cx="96" cy="164" r="40" />
        <path d="M60 164 H132 M96 164 V204" />
      </g>
      <rect x="66" y="120" width="60" height="24" rx="4" fill="#0c0d0f" />
      <circle cx="82" cy="132" r="7" fill="none" stroke="#5a5e63" strokeWidth="2" />
      <circle cx="110" cy="132" r="7" fill="none" stroke="#5a5e63" strokeWidth="2" />
      <path d="M0 214 H400 V260 H0 Z" fill="#1b1d21" />
      <path d="M236 206 q54 -6 108 0 l0 54 -108 0 Z" fill="#232529" />
    </svg>
  );
}

function SampleShot({ bodyType, paint, view, uid }: { bodyType: BodyType; paint: string; view: View; uid: string }) {
  if (view === "interior") return <SampleInterior paint={paint} uid={uid} />;

  const p = PROFILES[bodyType] ?? PROFILES.Berlina;
  const light = isLight(paint);

  return (
    <svg viewBox="0 0 400 260" className="h-full w-full" role="presentation" aria-hidden="true">
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f2f1ef" />
          <stop offset="58%" stopColor="#e4e2de" />
          <stop offset="100%" stopColor="#d3d1cd" />
        </linearGradient>
        <radialGradient id={`spot-${uid}`} cx="50%" cy="34%" r="62%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`paint-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={paint} stopOpacity={light ? 1 : 0.94} />
          <stop offset="52%" stopColor={paint} />
          <stop offset="100%" stopColor="#000000" stopOpacity={light ? 0.18 : 0.42} />
        </linearGradient>
        <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#dfe5ea" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#8e99a4" stopOpacity="0.95" />
        </linearGradient>
        <radialGradient id={`shadow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="260" fill={`url(#bg-${uid})`} />
      <rect width="400" height="260" fill={`url(#spot-${uid})`} />

      <g transform={`translate(0,42) ${VIEW_TRANSFORM[view]}`}>
        <ellipse cx="200" cy={GROUND + 2} rx="178" ry="17" fill={`url(#shadow-${uid})`} />
        <path d={bodyPath(p)} fill={`url(#paint-${uid})`} />
        <path d={bodyPath(p)} fill="none" stroke="#000000" strokeOpacity="0.16" strokeWidth="1" />
        <path d={glassPath(p)} fill={`url(#glass-${uid})`} />
        <path
          d={`M ${p.x0 + 18} ${BOTTOM - 16} L ${p.rearX - 22} ${BOTTOM - 22}`}
          stroke="#ffffff"
          strokeOpacity={light ? 0.5 : 0.22}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <rect x={p.x0} y={p.hoodY + 2} width="12" height="7" rx="3" fill="#f7f4ea" opacity="0.9" />
        <rect x={p.rearX - 12} y={p.deckY + 12} width="11" height="6" rx="2.5" fill="#b0342c" opacity="0.85" />
        <Wheel cx={p.frontAxle} paint={paint} />
        <Wheel cx={p.rearAxle} paint={paint} />
      </g>
    </svg>
  );
}

export interface CarImageProps {
  url: string;
  alt: string;
  bodyType: BodyType;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Se aplica al contenedor; la imagen llena el espacio disponible. */
  fit?: "cover" | "contain";
}

export function CarImage({
  url,
  alt,
  bodyType,
  className,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
  fit = "cover",
}: CarImageProps) {
  if (url.startsWith("sample:")) {
    const [, , paint = "#6b6f74", view = "perfil"] = url.split(":");
    const uid = `${bodyType}-${paint.replace("#", "")}-${view}`;
    return (
      <div className={cn("relative h-full w-full overflow-hidden bg-ash", className)}>
        <SampleShot bodyType={bodyType} paint={paint} view={view as View} uid={uid} />
        <span className="sr-only">{alt}</span>
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-ash", className)}>
      <Image
        src={url}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={fit === "cover" ? "object-cover" : "object-contain"}
      />
    </div>
  );
}
