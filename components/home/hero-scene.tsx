import { carProfilePath, CAR_PROFILE_GEOMETRY } from "@/components/car/car-image";

/**
 * Escena del hero.
 *
 * Es vectorial a propósito: pesa 4 kB, no depende de ninguna API externa y
 * no hay riesgo de que la fotografía no corresponda con el producto. Cuando
 * exista fotografía propia, este componente se sustituye por un <video> o
 * un next/image a sangre sin tocar el resto de la portada.
 */
export function HeroScene({ className }: { className?: string }) {
  const profile = CAR_PROFILE_GEOMETRY.axles.Berlina;

  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Un coche en silueta sobre una carretera al amanecer"
    >
      <defs>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#05070c" />
          <stop offset="46%" stopColor="#1b2230" />
          <stop offset="72%" stopColor="#5e5748" />
          <stop offset="100%" stopColor="#c59a5e" />
        </linearGradient>
        <radialGradient id="hero-sun" cx="52%" cy="100%" r="46%">
          <stop offset="0%" stopColor="#ffe9c2" stopOpacity="0.95" />
          <stop offset="38%" stopColor="#e9b877" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#e9b877" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hero-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#151313" />
          <stop offset="100%" stopColor="#040404" />
        </linearGradient>
        <linearGradient id="hero-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a332a" />
          <stop offset="100%" stopColor="#0b0b0c" />
        </linearGradient>
        <linearGradient id="hero-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4dcb4" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#f4dcb4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hero-reflection" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Cielo y sol bajo */}
      <rect width="1600" height="612" fill="url(#hero-sky)" />
      <ellipse cx="832" cy="612" rx="760" ry="300" fill="url(#hero-sun)" />
      <circle cx="832" cy="606" r="58" fill="#ffeecb" opacity="0.92" />

      {/* Bandas atmosféricas: lo único que rompe el degradado */}
      <g fill="#0d1017" opacity="0.5">
        <rect x="0" y="470" width="1600" height="7" />
        <rect x="0" y="512" width="1600" height="4" />
        <rect x="0" y="548" width="1600" height="3" />
      </g>

      {/* Suelo */}
      <rect y="606" width="1600" height="294" fill="url(#hero-ground)" />
      <path d="M0 606 H1600 V612 H0 Z" fill="#6d5a3d" opacity="0.5" />

      {/* Carretera en perspectiva */}
      <path d="M762 606 H902 L1320 900 H316 Z" fill="url(#hero-road)" opacity="0.9" />
      <g fill="#c9bda5" opacity="0.35">
        <path d="M826 612 h14 l3 26 h-20 Z" />
        <path d="M820 654 h26 l6 42 h-38 Z" />
        <path d="M808 712 h48 l9 70 h-66 Z" />
        <path d="M788 800 h84 l14 100 h-112 Z" />
      </g>

      {/* Coche en contraluz */}
      <g transform="translate(508, 356) scale(1.52)">
        <ellipse
          cx="200"
          cy={CAR_PROFILE_GEOMETRY.ground + 4}
          rx="196"
          ry="14"
          fill="url(#hero-reflection)"
        />
        <path d={carProfilePath("Berlina")} fill="#030303" />
        <path
          d={carProfilePath("Berlina")}
          fill="none"
          stroke="url(#hero-rim)"
          strokeWidth="1.6"
        />
        <circle cx={profile.frontAxle} cy="112" r="26" fill="#020202" />
        <circle cx={profile.rearAxle} cy="112" r="26" fill="#020202" />
        <ellipse cx={profile.x0 + 4} cy={profile.hoodY + 6} rx="16" ry="7" fill="#ffeaca" opacity="0.5" />
      </g>

      {/* Viñeteado inferior para que el texto respire */}
      <rect y="620" width="1600" height="280" fill="#000000" opacity="0.28" />
    </svg>
  );
}
