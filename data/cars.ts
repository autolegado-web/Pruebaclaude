import type { Car, BodyType, Drivetrain, EnvironmentalLabel, Fuel, Transmission } from "@/types/car";
import { slugify } from "@/lib/utils";

/**
 * Semilla del catálogo.
 *
 * Cada fila describe un vehículo real de mercado (datos orientativos).
 * `buildCar` deriva el resto: slug, galería, financiación por defecto y
 * descripción. Para conectar fotografía real basta con rellenar `photos`
 * con URLs absolutas: el resto del sistema no cambia.
 */
interface Seed {
  brand: string;
  model: string;
  version: string;
  year: number;
  price: number;
  previousPrice?: number;
  mileage: number;
  fuel: Fuel;
  transmission: Transmission;
  power: number;
  bodyType: BodyType;
  doors: number;
  seats?: number;
  drivetrain: Drivetrain;
  color: string;
  /** Hex de la pintura, usado por el sistema de imágenes de muestra. */
  paint: string;
  location: string;
  label: EnvironmentalLabel;
  warranty: number;
  verified?: boolean;
  features: string[];
  note: string;
  days: number;
  /** URLs reales de fotografía. Si está vacío se usa la imagen de muestra. */
  photos?: string[];
}

const SEED: Seed[] = [
  {
    brand: "BMW", model: "Serie 3", version: "320d M Sport", year: 2022, price: 32900, previousPrice: 34500,
    mileage: 48500, fuel: "Diésel", transmission: "Automático", power: 190, bodyType: "Berlina", doors: 4,
    drivetrain: "Trasera", color: "Gris Mineral", paint: "#6b6f74", location: "Madrid", label: "C", warranty: 12,
    features: ["Paquete M Sport", "Faros LED adaptativos", "Head-up display", "Asientos deportivos", "Navegación profesional", "Cámara trasera", "Llantas 18\"", "Control de crucero adaptativo"],
    note: "Unidad procedente de renting con mantenimiento completo en red oficial. Interior en cuero Vernasca y distintivo M Sport de fábrica.",
    days: 6,
  },
  {
    brand: "Mercedes-Benz", model: "Clase C", version: "C 220 d AMG Line", year: 2023, price: 44900,
    mileage: 29400, fuel: "Diésel", transmission: "Automático", power: 200, bodyType: "Berlina", doors: 4,
    drivetrain: "Trasera", color: "Negro Obsidiana", paint: "#1c1d20", location: "Barcelona", label: "C", warranty: 24,
    features: ["AMG Line exterior", "MBUX pantalla 11,9\"", "Techo panorámico", "Iluminación ambiental 64 colores", "Portón eléctrico", "Cámara 360º", "Asientos calefactables"],
    note: "Segunda generación del MBUX con navegación de realidad aumentada. Primera mano y libro de revisiones al día.",
    days: 2,
  },
  {
    brand: "Audi", model: "A4", version: "40 TDI S line S tronic", year: 2021, price: 29500,
    mileage: 71200, fuel: "Diésel", transmission: "Automático", power: 204, bodyType: "Berlina", doors: 4,
    drivetrain: "Delantera", color: "Blanco Ibis", paint: "#e8e6e1", location: "Valencia", label: "C", warranty: 12,
    features: ["S line", "Virtual Cockpit", "Asientos deportivos", "Sensores de aparcamiento", "Llantas 18\"", "Audi pre sense"],
    note: "Mecánica 2.0 TDI con etiqueta C y consumo homologado contenido. Carrocería sin retoques de pintura.",
    days: 14,
  },
  {
    brand: "Porsche", model: "718", version: "Cayman 2.0", year: 2020, price: 62900,
    mileage: 34800, fuel: "Gasolina", transmission: "Automático", power: 300, bodyType: "Coupé", doors: 2, seats: 2,
    drivetrain: "Trasera", color: "Azul Gentian", paint: "#1f3a63", location: "Marbella", label: "C", warranty: 12,
    features: ["Cambio PDK", "Paquete Sport Chrono", "Escape deportivo", "Asientos deportivos plus", "Llantas 20\"", "Porsche Communication Management"],
    note: "Motor bóxer central con reparto de pesos equilibrado. Conservado en garaje y con mantenimiento en servicio oficial.",
    days: 21,
  },
  {
    brand: "Tesla", model: "Model 3", version: "Long Range AWD", year: 2023, price: 37900, previousPrice: 39900,
    mileage: 31000, fuel: "Eléctrico", transmission: "Automático", power: 498, bodyType: "Berlina", doors: 4,
    drivetrain: "Total", color: "Blanco Perla", paint: "#f1f0ee", location: "Madrid", label: "0", warranty: 24,
    features: ["Autonomía 629 km WLTP", "Tracción total dual motor", "Autopilot básico", "Techo de cristal", "Bomba de calor", "Carga rápida 250 kW"],
    note: "Batería con salud verificada en el punto de revisión de AUTORA. Incluye cable de carga tipo 2.",
    days: 4,
  },
  {
    brand: "Volkswagen", model: "Golf", version: "1.5 eTSI Life DSG", year: 2022, price: 23400,
    mileage: 42300, fuel: "Híbrido", transmission: "Automático", power: 150, bodyType: "Compacto", doors: 5,
    drivetrain: "Delantera", color: "Gris Dolphin", paint: "#7c8084", location: "Sevilla", label: "ECO", warranty: 12,
    features: ["Microhibridación 48V", "Digital Cockpit Pro", "Travel Assist", "Climatizador bizona", "Faros LED", "App Connect inalámbrico"],
    note: "Octava generación con etiqueta ECO gracias al sistema de 48 voltios. Ideal para uso urbano y viaje.",
    days: 9,
  },
  {
    brand: "Toyota", model: "Corolla", version: "1.8 125H Advance", year: 2022, price: 21900,
    mileage: 38900, fuel: "Híbrido", transmission: "Automático", power: 122, bodyType: "Compacto", doors: 5,
    drivetrain: "Delantera", color: "Rojo Emoción", paint: "#8e1f22", location: "Zaragoza", label: "ECO", warranty: 24,
    features: ["Híbrido autorecargable", "Toyota Safety Sense", "Cámara trasera", "Carga inalámbrica", "Llantas 17\"", "Climatizador bizona"],
    note: "Híbrido de cuarta generación con consumos reales por debajo de 5 l/100 km en ciudad.",
    days: 11,
  },
  {
    brand: "Volvo", model: "XC60", version: "B4 Momentum Pro", year: 2021, price: 39900,
    mileage: 62400, fuel: "Híbrido", transmission: "Automático", power: 197, bodyType: "SUV", doors: 5,
    drivetrain: "Delantera", color: "Gris Osmium", paint: "#5a5f63", location: "Bilbao", label: "ECO", warranty: 12,
    features: ["Pilot Assist", "Faros Thor LED", "Portón eléctrico", "Asientos calefactables", "Pantalla vertical 9\"", "Sensus Navigation"],
    note: "SUV de tamaño medio con microhibridación y acabado Momentum Pro. Tapicería en cuero Nappa perforado.",
    days: 18,
  },
  {
    brand: "Cupra", model: "Formentor", version: "2.0 TSI 310 4Drive DSG", year: 2022, price: 41500,
    mileage: 27600, fuel: "Gasolina", transmission: "Automático", power: 310, bodyType: "SUV", doors: 5,
    drivetrain: "Total", color: "Gris Magnético", paint: "#4b4f54", location: "Barcelona", label: "C", warranty: 12,
    features: ["Frenos Akebono", "Suspensión adaptativa DCC", "Asientos baquet cuero", "Escape Akrapovič", "Llantas 19\" cobre", "Beats Audio"],
    note: "Versión tope de gama con tracción total y cambio DSG de siete relaciones. Neumáticos cambiados este año.",
    days: 5,
  },
  {
    brand: "SEAT", model: "León", version: "1.5 TSI 130 Style", year: 2021, price: 17900,
    mileage: 58300, fuel: "Gasolina", transmission: "Manual", power: 130, bodyType: "Compacto", doors: 5,
    drivetrain: "Delantera", color: "Azul Mystery", paint: "#26354a", location: "Málaga", label: "C", warranty: 12,
    features: ["Faros Full LED", "Pantalla 10\"", "Climatizador bizona", "Control de crucero", "Llantas 17\"", "Sensores traseros"],
    note: "Compacto de uso particular con un solo propietario. Distribución y filtros al día.",
    days: 24,
  },
  {
    brand: "Peugeot", model: "3008", version: "1.5 BlueHDi GT Line EAT8", year: 2020, price: 22400,
    mileage: 79800, fuel: "Diésel", transmission: "Automático", power: 130, bodyType: "SUV", doors: 5,
    drivetrain: "Delantera", color: "Gris Artense", paint: "#6f7276", location: "Murcia", label: "C", warranty: 12,
    features: ["i-Cockpit digital", "Techo panorámico", "Portón manos libres", "Cámara 180º", "Faros Full LED", "Asientos con masaje"],
    note: "Acabado GT Line con el i-Cockpit de instrumentación elevada. Mantenimiento en red oficial.",
    days: 30,
  },
  {
    brand: "Hyundai", model: "Tucson", version: "1.6 TGDi 48V Maxx", year: 2023, price: 27900,
    mileage: 24100, fuel: "Híbrido", transmission: "Manual", power: 150, bodyType: "SUV", doors: 5,
    drivetrain: "Delantera", color: "Blanco Polar", paint: "#eceae6", location: "Madrid", label: "ECO", warranty: 36,
    features: ["Microhibridación 48V", "Pantalla 10,25\"", "Carplay inalámbrico", "Cámara trasera", "Llantas 17\"", "Asistente de mantenimiento de carril"],
    note: "Aún dentro de la garantía oficial de cinco años del fabricante, transferible al nuevo propietario.",
    days: 3,
  },
  {
    brand: "Kia", model: "Sportage", version: "1.6 T-GDi HEV Drive", year: 2022, price: 29900,
    mileage: 36700, fuel: "Híbrido", transmission: "Automático", power: 230, bodyType: "SUV", doors: 5,
    drivetrain: "Delantera", color: "Azul Oscuro", paint: "#2b3a4d", location: "Valencia", label: "ECO", warranty: 24,
    features: ["Híbrido 230 CV", "Doble pantalla curva", "Portón eléctrico", "Cámara 360º", "Asientos ventilados", "Head-up display"],
    note: "Híbrido completo con cambio automático de seis marchas. Revisiones selladas en concesionario oficial.",
    days: 8,
  },
  {
    brand: "Lexus", model: "UX", version: "250h Business", year: 2021, price: 27400,
    mileage: 44900, fuel: "Híbrido", transmission: "Automático", power: 184, bodyType: "SUV", doors: 5,
    drivetrain: "Delantera", color: "Gris Sonic", paint: "#82868a", location: "Madrid", label: "ECO", warranty: 24,
    features: ["Híbrido autorecargable", "Lexus Safety System+", "Navegación 10,3\"", "Cámara trasera", "Faros LED", "Tapicería Tahara"],
    note: "Acabado insonorizado y suspensión de tarado confortable. Batería híbrida con certificado de estado.",
    days: 16,
  },
  {
    brand: "Land Rover", model: "Range Rover Evoque", version: "D165 S", year: 2021, price: 36900,
    mileage: 53100, fuel: "Diésel", transmission: "Automático", power: 163, bodyType: "SUV", doors: 5,
    drivetrain: "Total", color: "Negro Santorini", paint: "#232528", location: "Marbella", label: "C", warranty: 12,
    features: ["Tracción total", "Pivi Pro", "Techo panorámico", "Cámara 3D", "Llantas 19\"", "Asientos en cuero Windsor"],
    note: "SUV compacto premium con tracción total permanente. Neumáticos con más del 80 % de dibujo.",
    days: 12,
  },
  {
    brand: "BMW", model: "iX3", version: "Impressive", year: 2022, price: 49900,
    mileage: 33400, fuel: "Eléctrico", transmission: "Automático", power: 286, bodyType: "SUV", doors: 5,
    drivetrain: "Trasera", color: "Azul Phytonic", paint: "#2c4f6b", location: "Barcelona", label: "0", warranty: 24,
    features: ["Autonomía 460 km WLTP", "Carga rápida 150 kW", "Harman Kardon", "Techo panorámico", "Head-up display", "Asientos deportivos"],
    note: "Eléctrico con arquitectura de quinta generación y bomba de calor de serie. Informe de salud de batería incluido.",
    days: 7,
  },
  {
    brand: "Audi", model: "Q5", version: "40 TDI quattro S tronic", year: 2020, price: 34900,
    mileage: 88200, fuel: "Diésel", transmission: "Automático", power: 190, bodyType: "SUV", doors: 5,
    drivetrain: "Total", color: "Gris Daytona", paint: "#5f6266", location: "Sevilla", label: "C", warranty: 12,
    features: ["Tracción quattro", "Virtual Cockpit", "Faros Matrix LED", "Portón eléctrico", "Asientos calefactables", "Llantas 19\""],
    note: "Tracción total permanente y cambio S tronic de siete velocidades. Historial de mantenimiento completo.",
    days: 27,
  },
  {
    brand: "Mercedes-Benz", model: "GLA", version: "200 d 8G-DCT Progressive", year: 2022, price: 34500,
    mileage: 41600, fuel: "Diésel", transmission: "Automático", power: 150, bodyType: "SUV", doors: 5,
    drivetrain: "Delantera", color: "Gris Montaña", paint: "#71757a", location: "Bilbao", label: "C", warranty: 12,
    features: ["MBUX con Hey Mercedes", "Faros LED High Performance", "Cámara de marcha atrás", "Climatizador", "Llantas 18\"", "Asistente de ángulo muerto"],
    note: "SUV compacto con doble pantalla de 10,25 pulgadas. Un único propietario desde su matriculación.",
    days: 19,
  },
  {
    brand: "Volkswagen", model: "ID.4", version: "Pro Performance 204 CV", year: 2022, price: 31900,
    mileage: 39800, fuel: "Eléctrico", transmission: "Automático", power: 204, bodyType: "SUV", doors: 5,
    drivetrain: "Trasera", color: "Azul Stonewashed", paint: "#3a5570", location: "Zaragoza", label: "0", warranty: 24,
    features: ["Batería 77 kWh", "Autonomía 520 km WLTP", "Carga 135 kW", "Bomba de calor", "Head-up display AR", "Portón eléctrico"],
    note: "Eléctrico familiar con maletero de 543 litros. Batería con garantía de fabricante hasta 160.000 km.",
    days: 13,
  },
  {
    brand: "Porsche", model: "Macan", version: "2.0 265 CV PDK", year: 2021, price: 58900,
    mileage: 46200, fuel: "Gasolina", transmission: "Automático", power: 265, bodyType: "SUV", doors: 5,
    drivetrain: "Total", color: "Blanco Carrara", paint: "#eeece8", location: "Madrid", label: "C", warranty: 12,
    features: ["Cambio PDK", "Suspensión PASM", "Paquete Sport Chrono", "Llantas 20\"", "Bose Surround", "Asientos calefactables"],
    note: "SUV deportivo con tracción total y suspensión adaptativa. Mantenimiento íntegro en Centro Porsche.",
    days: 10,
  },
  {
    brand: "Toyota", model: "RAV4", version: "2.5 220H Advance Plus", year: 2021, price: 31400,
    mileage: 64800, fuel: "Híbrido", transmission: "Automático", power: 218, bodyType: "SUV", doors: 5,
    drivetrain: "Delantera", color: "Gris Titanio", paint: "#797d81", location: "Valencia", label: "ECO", warranty: 24,
    features: ["Híbrido 218 CV", "Portón eléctrico", "Cámara 360º", "Carga inalámbrica", "Faros LED", "Toyota Safety Sense"],
    note: "Híbrido de gran fiabilidad con consumos ajustados. Incluye extensión de garantía Toyota Relax.",
    days: 22,
  },
  {
    brand: "Volvo", model: "V60", version: "B4 Plus Dark", year: 2023, price: 42900,
    mileage: 21300, fuel: "Híbrido", transmission: "Automático", power: 197, bodyType: "Familiar", doors: 5,
    drivetrain: "Delantera", color: "Negro Ónice", paint: "#202226", location: "Barcelona", label: "ECO", warranty: 24,
    features: ["Acabado Dark", "Google integrado", "Faros Full LED", "Portón eléctrico", "Asientos en cuero Nappa", "Harman Kardon"],
    note: "Familiar de 529 litros con acabado Plus Dark y sistema multimedia con Google integrado.",
    days: 1,
  },
  {
    brand: "BMW", model: "Serie 1", version: "118i Sport", year: 2021, price: 24900,
    mileage: 47500, fuel: "Gasolina", transmission: "Automático", power: 140, bodyType: "Compacto", doors: 5,
    drivetrain: "Delantera", color: "Blanco Alpine", paint: "#eae8e4", location: "Madrid", label: "C", warranty: 12,
    features: ["Línea Sport", "Live Cockpit Plus", "Faros LED", "Sensores de aparcamiento", "Llantas 17\"", "Control de crucero"],
    note: "Compacto premium con cambio automático de siete relaciones. Sin golpes ni repintados.",
    days: 15,
  },
  {
    brand: "Audi", model: "A3", version: "35 TFSI S tronic", year: 2022, price: 27900,
    mileage: 33200, fuel: "Gasolina", transmission: "Automático", power: 150, bodyType: "Compacto", doors: 5,
    drivetrain: "Delantera", color: "Gris Manhattan", paint: "#63676b", location: "Sevilla", label: "C", warranty: 12,
    features: ["Virtual Cockpit", "Faros LED", "Climatizador bizona", "Sensores de aparcamiento", "Llantas 18\"", "Carplay inalámbrico"],
    note: "Cuarta generación con motor 1.5 TFSI y desconexión de cilindros. Un propietario particular.",
    days: 17,
  },
  {
    brand: "Mercedes-Benz", model: "Clase A", version: "A 180 d AMG Line", year: 2021, price: 26900,
    mileage: 56400, fuel: "Diésel", transmission: "Automático", power: 116, bodyType: "Compacto", doors: 5,
    drivetrain: "Delantera", color: "Gris Denim", paint: "#5b6166", location: "Málaga", label: "C", warranty: 12,
    features: ["AMG Line", "MBUX doble pantalla", "Faros LED", "Cámara trasera", "Llantas 18\"", "Iluminación ambiental"],
    note: "Compacto premium con acabado AMG Line y cambio 7G-DCT. Revisiones al día en servicio oficial.",
    days: 23,
  },
  {
    brand: "Tesla", model: "Model Y", version: "RWD", year: 2023, price: 39900,
    mileage: 26800, fuel: "Eléctrico", transmission: "Automático", power: 299, bodyType: "SUV", doors: 5,
    drivetrain: "Trasera", color: "Gris Medianoche", paint: "#43474c", location: "Barcelona", label: "0", warranty: 24,
    features: ["Autonomía 455 km WLTP", "Maletero 854 litros", "Techo de cristal", "Bomba de calor", "Carga rápida Supercharger", "Autopilot básico"],
    note: "SUV eléctrico con gran capacidad de carga. Salud de batería verificada por el equipo técnico.",
    days: 5,
  },
  {
    brand: "Cupra", model: "Born", version: "58 kWh 204 CV", year: 2022, price: 27400, previousPrice: 28900,
    mileage: 29900, fuel: "Eléctrico", transmission: "Automático", power: 204, bodyType: "Compacto", doors: 5,
    drivetrain: "Trasera", color: "Azul Aurora", paint: "#2f4a6b", location: "Zaragoza", label: "0", warranty: 24,
    features: ["Batería 58 kWh", "Autonomía 420 km WLTP", "Asientos bucket", "Head-up display AR", "Carga 120 kW", "Llantas 20\""],
    note: "Eléctrico de tracción trasera con reparto de pesos equilibrado y dirección progresiva.",
    days: 20,
  },
  {
    brand: "Peugeot", model: "208", version: "PureTech 100 Allure", year: 2022, price: 15900,
    mileage: 31800, fuel: "Gasolina", transmission: "Manual", power: 100, bodyType: "Compacto", doors: 5,
    drivetrain: "Delantera", color: "Amarillo Faro", paint: "#c99a2e", location: "Murcia", label: "C", warranty: 12,
    features: ["i-Cockpit 3D", "Faros LED", "Cámara trasera", "Climatizador automático", "Llantas 16\"", "Carplay"],
    note: "Utilitario con bajo consumo y mantenimiento económico. Ideal como primer coche o segundo vehículo.",
    days: 26,
  },
  {
    brand: "Volkswagen", model: "Tiguan", version: "2.0 TDI 150 Life DSG", year: 2021, price: 28900,
    mileage: 68300, fuel: "Diésel", transmission: "Automático", power: 150, bodyType: "SUV", doors: 5,
    drivetrain: "Delantera", color: "Gris Pirita", paint: "#6d7175", location: "Bilbao", label: "C", warranty: 12,
    features: ["Faros IQ.Light", "Digital Cockpit", "Portón eléctrico", "Travel Assist", "Llantas 18\"", "Climatizador trizona"],
    note: "SUV familiar con asientos traseros deslizantes y 615 litros de maletero. Historial verificable.",
    days: 28,
  },
  {
    brand: "Hyundai", model: "Ioniq 5", version: "73 kWh RWD Star", year: 2023, price: 38900,
    mileage: 19700, fuel: "Eléctrico", transmission: "Automático", power: 229, bodyType: "SUV", doors: 5,
    drivetrain: "Trasera", color: "Gris Cyber", paint: "#8b8f93", location: "Madrid", label: "0", warranty: 36,
    features: ["Arquitectura 800V", "Carga 10-80 % en 18 min", "Autonomía 507 km WLTP", "V2L", "Techo solar", "Asientos relax"],
    note: "Plataforma de 800 voltios con una de las cargas más rápidas del mercado. Garantía de fabricante vigente.",
    days: 2,
  },
  {
    brand: "Kia", model: "EV6", version: "77 kWh GT-Line RWD", year: 2022, price: 41900,
    mileage: 28400, fuel: "Eléctrico", transmission: "Automático", power: 229, bodyType: "SUV", doors: 5,
    drivetrain: "Trasera", color: "Blanco Nieve", paint: "#f0efec", location: "Valencia", label: "0", warranty: 36,
    features: ["Autonomía 528 km WLTP", "Carga ultrarrápida 240 kW", "Doble pantalla curva", "Meridian Audio", "Head-up display AR", "V2L"],
    note: "Acabado GT-Line con suspensión específica y faros matriciales. Incluye cable de carga en modo 3.",
    days: 9,
  },
  {
    brand: "Land Rover", model: "Defender", version: "110 D250 SE", year: 2022, price: 68900,
    mileage: 37200, fuel: "Diésel", transmission: "Automático", power: 249, bodyType: "SUV", doors: 5, seats: 7,
    drivetrain: "Total", color: "Verde Pangea", paint: "#3c4a3e", location: "Marbella", label: "C", warranty: 24,
    features: ["Suspensión neumática", "Terrain Response 2", "Pivi Pro 11,4\"", "Siete plazas", "Cámara ClearSight", "Llantas 20\""],
    note: "Todoterreno de siete plazas con suspensión neumática y reductora. Mantenimiento en red oficial.",
    days: 4,
  },
];

