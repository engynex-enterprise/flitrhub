"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Crown,
  Eye,
  Flag,
  Globe,
  Heart,
  Home,
  Languages,
  MapPin,
  Maximize2,
  MessageCircle,
  MessageSquare,
  Phone,
  X,
  PlayCircle,
  Ruler,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Sticker,
  Tag,
  Target,
  Timer,
  Users,
  Users2,
  Video,
  Wand2,
} from "lucide-react";

import { useChat } from "@/features/chat/chat-context";
import { useFavorites } from "@/features/favorites/use-favorites";
import { useSession } from "@/features/auth/session";
import {
  AdPostBoostCard,
  AdSimilarSponsoredRow,
} from "@/features/home/components/ads";
import { SimilarProfileSponsoredCard } from "@/features/home/components/sponsored-content";
import { ExclusiveContent } from "@/features/posts/components/exclusive-content";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { DiscreetCover } from "@/features/posts/components/discreet-cover";
import { Header } from "@/features/layout/components/header";
import { TIER_STYLES } from "@/features/posts/components/post-card";
import { services } from "@/features/posts/data/services";
import { SERVICE_FORM_CONFIG } from "@/features/posts/data/service-form-config";
import { formatCOP } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";
import type { Post } from "@/features/posts/data/mock-posts";

interface PostDetailProps {
  post: Post;
  gallery: string[];
}

/* -------------------- Static label maps -------------------- */

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

/* -------------------- Helpers -------------------- */

function formatLastActive(mins: number) {
  if (mins === 0) return "Activa ahora";
  if (mins < 60) return `Hace ${mins} min`;
  if (mins < 60 * 24) return `Hace ${Math.floor(mins / 60)} h`;
  return `Hace ${Math.floor(mins / (60 * 24))} d`;
}

