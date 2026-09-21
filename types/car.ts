export type Fuel =
  | "Gasolina"
  | "Diésel"
  | "Híbrido"
  | "Híbrido enchufable"
  | "Eléctrico";

export type Transmission = "Manual" | "Automático";

export type BodyType =
  | "Berlina"
  | "SUV"
  | "Compacto"
  | "Familiar"
  | "Coupé"
  | "Cabrio"
  | "Monovolumen"
  | "Pick-up";

export type EnvironmentalLabel = "0" | "ECO" | "C" | "B";

export type Drivetrain = "Delantera" | "Trasera" | "Total";

export interface CarImage {
  /** URL relativa (/cars/...) o absoluta (CDN). Sustituible sin tocar componentes. */
  url: string;
  alt: string;
}

export interface Car {
  id: string;
  slug: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  /** Precio de venta al contado, en euros. */
  price: number;
  /** Precio anterior, si el vehículo ha bajado de precio. */
  previousPrice?: number;
  mileage: number;
  fuel: Fuel;
  transmission: Transmission;
  /** Potencia en CV. */
  power: number;
  bodyType: BodyType;
  doors: number;
  seats: number;
  drivetrain: Drivetrain;
  color: string;
  location: string;
  images: CarImage[];
  description: string;
  features: string[];
  environmentalLabel: EnvironmentalLabel;
  /** Revisado por el equipo técnico de AUTORA. */
  verified: boolean;
  /** Meses de garantía incluidos. */
  warranty: number;
  financing: {
    /** Entrada sugerida por defecto, en euros. */
    downPayment: number;
    /** Plazo por defecto, en meses. */
    months: number;
    /** TAE orientativa. */
    apr: number;
  };
  /** Fecha de publicación ISO, para ordenar por novedad. */
  listedAt: string;
  sold?: boolean;
}

export type SortKey =
  | "relevancia"
  | "precio-asc"
  | "precio-desc"
  | "nuevos"
  | "km-asc";

export interface CarFilters {
  q?: string;
  brand?: string[];
  model?: string[];
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxMileage?: number;
  fuel?: Fuel[];
  transmission?: Transmission[];
  bodyType?: BodyType[];
  minPower?: number;
  environmentalLabel?: EnvironmentalLabel[];
  location?: string[];
  sort?: SortKey;
  page?: number;
}
