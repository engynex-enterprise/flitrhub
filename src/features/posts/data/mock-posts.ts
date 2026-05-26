import { services, type ServiceKey } from "./services";
import { SERVICE_FORM_CONFIG } from "./service-form-config";

export type Tier = "platino" | "oro" | "plata" | "basico";
export type BodyType = "delgada" | "atletica" | "curvilinea" | "voluptuosa" | "plus";
export type HairColor = "rubia" | "morena" | "pelirroja" | "negro";
export type Ethnicity = "latina" | "colombiana" | "venezolana" | "europea" | "asiatica";
export type BreastsType = "natural" | "operada";
export type Language = "es" | "en" | "pt" | "fr" | "it";
export type ServiceLocation = "incall" | "outcall" | "virtual";
export type PaymentMethod = "efectivo" | "tarjeta" | "transferencia" | "crypto";
export type TimeSlot = "manana" | "tarde" | "noche" | "madrugada";

export interface Post {
  id: string;
  name: string;
  age: number;
  location: string;
  city: string;
  imageUrl: string;
  tier: Tier;
  hasVideo: boolean;
  rating?: number;
  service: ServiceKey;
  verified: boolean;
  isOnline: boolean;
  isNew: boolean;
  isFeatured: boolean;
  pricePerHour: number;
  description: string;

  // physical
  height: number; // cm
  bodyType: BodyType;
  hairColor: HairColor;
  ethnicity: Ethnicity;
  breasts: BreastsType;
  hasTattoos: boolean;
  hasPiercings: boolean;

  // capabilities
  languages: Language[];
  serviceLocations: ServiceLocation[];
  paymentMethods: PaymentMethod[];
  availableSlots: TimeSlot[];
  distanceKm: number; // simulated distance from user

  // service-specific (optional — populated based on `service` via SERVICE_FORM_CONFIG)
  specialties?: string[];
  extras?: string[];
  role?: string;
  partner?: { name: string; age: number; gender: "M" | "F" };
  groupCapacity?: number;

  // engagement / trust metadata (shown across services)
  reviewsCount: number;
  viewsCount: number;
  responseTimeMins: number;
  memberSinceMonths: number;
  lastActiveMins: number;
}

const NAMES = [
  "Mia Camila", "Alejandra", "Valentina", "Sofía", "Isabella",
  "Mariana", "Daniela", "Luciana", "Antonella", "Camila",
  "Salomé", "Manuela", "Juliana", "Gabriela", "Renata",
  "Sara", "Paula", "Laura", "Andrea", "Catalina",
];

const ZONES = [
  "Usaquén", "Chapinero", "Chicó", "Zona Rosa", "Centro",
  "Salitre", "Modelia", "Suba", "Cedritos", "Teusaquillo",
];

const DESCRIPTIONS = [
  "Ven y disfruta de un momento inolvidable, total discreción y privacidad.",
  "Atención personalizada en ambiente cómodo y elegante.",
  "Servicios premium para clientes exigentes. Reserva con anticipación.",
  "Disponibilidad en hoteles y domicilios. Llámame.",
  "Experiencia, sensualidad y conexión real garantizada.",
];

const TIERS: Tier[] = ["platino", "platino", "oro", "oro", "plata", "basico"];
const BODY_TYPES: BodyType[] = ["delgada", "atletica", "curvilinea", "voluptuosa", "plus"];
const HAIR_COLORS: HairColor[] = ["rubia", "morena", "pelirroja", "negro"];
const ETHNICITIES: Ethnicity[] = ["latina", "colombiana", "venezolana", "europea", "asiatica"];

function rand<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function bit(seed: number, threshold: number): boolean {
  // threshold 0..100 — bigger = more likely true
  return (seed * 37) % 100 < threshold;
}

function pseudoImage(seed: number) {
  return `https://picsum.photos/seed/flitr-${seed}/600/800`;
}

function pickN<T>(arr: T[], seed: number, n: number): T[] {
  if (arr.length === 0) return [];
  const count = Math.max(1, Math.min(n, arr.length));
  const out: T[] = [];
  const used = new Set<number>();
  let offset = 0;
  while (out.length < count && offset < arr.length * 3) {
    const idx = (seed * 17 + offset * 23) % arr.length;
    if (!used.has(idx)) {
      used.add(idx);
      out.push(arr[idx]);
    }
    offset++;
  }
  return out;
}

const PARTNER_NAMES_M = ["Carlos", "Andrés", "Mateo", "Sebastián", "Daniel"];
const PARTNER_NAMES_F = ["Camila", "Sofía", "Andrea", "Valeria", "Mariana"];