function formatMemberSince(months: number) {
  if (months < 12) return `${months} ${months === 1 ? "mes" : "meses"}`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "año" : "años"}`;
}

function chipLabel(
  value: string,
  options?: { value: string; label: string }[]
) {
  return options?.find((o) => o.value === value)?.label ?? value;
}

/* -------------------- Main component -------------------- */

type DetailTab = "info" | "detalles" | "reseñas";

export function PostDetail({ post, gallery }: PostDetailProps) {
  const [active, setActive] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [tab, setTab] = useState<DetailTab>("info");
  const { openChat } = useChat();
  const { favorites } = useFavorites();
  const { isProvider } = useSession();

  const tier = TIER_STYLES[post.tier];
  const service = services.find((s) => s.key === post.service);
  const cfg = SERVICE_FORM_CONFIG[post.service];

  const isWebcam = post.service === "webcam";
  const isContactos = post.service === "contactos";
  const isParejas = post.service === "parejas";
  const isDespedidas = post.service === "despedidas";
  // Locations (incall/outcall/virtual) don't apply to webcam/contactos
  const showServiceLocations = !isWebcam && !isContactos;
  // Distance doesn't apply to webcam (it's always virtual)
  const showDistance = !isWebcam && !isContactos;
  const priceLabel = cfg.priceLabel ?? "Tarifa por hora";

  const startChat = () =>
    openChat({
      id: post.id,
      name: post.name,
      imageUrl: post.imageUrl,
      isOnline: post.isOnline,
    });

  const next = () => setActive((i) => (i + 1) % gallery.length);
  const prev = () =>
    setActive((i) => (i - 1 + gallery.length) % gallery.length);

  return (
    <div className="min-h-screen bg-background">
      <Header favoritesCount={favorites.size} />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12">
        {/* Page action row */}
        <div className="mb-6 flex items-center justify-between gap-2">
          <Button asChild variant="ghost" size="sm" className="-ml-2 gap-1.5">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="icon" aria-label="Compartir">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Reportar">
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Gallery — sticky on desktop */}
          <section className="lg:sticky lg:top-20 lg:self-start">
            <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-3xl border bg-muted shadow-xl lg:aspect-auto lg:h-[calc(100vh-9rem)]">
              <Image
                src={gallery[active]}
                alt={post.name}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
                priority
              />
              <DiscreetCover size="lg" />

              {/* Top-left tier badge */}
              <Badge
                className={cn(
                  "absolute left-4 top-4 gap-1 rounded-full px-3 py-1 text-xs font-semibold shadow-md",
                  tier.className
                )}
              >
                <Crown className="h-3.5 w-3.5" />
                {tier.label}
              </Badge>

              {/* Top-right corner controls */}
              <div className="absolute right-4 top-4 flex items-center gap-2">
                {post.isOnline && (
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white shadow-md backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-white" />
                    En línea
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  aria-label="Ampliar foto"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>

              {/* Video button (bottom-right, above thumbnails strip) */}
              {post.hasVideo && (
                <button
                  type="button"
                  className="absolute bottom-32 right-4 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-black/80"
                >
                  <PlayCircle className="h-4 w-4" />
                  Ver video
                </button>
              )}

              {/* Prev / next */}
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Anterior"
                    className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur transition-opacity hover:bg-black/60 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Siguiente"
                    className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur transition-opacity hover:bg-black/60 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Thumbnails — overlay strip at the bottom */}
              {gallery.length > 1 && (
                <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-3 pb-3 pt-10">
                  <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium text-white/90">
                    <span>
                      {active + 1} / {gallery.length}
                    </span>
                  </div>
                  <div className="scrollbar-hide flex gap-2 overflow-x-auto">
                    {gallery.map((src, i) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setActive(i)}
                        aria-label={`Foto ${i + 1}`}
                        className={cn(
                          "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                          active === i
                            ? "border-primary opacity-100"
                            : "border-white/30 opacity-70 hover:border-white/60 hover:opacity-100"
                        )}
                      >
                        <Image
                          src={src}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                        <DiscreetCover size="xs" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Info column */}
          <section className="space-y-6">
            {/* Identity */}
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                {service && <service.icon className="h-3.5 w-3.5" />}
                {service?.label}
                {post.role && (
                  <>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-primary">
                      {chipLabel(post.role, cfg.role?.options)}
                    </span>
                  </>
                )}
              </div>
              <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight md:text-4xl">
                {post.name}
                {post.verified && (
                  <BadgeCheck className="h-6 w-6 fill-sky-500 text-white" />
                )}
              </h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {post.age} años
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {post.location}, {post.city}
                </span>
                {showDistance && (
                  <span className="inline-flex items-center gap-1">
                    <Target className="h-3.5 w-3.5" />
                    {post.distanceKm} km
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatLastActive(post.lastActiveMins)}
                </span>
              </p>
            </div>

            {/* Stats bar — engagement / trust */}
            <Card className="grid grid-cols-2 divide-x divide-y p-0 sm:grid-cols-4 sm:divide-y-0">
              <StatTile
                icon={Star}
                value={post.rating?.toFixed(1) ?? "—"}
                label={`${post.reviewsCount} reseñas`}
                tone="text-amber-400"
              />
              <StatTile
                icon={Eye}
                value={post.viewsCount.toLocaleString("es-CO")}
                label="Visitas"
                tone="text-sky-400"
              />
              <StatTile
                icon={Timer}
                value={`${post.responseTimeMins} min`}
                label="Respuesta"
                tone="text-emerald-400"
              />
              <StatTile
                icon={Calendar}
                value={formatMemberSince(post.memberSinceMonths)}
                label="En flitrhub"
                tone="text-primary"
              />
            </Card>

            {/* Price card — hide for contactos (no price) */}
            {!isContactos && (
              <Card className="bg-gradient-sensual relative overflow-hidden border-primary/20 p-5">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
                <div className="relative flex items-center gap-3">
                  <Banknote className="h-7 w-7 text-gold" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-wider text-white/70">
                      {priceLabel}
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {formatCOP(post.pricePerHour)}
                      <span className="ml-1 text-sm font-normal text-white/70">
                        COP
                      </span>
                    </p>
                  </div>
                  {isDespedidas && post.groupCapacity && (
                    <div className="text-right text-white/80">
                      <p className="text-xs uppercase tracking-wider">
                        Capacidad
                      </p>
                      <p className="text-lg font-bold text-white">
                        Hasta {post.groupCapacity}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Contact CTAs */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsFavorite((v) => !v)}
                aria-label="Favorito"
                className={cn("shrink-0", isFavorite && "text-rose-500")}
              >
                <Heart
                  className={cn("h-4 w-4", isFavorite && "fill-rose-500")}
                />
              </Button>
              <Button className="min-w-0 flex-1 gap-2 bg-emerald-600 px-3 hover:bg-emerald-700">
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span className="truncate">WhatsApp</span>
              </Button>
              {post.isOnline && (
                <Button
                  variant="brand"
                  onClick={startChat}
                  className="relative min-w-0 flex-1 gap-2 px-3"
                >
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                  </span>
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="truncate">Chat</span>
                </Button>
              )}
              <Button variant="outline" className="min-w-0 flex-1 gap-2 px-3">
                <Phone className="h-4 w-4 shrink-0" />
                <span className="truncate">Llamar</span>
              </Button>
            </div>

            {/* Provider mini-card — links to the public provider profile */}
            <Card className="p-3">
              <div className="flex items-center gap-3">
                <Link
                  href={`/provider/${encodeURIComponent(post.id)}`}
                  className="relative shrink-0"
                  aria-label={`Ver perfil de ${post.name}`}
                >
                  <Avatar className="no-blur h-12 w-12 ring-2 ring-primary/30">
                    <AvatarImage src={post.imageUrl} alt={post.name} />
                    <AvatarFallback>{post.name[0]}</AvatarFallback>
                  </Avatar>
                  {post.isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-card" />
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/provider/${encodeURIComponent(post.id)}`}
                      className="truncate text-sm font-bold hover:underline"
                    >
                      {post.name}
                    </Link>
                    {post.verified && (
                      <BadgeCheck className="h-4 w-4 fill-sky-500 text-white" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Anunciante en flitrhub · {post.reviewsCount} reseñas
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="shrink-0 gap-1.5"
                >
                  <Link href={`/provider/${encodeURIComponent(post.id)}`}>
                    Ver perfil
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Verification card */}
            {post.verified && (
              <Card className="border-emerald-500/30 bg-emerald-500/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">
                      Perfil verificado por flitrhub
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Identidad y fotos validadas por nuestro equipo.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Boost this post — only visible to providers */}
            {isProvider && <AdPostBoostCard />}

            {/* Tabs */}
            <div className="-mx-1 flex gap-1 overflow-x-auto border-b">
              {(
                [
                  { id: "info", label: "Información" },
                  { id: "detalles", label: "Detalles" },
                  { id: "reseñas", label: "Reseñas" },
                ] as { id: DetailTab; label: string }[]
              ).map((t) => {
                const isActive = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "relative px-4 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t.label}
                    {isActive && (
                      <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* TAB: Información */}
            {tab === "info" && (
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Sobre {isParejas ? "nosotros" : "mí"}
                  </h2>
                  <p className="leading-relaxed text-foreground/90">
                    {post.description}
                  </p>
                </div>

                {/* Partner — only parejas */}
                {isParejas && post.partner && (
                  <Card className="p-4">
                    <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <Users2 className="h-3.5 w-3.5 text-primary" />
                      La pareja
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <PartnerSlot
                        name={post.name}
                        age={post.age}
                        label={post.partner.gender === "M" ? "Ella" : "Él"}
                      />
                      <PartnerSlot
                        name={post.partner.name}
                        age={post.partner.age}
                        label={post.partner.gender === "M" ? "Él" : "Ella"}
                      />
                    </div>
                  </Card>
                )}

                {/* Specialties */}
                {post.specialties &&
                  post.specialties.length > 0 &&
                  cfg.specialties && (
                    <ChipsBlock
                      title={cfg.specialties.label}
                      icon={Sparkles}
                      items={post.specialties.map((v) =>
                        chipLabel(v, cfg.specialties?.options)
                      )}
                      tone="primary"
                    />
                  )}

                {/* Extras */}
                {post.extras && post.extras.length > 0 && cfg.extras && (
                  <ChipsBlock
                    title={cfg.extras.label}
                    icon={Tag}
                    items={post.extras.map((v) =>
                      chipLabel(v, cfg.extras?.options)
                    )}
                  />
                )}
              </div>
            )}

            {/* TAB: Detalles */}
            {tab === "detalles" && (
              <div className="space-y-6">
                {/* Physical attributes — only when service shows them */}
                {cfg.showPhysical && (
                  <div>
                    <h2 className="mb-3 flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      <Wand2 className="h-3.5 w-3.5 text-primary" />
                      Características
                    </h2>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <Stat
                        icon={Ruler}
                        label="Estatura"
                        value={`${post.height} cm`}
                      />
                      <Stat
                        icon={Users}
                        label="Cuerpo"
                        value={BODY_LABEL[post.bodyType]}
                      />
                      <Stat
                        icon={Sticker}
                        label="Cabello"
                        value={HAIR_LABEL[post.hairColor]}
                      />
                      <Stat
                        icon={Globe}
                        label="Etnia"
                        value={ETHNICITY_LABEL[post.ethnicity]}
                      />
                      <Stat
                        label="Senos"
                        icon={Heart}
                        value={
                          post.breasts === "natural"
                            ? "Naturales"
                            : "Operadas"
                        }
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
                        <Stat
                          label="Video"
                          icon={Video}
                          value="Disponible"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Service info — varies by service type */}
                <div className="grid grid-cols-1 gap-4">
                  {showServiceLocations && (
                    <ChipsBlock
                      title="Encuentros"
                      icon={Home}
                      items={post.serviceLocations.map(
                        (l) => LOCATION_LABEL[l]
                      )}
                    />
                  )}
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
                  {!isContactos && (
                    <ChipsBlock
                      title="Métodos de pago"
                      icon={CreditCard}
                      items={post.paymentMethods.map(
                        (m) => PAYMENT_LABEL[m]
                      )}
                    />
                  )}
                </div>
              </div>
            )}

            {/* TAB: Reseñas */}
            {tab === "reseñas" && (
              <div className="space-y-6">
                {/* Reviews */}
                <div>
                  <div className="mb-4 flex items-end justify-between gap-3">
                    <div>
                      <h2 className="flex items-center gap-2 text-lg font-bold">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                        Reseñas
                        {post.rating !== undefined && (
                          <span className="text-sm font-normal text-muted-foreground">
                            · {post.rating.toFixed(1)} promedio
                          </span>
                        )}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {post.reviewsCount} reseñas verificadas
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Escribir reseña
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {MOCK_REVIEWS.map((r) => (
                      <Card key={r.author} className="p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={r.avatar} alt="" />
                            <AvatarFallback>{r.author[0]}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">
                              {r.author}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {r.date}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-0.5 text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-3.5 w-3.5",
                                  i < r.rating
                                    ? "fill-amber-400"
                                    : "fill-none opacity-30"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/80">
                          {r.body}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Safety tips */}
                <Card className="border-primary/20 bg-primary/5 p-5">
                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <h3 className="text-sm font-bold">
                        Consejos para tu encuentro
                      </h3>
                      <ul className="mt-1.5 grid gap-1 text-xs text-muted-foreground">
                        <li>· Confirma siempre por el chat antes de moverte.</li>
                        <li>· No realices anticipos a cuentas no verificadas.</li>
                        <li>· Llega con la dirección exacta y un plan de salida.</li>
                        <li>· Reporta cualquier comportamiento sospechoso.</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </section>
        </div>

        {/* Exclusive content — OnlyFans-style vault */}
        <div className="mt-12">
          <ExclusiveContent post={post} />
        </div>

        {/* Sponsored slot at the bottom — providers see the product CTA,
            clients see actual sponsored similar profile content. */}
        <div className="mt-10">
          {isProvider ? (
            <AdSimilarSponsoredRow />
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Perfiles similares
                </h3>
              </div>
              <SimilarProfileSponsoredCard
                excludeId={post.id}
                service={post.service}
                city={post.city}
              />
            </div>
          )}
        </div>
      </main>

      {/* Lightbox / fullscreen viewer */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-label="Vista ampliada"
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Cerrar"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {gallery.length > 1 && (
            <div className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur">
              {active + 1} / {gallery.length}
            </div>
          )}

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Anterior"
                className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Siguiente"
                className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="relative h-[88vh] w-[92vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={gallery[active]}
              alt={post.name}
              fill
              sizes="92vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}

    </div>
  );
}

/* -------------------- Sub-components -------------------- */

function StatTile({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: typeof Star;
  value: string;
  label: string;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-2.5 p-3">
      <Icon className={cn("h-4 w-4 shrink-0", tone)} />
      <div className="min-w-0">
        <p className="truncate text-sm font-bold leading-tight">{value}</p>
        <p className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      </div>
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
  tone,
}: {
  title: string;
  icon: typeof Crown;
  items: string[];
  tone?: "primary";
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
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
              tone === "primary"
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-card"
            )}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function PartnerSlot({
  name,
  age,
  label,
}: {
  name: string;
  age: number;
  label: string;
}) {
  return (
    <div className="rounded-lg border bg-card/50 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-bold">{name}</p>
      <p className="text-xs text-muted-foreground">{age} años</p>
    </div>
  );
}
