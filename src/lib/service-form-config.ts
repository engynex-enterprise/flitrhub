import type { ServiceKey } from "./services";

export interface ChipGroup {
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
}

export interface ServiceFormConfig {
  /** Free-text tagline shown under the section heading. */
  intro?: string;
  /** Main chips group — e.g. "Tipo de servicio" / "Especialidades". */
  specialties?: ChipGroup;
  /** Secondary chips group — e.g. "Incluye" / "Eventos". */
  extras?: ChipGroup;
  /** Single-pick: role (active/passive, dom/sub, etc.). */
  role?: ChipGroup;
  /** Whether to show the "Tarifa por hora" field. */
  showPricePerHour?: boolean;
  /** Custom label for the price field (some services charge per event, not hour). */
  priceLabel?: string;
  /** Whether to show partner fields (parejas). */
  showPartner?: boolean;
  /** Whether to show group capacity (despedidas). */
  showGroupCapacity?: boolean;
  /** Whether to show the physical attributes group (body, hair, ethnicity). */
  showPhysical?: boolean;
}

export const SERVICE_FORM_CONFIG: Record<ServiceKey, ServiceFormConfig> = {
  masajes: {
    intro: "Detalles para tu publicación de masajes eróticos.",
    specialties: {
      label: "Tipo de masaje",
      placeholder: "Selecciona uno o más",
      options: [
        { value: "relajante", label: "Relajante" },
        { value: "tantra", label: "Tántrico" },
        { value: "sensual", label: "Sensual" },
        { value: "prostatico", label: "Prostático" },
        { value: "lingam", label: "Lingam" },
        { value: "yoni", label: "Yoni" },
        { value: "nuru", label: "Nuru" },
        { value: "thai", label: "Thai" },
        { value: "cuatro-manos", label: "A cuatro manos" },
      ],
    },
    extras: {
      label: "Incluye",
      placeholder: "Marca lo incluido",
      options: [
        { value: "aceites", label: "Aceites" },
        { value: "velas", label: "Velas aromáticas" },
        { value: "musica", label: "Música" },
        { value: "ducha", label: "Ducha disponible" },
        { value: "estacionamiento", label: "Estacionamiento" },
        { value: "bebida", label: "Bebida de bienvenida" },
      ],
    },
    showPhysical: true,
    showPricePerHour: true,
  },
  prepagos: {
    intro: "Información de tu perfil de acompañante.",
    specialties: {
      label: "Servicios",
      placeholder: "Selecciona los que ofreces",
      options: [
        { value: "gfe", label: "GFE (Girlfriend Exp.)" },
        { value: "pse", label: "PSE (Pornstar Exp.)" },
        { value: "duo", label: "Dúo" },
        { value: "trio", label: "Trío" },
        { value: "cena", label: "Cena / Acompañante" },
        { value: "viaje", label: "Viajes" },
        { value: "overnight", label: "Overnight" },
        { value: "weekend", label: "Fin de semana" },
      ],
    },
    extras: {
      label: "Incluye",
      placeholder: "Marca lo incluido",
      options: [
        { value: "besos", label: "Besos" },
        { value: "oral-sin", label: "Oral sin condón" },
        { value: "anal", label: "Anal" },
        { value: "fetiches", label: "Fetiches" },
        { value: "vestuarios", label: "Vestuarios" },
        { value: "lluvia-dorada", label: "Lluvia dorada" },
      ],
    },
    showPhysical: true,
    showPricePerHour: true,
  },
  trans: {
    intro: "Cuéntanos sobre tu servicio.",
    role: {
      label: "Rol",
      placeholder: "Activa / pasiva / versátil",
      options: [
        { value: "activa", label: "Activa" },
        { value: "pasiva", label: "Pasiva" },
        { value: "versatil", label: "Versátil" },
      ],
    },
    specialties: {
      label: "Servicios",
      placeholder: "Selecciona los que ofreces",
      options: [
        { value: "gfe", label: "GFE" },
        { value: "domi", label: "Dominación" },
        { value: "fetiches", label: "Fetiches" },
        { value: "cena", label: "Cena / Acompañante" },
        { value: "overnight", label: "Overnight" },
        { value: "viaje", label: "Viajes" },
      ],
    },
    showPhysical: true,
    showPricePerHour: true,
  },
  "escorts-gay": {
    intro: "Información de tu perfil.",
    role: {
      label: "Rol",
      placeholder: "Activo / pasivo / versátil",
      options: [
        { value: "activo", label: "Activo" },
        { value: "pasivo", label: "Pasivo" },
        { value: "versatil", label: "Versátil" },
        { value: "top", label: "Top" },
        { value: "bottom", label: "Bottom" },
      ],
    },
    specialties: {
      label: "Servicios",
      placeholder: "Selecciona los que ofreces",
      options: [
        { value: "bfe", label: "BFE (Boyfriend Exp.)" },
        { value: "duo", label: "Dúo" },
        { value: "cena", label: "Cena / Acompañante" },
        { value: "viaje", label: "Viajes" },
        { value: "overnight", label: "Overnight" },
        { value: "weekend", label: "Fin de semana" },
      ],
    },
    showPhysical: true,
    showPricePerHour: true,
  },
  gigolos: {
    intro: "Información de tu perfil.",
    specialties: {
      label: "Servicios",
      placeholder: "Selecciona los que ofreces",
      options: [
        { value: "acompanante", label: "Acompañante social" },
        { value: "cena", label: "Cena" },
        { value: "eventos", label: "Eventos" },
        { value: "viajes", label: "Viajes" },
        { value: "intimo", label: "Servicio íntimo" },
        { value: "overnight", label: "Overnight" },
      ],
    },
    extras: {
      label: "Clientela",
      placeholder: "Para quién es tu servicio",
      options: [
        { value: "mujeres", label: "Mujeres" },
        { value: "parejas", label: "Parejas" },
        { value: "hombres", label: "Hombres" },
      ],
    },
    showPhysical: true,
    showPricePerHour: true,
  },
  webcam: {
    intro: "Datos de tu servicio de webcam.",
    specialties: {
      label: "Plataformas",
      placeholder: "Dónde transmites",
      options: [
        { value: "chaturbate", label: "Chaturbate" },
        { value: "stripchat", label: "Stripchat" },
        { value: "onlyfans", label: "OnlyFans" },
        { value: "myfreecams", label: "MyFreeCams" },
        { value: "instagram", label: "Instagram" },
        { value: "telegram", label: "Telegram" },
        { value: "privado", label: "Privado / Custom" },
      ],
    },
    extras: {
      label: "Tipo de show",
      placeholder: "Selecciona los tipos",
      options: [
        { value: "solo", label: "Solo" },
        { value: "couple", label: "En pareja" },
        { value: "fetish", label: "Fetiches" },
        { value: "roleplay", label: "Roleplay" },
        { value: "voyeur", label: "Voyeur" },
        { value: "custom", label: "Videos custom" },
      ],
    },
    showPhysical: true,
    showPricePerHour: true,
    priceLabel: "Tarifa por show (COP miles)",
  },
  strippers: {
    intro: "Datos de tu servicio de baile.",
    specialties: {
      label: "Estilos de baile",
      placeholder: "Qué bailas",
      options: [
        { value: "pole", label: "Pole dance" },
        { value: "sensual", label: "Sensual" },
        { value: "exotic", label: "Exótico" },
        { value: "burlesque", label: "Burlesque" },
        { value: "go-go", label: "Go-go" },
        { value: "twerk", label: "Twerk" },
        { value: "lap-dance", label: "Lap dance" },
      ],
    },
    extras: {
      label: "Eventos",
      placeholder: "Para qué te contratan",
      options: [
        { value: "despedida-soltero", label: "Despedida soltero" },
        { value: "despedida-soltera", label: "Despedida soltera" },
        { value: "cumpleanos", label: "Cumpleaños" },
        { value: "privado", label: "Fiesta privada" },
        { value: "corporativo", label: "Corporativo" },
      ],
    },
    showPhysical: true,
    showPricePerHour: true,
    priceLabel: "Tarifa por show (COP miles)",
  },
  parejas: {
    intro: "Información de la pareja que publica.",
    showPartner: true,
    specialties: {
      label: "Orientación",
      placeholder: "Tipo de pareja",
      options: [
        { value: "hetero", label: "Heterosexual" },
        { value: "lesbico", label: "Lésbico" },
        { value: "gay", label: "Gay" },
        { value: "bisexual", label: "Bisexual" },
      ],
    },
    extras: {
      label: "Servicios",
      placeholder: "Selecciona los que ofrecen",
      options: [
        { value: "swinger", label: "Swinger" },
        { value: "trio-masc", label: "Trío (con hombre)" },
        { value: "trio-fem", label: "Trío (con mujer)" },
        { value: "intercambio", label: "Intercambio" },
        { value: "show", label: "Show en vivo" },
      ],
    },
    showPricePerHour: true,
  },
  despedidas: {
    intro: "Información del paquete de evento.",
    showGroupCapacity: true,
    specialties: {
      label: "Tipos de evento",
      placeholder: "Para qué eventos",
      options: [
        { value: "soltero", label: "Despedida soltero" },
        { value: "soltera", label: "Despedida soltera" },
        { value: "cumpleanos", label: "Cumpleaños" },
        { value: "fiesta-privada", label: "Fiesta privada" },
        { value: "corporativo", label: "Corporativo" },
      ],
    },
    extras: {
      label: "El paquete incluye",
      placeholder: "Marca lo que incluyes",
      options: [
        { value: "strippers", label: "Strippers / Bailarinas" },
        { value: "transporte", label: "Transporte" },
        { value: "bebidas", label: "Bebidas" },
        { value: "decoracion", label: "Decoración" },
        { value: "fotografo", label: "Fotógrafo" },
        { value: "anfitrion", label: "Anfitrión / a" },
        { value: "comida", label: "Comida" },
      ],
    },
    priceLabel: "Tarifa por evento (COP miles)",
    showPricePerHour: true,
  },
  fetiches: {
    intro: "Información de tu servicio BDSM / fetiches.",
    role: {
      label: "Rol",
      placeholder: "Tu rol",
      options: [
        { value: "dom", label: "Dom" },
        { value: "sub", label: "Sub" },
        { value: "switch", label: "Switch" },
        { value: "mistress", label: "Mistress" },
      ],
    },
    specialties: {
      label: "Especialidades",
      placeholder: "Selecciona las prácticas",
      options: [
        { value: "bondage", label: "Bondage / Shibari" },
        { value: "spanking", label: "Spanking" },
        { value: "roleplay", label: "Roleplay" },
        { value: "humillacion", label: "Humillación" },
        { value: "fetiche-pies", label: "Fetiche de pies" },
        { value: "latex", label: "Látex" },
        { value: "wax-play", label: "Wax play" },
        { value: "edge-play", label: "Edge play" },
        { value: "feminizacion", label: "Feminización" },
      ],
    },
    extras: {
      label: "Equipamiento disponible",
      placeholder: "Qué tienes en tu espacio",
      options: [
        { value: "mazmorra", label: "Mazmorra" },
        { value: "cuerdas", label: "Cuerdas" },
        { value: "juguetes", label: "Juguetes" },
        { value: "latex-equip", label: "Trajes de látex" },
        { value: "cruz", label: "Cruz de San Andrés" },
        { value: "jaula", label: "Jaula" },
      ],
    },
    showPhysical: true,
    showPricePerHour: true,
  },
  contactos: {
    intro: "Cuéntanos qué estás buscando.",
    specialties: {
      label: "Estoy buscando",
      placeholder: "Tipo de contacto",
      options: [
        { value: "casual", label: "Encuentro casual" },
        { value: "relacion", label: "Relación" },
        { value: "amistad", label: "Amistad con derechos" },
        { value: "intercambio", label: "Intercambio" },
        { value: "swingers", label: "Swingers" },
      ],
    },
    showPricePerHour: false,
  },
};