function buildCar(seed: Seed, index: number): Car {
  const slug = slugify(`${seed.brand} ${seed.model} ${seed.version} ${seed.year}`);
  const listedAt = new Date(Date.UTC(2026, 8, 21) - seed.days * 86_400_000).toISOString();
  const shots: Array<{ view: string; alt: string }> = [
    { view: "perfil", alt: `${seed.brand} ${seed.model} ${seed.version} de ${seed.year} en color ${seed.color}, vista lateral` },
    { view: "frontal", alt: `${seed.brand} ${seed.model} ${seed.version}, vista frontal tres cuartos` },
    { view: "trasera", alt: `${seed.brand} ${seed.model} ${seed.version}, vista trasera` },
    { view: "interior", alt: `Interior del ${seed.brand} ${seed.model} ${seed.version}` },
    { view: "detalle", alt: `Detalle de llanta del ${seed.brand} ${seed.model} ${seed.version}` },
  ];

  return {
    id: `car_${String(index + 1).padStart(3, "0")}`,
    slug,
    brand: seed.brand,
    model: seed.model,
    version: seed.version,
    year: seed.year,
    price: seed.price,
    previousPrice: seed.previousPrice,
    mileage: seed.mileage,
    fuel: seed.fuel,
    transmission: seed.transmission,
    power: seed.power,
    bodyType: seed.bodyType,
    doors: seed.doors,
    seats: seed.seats ?? (seed.doors === 2 ? 4 : 5),
    drivetrain: seed.drivetrain,
    color: seed.color,
    location: seed.location,
    images: shots.map((shot, i) => ({
      // Sustituir por la URL real (CDN o Supabase Storage) sin tocar los componentes.
      url: seed.photos?.[i] ?? `sample:${seed.bodyType}:${seed.paint}:${shot.view}`,
      alt: shot.alt,
    })),
    description: seed.note,
    features: seed.features,
    environmentalLabel: seed.label,
    verified: seed.verified ?? true,
    warranty: seed.warranty,
    financing: {
      downPayment: Math.round((seed.price * 0.15) / 100) * 100,
      months: 60,
      apr: 7.95,
    },
    listedAt,
  };
}

export const cars: Car[] = SEED.map(buildCar);

export const brands: string[] = [...new Set(cars.map((c) => c.brand))].sort((a, b) =>
  a.localeCompare(b, "es"),
);

export const modelsByBrand: Record<string, string[]> = brands.reduce(
  (acc, brand) => {
    acc[brand] = [...new Set(cars.filter((c) => c.brand === brand).map((c) => c.model))].sort((a, b) =>
      a.localeCompare(b, "es"),
    );
    return acc;
  },
  {} as Record<string, string[]>,
);

export const locations: string[] = [...new Set(cars.map((c) => c.location))].sort((a, b) =>
  a.localeCompare(b, "es"),
);

export const priceRange = {
  min: Math.min(...cars.map((c) => c.price)),
  max: Math.max(...cars.map((c) => c.price)),
};
