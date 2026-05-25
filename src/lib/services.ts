import {
  BookHeart,
  Crown,
  Flame,
  HeartHandshake,
  Music,
  PartyPopper,
  Sparkles,
  UserRound,
  Users,
  Users2,
  Video,
  type LucideIcon,
} from "lucide-react";

export type ServiceKey =
  | "masajes"
  | "prepagos"
  | "trans"
  | "escorts-gay"
  | "gigolos"
  | "webcam"
  | "strippers"
  | "parejas"
  | "despedidas"
  | "fetiches"
  | "contactos";

export interface Service {
  key: ServiceKey;
  label: string;
  city: string;
  icon: LucideIcon;
}

export const services: Service[] = [
  {
    key: "masajes",
    label: "Masajes Eróticos",
    city: "Bogotá",
    icon: HeartHandshake,
  },
  {
    key: "prepagos",
    label: "Prepagos",
    city: "Bogotá",
    icon: Crown,
  },
  {
    key: "trans",
    label: "Trans y Travestis",
    city: "Bogotá",
    icon: Sparkles,
  },
  {
    key: "escorts-gay",
    label: "Escorts Gay",
    city: "Bogotá",
    icon: UserRound,
  },
  {
    key: "gigolos",
    label: "Gigolos",
    city: "Bogotá",
    icon: Users,
  },
  {
    key: "webcam",
    label: "Webcam",
    city: "Bogotá",
    icon: Video,
  },
  {
    key: "strippers",
    label: "Strippers y Bailarinas",
    city: "Bogotá",
    icon: Music,
  },
  {
    key: "parejas",
    label: "Parejas",
    city: "Bogotá",
    icon: Users2,
  },
  {
    key: "despedidas",
    label: "Despedidas",
    city: "Bogotá",
    icon: PartyPopper,
  },
  {
    key: "fetiches",
    label: "BDSM y Fetiches",
    city: "Bogotá",
    icon: Flame,
  },
  {
    key: "contactos",
    label: "Contactos",
    city: "Bogotá",
    icon: BookHeart,
  },
];
