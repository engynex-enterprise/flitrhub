import type { ServiceKey } from "./services";

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
