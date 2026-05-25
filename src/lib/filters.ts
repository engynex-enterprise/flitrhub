import type {
  BodyType,
  BreastsType,
  Ethnicity,
  HairColor,
  Language,
  PaymentMethod,
  ServiceLocation,
  TimeSlot,
  Tier,
} from "./mock-posts";

export type SortKey =
  | "relevance"
  | "rating"
  | "age-asc"
  | "age-desc"
  | "price-asc"
  | "price-desc"
  | "distance";

export type ViewMode = "card" | "list";

export type TriState = "any" | "yes" | "no";
export type BreastsFilter = "any" | BreastsType;
export type HeightFilter = "all" | "short" | "medium" | "tall" | "very-tall";

export interface Filters {
  search: string;
  sort: SortKey;

  // Categoría
  tier: Tier | "all";
  featuredOnly: boolean;

  // Ubicación
  zones: string[];
  distanceKm: number | null;
  serviceLocations: ServiceLocation[];

  // Físico
  ageRange: "all" | "18-25" | "26-35" | "36+";
  heightRange: HeightFilter;
  bodyTypes: BodyType[];
  hairColors: HairColor[];
  ethnicities: Ethnicity[];
  breasts: BreastsFilter;
  tattoos: TriState;
  piercings: TriState;

  // Idiomas
  languages: Language[];

  // Disponibilidad
  availabilitySlots: TimeSlot[];

  // Precio / Pago
  maxPrice: number | null;
  paymentMethods: PaymentMethod[];

  // Calidad
  withVideo: boolean;
  verifiedOnly: boolean;
  onlineOnly: boolean;
  favoritesOnly: boolean;
  minRating: number | null;
}

export const DEFAULT_FILTERS: Filters = {
  search: "",
  sort: "relevance",

  tier: "all",
  featuredOnly: false,

  zones: [],
  distanceKm: null,
  serviceLocations: [],

  ageRange: "all",
  heightRange: "all",
  bodyTypes: [],
  hairColors: [],
  ethnicities: [],
  breasts: "any",
  tattoos: "any",
  piercings: "any",

  languages: [],
  availabilitySlots: [],

  maxPrice: null,
  paymentMethods: [],

  withVideo: false,
  verifiedOnly: false,
  onlineOnly: false,
  favoritesOnly: false,
  minRating: null,
};

export const ZONES = [
  "Usaquén", "Chapinero", "Chicó", "Zona Rosa", "Centro",
  "Salitre", "Modelia", "Suba", "Cedritos", "Teusaquillo",
];

export const TIER_OPTIONS: { value: Tier | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "platino", label: "Platino" },
  { value: "oro", label: "Oro" },
  { value: "plata", label: "Plata" },
  { value: "basico", label: "Básico" },
];

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "relevance", label: "Relevancia" },
  { value: "rating", label: "Mejor valorados" },
  { value: "price-asc", label: "Precio ↑" },
  { value: "price-desc", label: "Precio ↓" },
  { value: "age-asc", label: "Menor edad" },
  { value: "age-desc", label: "Mayor edad" },
  { value: "distance", label: "Más cerca" },
];

export const AGE_OPTIONS: { value: Filters["ageRange"]; label: string }[] = [
  { value: "all", label: "Cualquier edad" },
  { value: "18-25", label: "18 — 25" },
  { value: "26-35", label: "26 — 35" },
  { value: "36+", label: "36 o más" },
];

export const HEIGHT_OPTIONS: { value: HeightFilter; label: string }[] = [
  { value: "all", label: "Cualquier estatura" },
  { value: "short", label: "Bajita (< 1.60)" },
  { value: "medium", label: "Media (1.60 – 1.70)" },
  { value: "tall", label: "Alta (1.70 – 1.80)" },
  { value: "very-tall", label: "Muy alta (> 1.80)" },
];

export const PRICE_PRESETS: { value: number | null; label: string }[] = [
  { value: null, label: "Cualquiera" },
  { value: 200, label: "Hasta $200k" },
  { value: 350, label: "Hasta $350k" },
  { value: 500, label: "Hasta $500k" },
  { value: 800, label: "Hasta $800k" },
];

export const DISTANCE_OPTIONS: { value: number | null; label: string }[] = [
  { value: null, label: "Cualquier distancia" },
  { value: 2, label: "Hasta 2 km" },
  { value: 5, label: "Hasta 5 km" },
  { value: 10, label: "Hasta 10 km" },
  { value: 20, label: "Hasta 20 km" },
  { value: 50, label: "Hasta 50 km" },
];

