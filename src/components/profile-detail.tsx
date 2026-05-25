"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  Calendar,
  Clock,
  CreditCard,
  Crown,
  Flag,
  Globe,
  Heart,
  Home,
  Languages,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  PlayCircle,
  Ruler,
  Share2,
  Star,
  Sticker,
  Target,
  Users,
  Video,
} from "lucide-react";

import { useChat } from "@/lib/chat-context";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TIER_STYLES } from "@/components/post-card";
import { services } from "@/lib/services";
import { formatCOP } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Post } from "@/lib/mock-posts";

interface ProfileDetailProps {
  post: Post;
  gallery: string[];
}

const LANGUAGE_LABEL: Record<string, string> = {
  es: "Español",
  en: "Inglés",
  pt: "Portugués",
  fr: "Francés",
  it: "Italiano",
};

const LOCATION_LABEL: Record<string, string> = {
  incall: "En su lugar",
  outcall: "Domicilio",
  virtual: "Virtual",
};

const PAYMENT_LABEL: Record<string, string> = {
  efectivo: "Efectivo",
  tarjeta: "Tarjeta",
  transferencia: "Transferencia",
  crypto: "Crypto",
};

const SLOT_LABEL: Record<string, string> = {
  manana: "Mañana",
  tarde: "Tarde",
  noche: "Noche",
  madrugada: "Madrugada",
};

const BODY_LABEL: Record<string, string> = {
  delgada: "Delgada",
  atletica: "Atlética",
  curvilinea: "Curvilínea",
  voluptuosa: "Voluptuosa",
  plus: "Plus",
};

const HAIR_LABEL: Record<string, string> = {
  rubia: "Rubia",
  morena: "Morena",
  pelirroja: "Pelirroja",
  negro: "Negro",
};

const ETHNICITY_LABEL: Record<string, string> = {
  latina: "Latina",
  colombiana: "Colombiana",
  venezolana: "Venezolana",
  europea: "Europea",
  asiatica: "Asiática",
};

const MOCK_REVIEWS = [
  {
    author: "Carlos M.",
    rating: 5,
    date: "Hace 3 días",
    body:
      "Excelente experiencia, totalmente profesional. Llegó puntual y el lugar muy discreto. Volvería sin dudarlo.",
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    author: "Andrés P.",
    rating: 4,
    date: "Hace 1 semana",
    body:
      "Muy atenta y simpática. La comunicación previa por WhatsApp fue rápida y clara.",
    avatar: "https://i.pravatar.cc/100?img=33",
  },
  {
    author: "Felipe R.",
    rating: 5,
    date: "Hace 2 semanas",
    body:
      "Servicio premium, tal cual lo describe el perfil. Súper recomendado.",
    avatar: "https://i.pravatar.cc/100?img=51",
  },
];