export function generatePosts(
  page: number,
  pageSize: number,
  service: ServiceKey,
  city: string = "Bogotá"
): Post[] {
  const posts: Post[] = [];
  const start = page * pageSize;
  for (let i = 0; i < pageSize; i++) {
    const seed = start + i;
    const tier = rand(TIERS, seed + 3);
    const isPremium = tier === "platino" || tier === "oro";

    const languages: Language[] = ["es"];
    if (bit(seed, 50)) languages.push("en");
    if (bit(seed + 7, 25)) languages.push("pt");
    if (bit(seed + 11, 15)) languages.push("fr");
    if (bit(seed + 13, 12)) languages.push("it");

    const serviceLocations: ServiceLocation[] = [];
    if (bit(seed, 70)) serviceLocations.push("incall");
    if (bit(seed + 3, 65)) serviceLocations.push("outcall");
    if (bit(seed + 9, 30)) serviceLocations.push("virtual");
    if (serviceLocations.length === 0) serviceLocations.push("incall");

    const paymentMethods: PaymentMethod[] = ["efectivo"];
    if (bit(seed + 2, 60)) paymentMethods.push("tarjeta");
    if (bit(seed + 5, 70)) paymentMethods.push("transferencia");
    if (bit(seed + 17, 20)) paymentMethods.push("crypto");

    const availableSlots: TimeSlot[] = [];
    if (bit(seed + 1, 45)) availableSlots.push("manana");
    if (bit(seed + 2, 70)) availableSlots.push("tarde");
    if (bit(seed + 4, 85)) availableSlots.push("noche");
    if (bit(seed + 6, 25)) availableSlots.push("madrugada");
    if (availableSlots.length === 0) availableSlots.push("tarde");

    // Service-specific chip data, sourced from the form config so labels stay in sync.
    const cfg = SERVICE_FORM_CONFIG[service];
    const specialties = cfg.specialties
      ? pickN(
          cfg.specialties.options.map((o) => o.value),
          seed + 19,
          2 + (seed % 3) // 2–4 items
        )
      : undefined;
    const extras = cfg.extras
      ? pickN(
          cfg.extras.options.map((o) => o.value),
          seed + 31,
          1 + (seed % 3) // 1–3 items
        )
      : undefined;
    const role = cfg.role
      ? rand(
          cfg.role.options.map((o) => o.value),
          seed + 41
        )
      : undefined;
    const partner = cfg.showPartner
      ? {
          name: rand(seed % 2 === 0 ? PARTNER_NAMES_M : PARTNER_NAMES_F, seed),
          age: 24 + (seed % 12),
          gender: (seed % 2 === 0 ? "M" : "F") as "M" | "F",
        }
      : undefined;
    const groupCapacity = cfg.showGroupCapacity ? 4 + (seed % 12) : undefined;

    posts.push({
      id: `${service}-${city}-${seed}`,
      name: rand(NAMES, seed),
      age: 20 + (seed % 15),
      location: rand(ZONES, seed + 1),
      city,
      imageUrl: pseudoImage(seed + service.length * 17),
      tier,
      hasVideo: seed % 3 === 0,
      rating:
        seed % 2 === 0
          ? Number((3.2 + ((seed * 13) % 18) / 10).toFixed(1))
          : undefined,
      service,
      verified: isPremium || seed % 4 === 0,
      isOnline: seed % 5 !== 0,
      isNew: seed < 6,
      isFeatured: tier === "platino",
      pricePerHour: 150 + ((seed * 47) % 12) * 50,
      description: rand(DESCRIPTIONS, seed),

      height: 155 + ((seed * 11) % 31), // 155–185
      bodyType: rand(BODY_TYPES, seed + 1),
      hairColor: rand(HAIR_COLORS, seed + 2),
      ethnicity: rand(ETHNICITIES, seed + 3),
      breasts: bit(seed, 55) ? "operada" : "natural",
      hasTattoos: bit(seed + 1, 45),
      hasPiercings: bit(seed + 2, 35),

      languages,
      serviceLocations,
      paymentMethods,
      availableSlots,
      distanceKm: 1 + ((seed * 7) % 40), // 1–40 km

      specialties,
      extras,
      role,
      partner,
      groupCapacity,

      reviewsCount: 3 + ((seed * 7) % 120),
      viewsCount: 200 + ((seed * 131) % 12000),
      responseTimeMins: 1 + ((seed * 3) % 45),
      memberSinceMonths: 1 + ((seed * 5) % 36),
      lastActiveMins: seed % 5 === 0 ? 0 : 5 + ((seed * 11) % 240),
    });
  }
  return posts;
}

export function generateFeatured(service: ServiceKey, city: string = "Bogotá"): Post[] {
  return generatePosts(0, 10, service, city).filter((p) => p.isFeatured);
}

export function generateStories(service: ServiceKey, city: string = "Bogotá"): Post[] {
  return generatePosts(0, 18, service, city)
    .filter((p) => p.isOnline)
    .slice(0, 14);
}

const PAGE_SIZE_FOR_LOOKUP = 12;

/**
 * Reverses a Post.id back to the original Post by re-running the deterministic
 * generator with the same seed. Format: `${service}-${city}-${seed}`.
 * Both service keys (some have hyphens) and city names are handled correctly
 * by matching the longest known service prefix.
 */
export function getPostById(id: string): Post | null {
  if (!id) return null;
  const decoded = id.includes("%") ? decodeURIComponent(id) : id;

  const lastDash = decoded.lastIndexOf("-");
  if (lastDash < 0) return null;
  const seed = Number(decoded.slice(lastDash + 1));
  if (Number.isNaN(seed)) return null;

  const head = decoded.slice(0, lastDash);

  // Find the longest service key that matches the start (handles "escorts-gay" before "escorts").
  let matchedService: ServiceKey | null = null;
  for (const s of services) {
    if (head.startsWith(s.key + "-")) {
      if (!matchedService || s.key.length > matchedService.length) {
        matchedService = s.key;
      }
    }
  }
  if (!matchedService) return null;

  const city = head.slice(matchedService.length + 1);
  if (!city) return null;

  const page = Math.floor(seed / PAGE_SIZE_FOR_LOOKUP);
  const idxInPage = seed % PAGE_SIZE_FOR_LOOKUP;
  const posts = generatePosts(page, PAGE_SIZE_FOR_LOOKUP, matchedService, city);
  return posts[idxInPage] ?? null;
}

/** Mock gallery for the profile detail page — derived deterministically from the post id. */
export function generateGallery(post: Post): string[] {
  const seed = post.id.split("-").pop() ?? "0";
  const base = Number(seed) || 0;
  return Array.from({ length: 5 }).map(
    (_, i) => `https://picsum.photos/seed/flitr-${base}-gal-${i}/800/1000`
  );
}