export const RATING_OPTIONS: { value: number | null; label: string }[] = [
  { value: null, label: "Cualquier rating" },
  { value: 3, label: "3.0+ ★" },
  { value: 3.5, label: "3.5+ ★" },
  { value: 4, label: "4.0+ ★" },
  { value: 4.5, label: "4.5+ ★" },
];

export const SERVICE_LOCATION_OPTIONS: { value: ServiceLocation; label: string }[] = [
  { value: "incall", label: "En su lugar" },
  { value: "outcall", label: "Domicilio" },
  { value: "virtual", label: "Virtual" },
];

export const BODY_TYPE_OPTIONS: { value: BodyType; label: string }[] = [
  { value: "delgada", label: "Delgada" },
  { value: "atletica", label: "Atlética" },
  { value: "curvilinea", label: "Curvilínea" },
  { value: "voluptuosa", label: "Voluptuosa" },
  { value: "plus", label: "Plus" },
];

export const HAIR_COLOR_OPTIONS: { value: HairColor; label: string }[] = [
  { value: "rubia", label: "Rubia" },
  { value: "morena", label: "Morena" },
  { value: "pelirroja", label: "Pelirroja" },
  { value: "negro", label: "Negro" },
];

export const ETHNICITY_OPTIONS: { value: Ethnicity; label: string }[] = [
  { value: "latina", label: "Latina" },
  { value: "colombiana", label: "Colombiana" },
  { value: "venezolana", label: "Venezolana" },
  { value: "europea", label: "Europea" },
  { value: "asiatica", label: "Asiática" },
];

export const BREASTS_OPTIONS: { value: BreastsFilter; label: string }[] = [
  { value: "any", label: "Cualquiera" },
  { value: "natural", label: "Naturales" },
  { value: "operada", label: "Operadas" },
];

export const TRI_STATE_OPTIONS: { value: TriState; label: string }[] = [
  { value: "any", label: "Cualquiera" },
  { value: "yes", label: "Sí" },
  { value: "no", label: "No" },
];

export const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: "es", label: "Español" },
  { value: "en", label: "Inglés" },
  { value: "pt", label: "Portugués" },
  { value: "fr", label: "Francés" },
  { value: "it", label: "Italiano" },
];

export const TIME_SLOT_OPTIONS: { value: TimeSlot; label: string }[] = [
  { value: "manana", label: "Mañana" },
  { value: "tarde", label: "Tarde" },
  { value: "noche", label: "Noche" },
  { value: "madrugada", label: "Madrugada" },
];

export const PAYMENT_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: "efectivo", label: "Efectivo" },
  { value: "tarjeta", label: "Tarjeta" },
  { value: "transferencia", label: "Transferencia" },
  { value: "crypto", label: "Crypto" },
];

export function countActiveFilters(f: Filters): number {
  let n = 0;
  if (f.search.trim()) n++;
  if (f.tier !== "all") n++;
  if (f.featuredOnly) n++;
  if (f.zones.length > 0) n++;
  if (f.distanceKm !== null) n++;
  if (f.serviceLocations.length > 0) n++;
  if (f.ageRange !== "all") n++;
  if (f.heightRange !== "all") n++;
  if (f.bodyTypes.length > 0) n++;
  if (f.hairColors.length > 0) n++;
  if (f.ethnicities.length > 0) n++;
  if (f.breasts !== "any") n++;
  if (f.tattoos !== "any") n++;
  if (f.piercings !== "any") n++;
  if (f.languages.length > 0) n++;
  if (f.availabilitySlots.length > 0) n++;
  if (f.maxPrice !== null) n++;
  if (f.paymentMethods.length > 0) n++;
  if (f.withVideo) n++;
  if (f.verifiedOnly) n++;
  if (f.onlineOnly) n++;
  if (f.favoritesOnly) n++;
  if (f.minRating !== null) n++;
  return n;
}

export function matchesHeight(height: number, f: HeightFilter): boolean {
  switch (f) {
    case "all":
      return true;
    case "short":
      return height < 160;
    case "medium":
      return height >= 160 && height < 170;
    case "tall":
      return height >= 170 && height < 180;
    case "very-tall":
      return height >= 180;
  }
}