export function ProfileDetail({ post, gallery }: ProfileDetailProps) {
  const [active, setActive] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const { openChat } = useChat();

  const tier = TIER_STYLES[post.tier];
  const service = services.find((s) => s.key === post.service);

  const startChat = () =>
    openChat({
      id: post.id,
      name: post.name,
      imageUrl: post.imageUrl,
      isOnline: post.isOnline,
    });

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 md:px-6">
          <Button asChild variant="ghost" size="sm" className="-ml-2 gap-1.5">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </Button>
          <div className="ml-auto flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFavorite((v) => !v)}
              aria-label="Favorito"
              className={cn(isFavorite && "text-rose-500")}
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-rose-500")} />
            </Button>
            <Button variant="outline" size="icon" aria-label="Compartir">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Reportar">
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Gallery */}
          <section>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border bg-muted">
              <Image
                src={gallery[active]}
                alt={post.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />

              <Badge
                className={cn(
                  "absolute left-4 top-4 gap-1 rounded-full px-3 py-1 text-xs font-semibold shadow-md",
                  tier.className
                )}
              >
                <Crown className="h-3.5 w-3.5" />
                {tier.label}
              </Badge>

              {post.isOnline && (
                <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white shadow-md backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-white" />
                  En línea
                </div>
              )}

              {post.hasVideo && (
                <button
                  type="button"
                  className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-black/80"
                >
                  <PlayCircle className="h-4 w-4" />
                  Ver video
                </button>
              )}
            </div>

            {/* Thumbnails */}
            <div className="scrollbar-hide mt-3 flex gap-2 overflow-x-auto pb-1">
              {gallery.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Foto ${i + 1}`}
                  className={cn(
                    "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                    active === i ? "border-primary" : "border-transparent hover:border-border"
                  )}
                >
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          </section>

          {/* Info column */}
          <section className="space-y-6">
            {/* Identity */}
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                {service && <service.icon className="h-3.5 w-3.5" />}
                {service?.label}
              </div>
              <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight md:text-4xl">
                {post.name}
                {post.verified && (
                  <BadgeCheck className="h-6 w-6 fill-sky-500 text-white" />
                )}
              </h1>
              <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {post.age} años
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {post.location}, {post.city}
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <Target className="h-3.5 w-3.5" />
                  {post.distanceKm} km
                </span>
                {post.rating !== undefined && (
                  <>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {post.rating.toFixed(1)}
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Price card */}
            <Card className="bg-gradient-sensual relative overflow-hidden border-primary/20 p-5">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
              <div className="relative flex items-center gap-3">
                <Banknote className="h-7 w-7 text-gold" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-wider text-white/70">
                    Tarifa por hora
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {formatCOP(post.pricePerHour)}
                    <span className="ml-1 text-sm font-normal text-white/70">COP</span>
                  </p>
                </div>
              </div>
            </Card>

            {/* Contact CTAs */}
            <div
              className={cn(
                "grid grid-cols-1 gap-2",
                post.isOnline ? "sm:grid-cols-3" : "sm:grid-cols-2"
              )}
            >
              <Button className="min-w-0 gap-2 bg-emerald-600 px-3 hover:bg-emerald-700">
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span className="truncate">WhatsApp</span>
              </Button>
              {post.isOnline && (
                <Button
                  variant="brand"
                  onClick={startChat}
                  className="relative min-w-0 gap-2 px-3"
                >
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                  </span>
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="truncate">Chat en línea</span>
                </Button>
              )}
              <Button variant="outline" className="min-w-0 gap-2 px-3">
                <Phone className="h-4 w-4 shrink-0" />
                <span className="truncate">Llamar</span>
              </Button>
            </div>

            {/* Description */}
            <div>
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Sobre mí
              </h2>
              <p className="leading-relaxed text-foreground/90">
                {post.description}
              </p>
            </div>

            <Separator />

            {/* Quick attributes */}
            <div>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Características
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Stat icon={Ruler} label="Estatura" value={`${post.height} cm`} />
                <Stat icon={Users} label="Cuerpo" value={BODY_LABEL[post.bodyType]} />
                <Stat icon={Sticker} label="Cabello" value={HAIR_LABEL[post.hairColor]} />
                <Stat icon={Globe} label="Etnia" value={ETHNICITY_LABEL[post.ethnicity]} />
                <Stat
                  label="Senos"
                  icon={Heart}
                  value={post.breasts === "natural" ? "Naturales" : "Operadas"}
                />
                <Stat
                  label="Tatuajes"
                  icon={Sticker}
                  value={post.hasTattoos ? "Sí" : "No"}
                />
                <Stat
                  label="Piercings"
                  icon={Sticker}
                  value={post.hasPiercings ? "Sí" : "No"}
                />
                {post.hasVideo && (
                  <Stat label="Video" icon={Video} value="Disponible" />
                )}
              </div>
            </div>

            <Separator />

            {/* Service info */}
            <div className="grid grid-cols-1 gap-4">
              <ChipsBlock
                title="Encuentros"
                icon={Home}
                items={post.serviceLocations.map((l) => LOCATION_LABEL[l])}
              />
              <ChipsBlock
                title="Horarios disponibles"
                icon={Clock}
                items={post.availableSlots.map((s) => SLOT_LABEL[s])}
              />
              <ChipsBlock
                title="Idiomas"
                icon={Languages}
                items={post.languages.map((l) => LANGUAGE_LABEL[l])}
              />
              <ChipsBlock
                title="Métodos de pago"
                icon={CreditCard}
                items={post.paymentMethods.map((m) => PAYMENT_LABEL[m])}
              />
            </div>
          </section>
        </div>

        {/* Reviews */}
        <section className="mt-12">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                Reseñas
              </h2>
              <p className="text-xs text-muted-foreground">
                {MOCK_REVIEWS.length} reseñas verificadas
              </p>
            </div>
            <Button variant="outline" size="sm">
              Escribir reseña
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {MOCK_REVIEWS.map((r) => (
              <Card key={r.author} className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={r.avatar} alt="" />
                    <AvatarFallback>{r.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{r.author}</p>
                    <p className="text-[11px] text-muted-foreground">{r.date}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3.5 w-3.5",
                          i < r.rating ? "fill-amber-400" : "fill-none opacity-30"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-foreground/80">{r.body}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Crown;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-card/50 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function ChipsBlock({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: typeof Crown;
  items: string[];
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {title}
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center rounded-full border bg-card px-2.5 py-1 text-xs font-medium"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
