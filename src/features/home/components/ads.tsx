"use client";

import Link from "next/link";
import {
  ArrowRight,
  Crown,
  Flame,
  MapPin,
  Megaphone,
  MousePointerClick,
  Rocket,
  Search,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

/* -------------------- Product catalog --------------------
 * Shared across home placements and the provider marketplace.
 * Each placement below pitches one or more of these products so
 * what the audience sees mirrors what advertisers can buy. */

export type AdProductId =
  | "search-top"
  | "destacado"
  | "story-sponsored"
  | "city-boost"
  | "platino"
  | "re-impulso"
  | "home-banner"
  | "push-targeted"
  | "cross-city"
  | "similar-banner"
  | "premium-target"
  | "service-top";

export interface AdProductMeta {
  id: AdProductId;
  name: string;
  short: string;
  description: string;
  icon: typeof Megaphone;
  price: number;
  durationDays: number;
  estReach: string;
  badge?: string;
  highlight?: boolean;
}

export const AD_PRODUCT_CATALOG: AdProductMeta[] = [
  {
    id: "search-top",
    name: "Top de búsqueda",
    short: "Top",
    description:
      "Aparece en las primeras 3 posiciones para tu ciudad y servicio.",
    icon: Search,
    price: 12_000,
    durationDays: 1,
    estReach: "~2.5k visitas/día",
    highlight: true,
  },
  {
    id: "destacado",
    name: "Destacado en home",
    short: "Destacado",
    description: "Tu publicación se muestra en el carrusel principal.",
    icon: Flame,
    price: 10_000,
    durationDays: 1,
    estReach: "~1.8k visitas/día",
  },
  {
    id: "story-sponsored",
    name: "Story sponsorizada",
    short: "Story",
    description: "Aparece en stories durante 24h con prioridad.",
    icon: Sparkles,
    price: 15_000,
    durationDays: 1,
    estReach: "~3k visualizaciones",
    badge: "Nuevo",
  },
  {
    id: "city-boost",
    name: "Boost de ciudad",
    short: "Boost",
    description: "Maximiza visibilidad en una ciudad específica.",
    icon: MapPin,
    price: 8_000,
    durationDays: 1,
    estReach: "~1.2k visitas/día",
  },
  {
    id: "platino",
    name: "Upgrade a Platino",
    short: "Platino",
    description:
      "Insignia Platino + mejor posicionamiento + filtros exclusivos.",
    icon: Crown,
    price: 200_000,
    durationDays: 30,
    estReach: "+45% conversión",
    badge: "Más popular",
  },
  {
    id: "re-impulso",
    name: "Re-impulso semanal",
    short: "Impulso",
    description: "Tu publicación aparece como recién publicada por 7 días.",
    icon: Rocket,
    price: 45_000,
    durationDays: 7,
    estReach: "+30% alcance",
  },
  {
    id: "home-banner",
    name: "Banner principal home",
    short: "Banner",
    description: "Tu propio banner gigante en la home durante 24h.",
    icon: Megaphone,
    price: 25_000,
    durationDays: 1,
    estReach: "~5k impresiones",
  },
  {
    id: "push-targeted",
    name: "Notificación push",
    short: "Push",
    description: "Envía un push a usuarios que vieron perfiles similares.",
    icon: Zap,
    price: 18_000,
    durationDays: 1,
    estReach: "~800 alcanzados",
  },
  {
    id: "cross-city",
    name: "Cross-city (2 ciudades)",
    short: "Cross-City",
    description: "Tu publicación aparece simultáneamente en 2 ciudades.",
    icon: MapPin,
    price: 15_000,
    durationDays: 1,
    estReach: "+80% alcance geográfico",
  },
  {
    id: "similar-banner",
    name: "Banner en perfiles similares",
    short: "Similar",
    description: "Tu CTA aparece al pie de perfiles similares al tuyo.",
    icon: MousePointerClick,
    price: 14_000,
    durationDays: 1,
    estReach: "~1.5k impresiones",
  },
  {
    id: "premium-target",
    name: "Match con preferencias",
    short: "Match",
    description:
      "Aparece prioritariamente a clientes que coinciden con tus filtros.",
    icon: TrendingUp,
    price: 22_000,
    durationDays: 1,
    estReach: "+38% conversión",
  },
  {
    id: "service-top",
    name: "Top del servicio",
    short: "Servicio",
    description: "Primer lugar dentro de un servicio específico durante 24h.",
    icon: Crown,
    price: 10_000,
    durationDays: 1,
    estReach: "~1.6k visitas/día",
  },
];

export function getProduct(id: AdProductId): AdProductMeta {
  const p = AD_PRODUCT_CATALOG.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown ad product: ${id}`);
  return p;
}

function formatCOP(value: number): string {
  return `$${value.toLocaleString("es-CO")}`;
}

/* -------------------- Labels -------------------- */

function AdLabel({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "rounded-full border border-white/15 bg-black/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur",
        className
      )}
    >
      Publicidad
    </span>
  );
}

export function PromotedTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-gradient-gold px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-950 shadow",
        className
      )}
    >
      <Megaphone className="h-2.5 w-2.5" />
      Promocionado
    </span>
  );
}

/* -------------------- Home: top banner -------------------- */

const FEATURED_TOP: AdProductId[] = ["search-top", "destacado", "platino"];

export function AdBanner({ className }: { className?: string }) {
  const featured = FEATURED_TOP.map(getProduct);

  return (
    <div
      className={cn(
        "bg-gradient-sensual relative overflow-hidden rounded-2xl border border-primary/20 p-5 shadow-lg md:p-6",
        className
      )}
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/25 blur-3xl" />
      <div className="absolute -bottom-10 left-1/3 h-32 w-32 rounded-full bg-gold/20 blur-3xl" />
      <AdLabel className="absolute right-3 top-3" />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center">
        <div className="max-w-sm">
          <div className="flex items-center gap-2 text-gold">
            <Megaphone className="h-5 w-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Mejora tu alcance
            </span>
          </div>
          <p className="mt-1.5 text-lg font-bold tracking-tight text-white md:text-xl">
            Promociona tu perfil y multiplica tus visitas
          </p>
          <p className="mt-1 text-xs text-white/70 md:text-sm">
            Elige el formato que se ajusta a tu objetivo: top de búsqueda,
            destacado en home o upgrade a Platino.
          </p>
          <Button
            asChild
            size="sm"
            className="bg-gradient-gold mt-4 border-0 font-semibold text-amber-950 shadow-md hover:opacity-90"
          >
            <Link href="/profile">
              Ver todos los planes
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid flex-1 gap-2 sm:grid-cols-3">
          {featured.map((p) => (
            <MiniProductChip key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniProductChip({ product }: { product: AdProductMeta }) {
  const Icon = product.icon;
  return (
    <Link
      href="/profile"
      className="group rounded-xl border border-white/15 bg-white/[0.06] p-3 backdrop-blur transition-colors hover:border-primary/50 hover:bg-white/[0.12]"
    >
      <div className="flex items-center gap-2">
        <div className="bg-gradient-gold flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-amber-950 shadow">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold text-white">
            {product.name}
          </p>
          <p className="text-[10px] text-gold">
            desde {formatCOP(product.price)}
          </p>
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-[10px] leading-tight text-white/65">
        {product.description}
      </p>
    </Link>
  );
}

/* -------------------- Feed: inline card (compact, between posts) -------------------- */

export function AdInlineCard() {
  const product = getProduct("re-impulso");
  const Icon = product.icon;
  return (
    <Card className="bg-gradient-sensual group relative flex flex-col justify-between overflow-hidden border-primary/20 p-5 shadow-md">
      <div className="absolute -top-10 right-0 h-32 w-32 rounded-full bg-primary/25 blur-3xl" />
      <AdLabel className="absolute right-3 top-3" />
      <div className="relative">
        <div className="bg-gradient-gold inline-flex h-9 w-9 items-center justify-center rounded-lg text-amber-950 shadow">
          <Icon className="h-5 w-5" />
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gold">
          <Rocket className="h-3 w-3" />
          {product.short}
        </div>
        <p className="mt-1 text-base font-bold leading-tight text-white">
          {product.name}
        </p>
        <p className="mt-1 text-xs text-white/70">{product.description}</p>
        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
          <TrendingUp className="h-2.5 w-2.5" />
          {product.estReach}
        </div>
      </div>
      <div className="relative mt-4 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/60">
            {product.durationDays} días
          </p>
          <p className="text-lg font-bold leading-tight text-white">
            {formatCOP(product.price)}
          </p>
        </div>
        <Button
          asChild
          size="sm"
          className="bg-gradient-gold border-0 font-semibold text-amber-950 hover:opacity-90"
        >
          <Link href="/profile">Activar</Link>
        </Button>
      </div>
    </Card>
  );
}

/* -------------------- Feed: full-row banner -------------------- */

export function AdRowBanner({
  variant = "destacado",
}: {
  variant?: AdProductId;
}) {
  const product = getProduct(variant);
  const Icon = product.icon;
  return (
    <div className="bg-gradient-sensual relative overflow-hidden rounded-2xl border border-primary/20 p-5 shadow-md">
      <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-gold/15 blur-3xl" />
      <AdLabel className="absolute right-3 top-3" />
      <div className="relative flex flex-wrap items-center gap-4">
        <div className="bg-gradient-gold flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-amber-950 shadow-lg">
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
              {product.short}
            </span>
            {product.badge && (
              <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/90">
                {product.badge}
              </span>
            )}
          </div>
          <p className="text-base font-bold leading-tight text-white md:text-lg">
            {product.name}
          </p>
          <p className="text-xs text-white/70">{product.description}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-white/75">
            <span className="inline-flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-300" />
              {product.estReach}
            </span>
            <span className="text-white/40">·</span>
            <span>
              desde{" "}
              <span className="font-bold text-gold">
                {formatCOP(product.price)}
              </span>
              {" · "}
              {product.durationDays} días
            </span>
          </div>
        </div>
        <Button
          asChild
          size="sm"
          className="bg-gradient-gold border-0 font-semibold text-amber-950 shadow hover:opacity-90"
        >
          <Link href="/profile">
            Activar
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

/* -------------------- Sidebar block -------------------- */

export function AdSidebarBlock() {
  const product = getProduct("platino");
  const Icon = product.icon;
  return (
    <div className="bg-gradient-sensual relative overflow-hidden rounded-xl border border-primary/20 p-4 shadow-md">
      <div className="absolute -top-6 right-0 h-20 w-20 rounded-full bg-primary/25 blur-2xl" />
      <AdLabel />
      <div className="relative mt-2 flex items-center gap-2">
        <div className="bg-gradient-gold flex h-8 w-8 items-center justify-center rounded-lg text-amber-950 shadow">
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-sm font-bold leading-tight text-white">
          {product.name}
        </p>
      </div>
      <p className="relative mt-2 text-[11px] leading-snug text-white/70">
        {product.description}
      </p>
      <div className="relative mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
        <TrendingUp className="h-2.5 w-2.5" />
        {product.estReach}
      </div>
      <div className="relative mt-3 flex items-end justify-between gap-2">
        <p className="text-base font-bold leading-tight text-white">
          {formatCOP(product.price)}
          <span className="ml-1 text-[10px] font-normal text-white/60">
            /{product.durationDays}d
          </span>
        </p>
        <Button
          asChild
          size="sm"
          className="bg-gradient-gold h-7 border-0 px-2.5 text-[11px] font-semibold text-amber-950 hover:opacity-90"
        >
          <Link href="/profile">Activar</Link>
        </Button>
      </div>
    </div>
  );
}

/* -------------------- Post detail: boost this post (sidecar) -------------------- */

const POST_BOOST_PRODUCTS: AdProductId[] = [
  "search-top",
  "destacado",
  "re-impulso",
  "city-boost",
];

export function AdPostBoostCard() {
  return (
    <Card className="border-primary/30 bg-primary/5 p-4">
      <div className="flex items-start gap-3">
        <div className="bg-gradient-gold flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-amber-950 shadow">
          <Rocket className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold">Impulsa esta publicación</p>
            <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
              Anunciante
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Aplica una promoción específica a este perfil y mídela en tiempo
            real desde tu panel.
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {POST_BOOST_PRODUCTS.map((id) => (
          <BoostProductButton key={id} product={getProduct(id)} />
        ))}
      </div>

      <Button
        asChild
        variant="brand"
        size="sm"
        className="mt-3 w-full gap-1.5"
      >
        <Link href="/profile">
          Ver todos los planes
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </Card>
  );
}

function BoostProductButton({ product }: { product: AdProductMeta }) {
  const Icon = product.icon;
  return (
    <Link
      href="/profile"
      className="group flex flex-col gap-1 rounded-lg border bg-background/60 p-2.5 transition-colors hover:border-primary/40 hover:bg-primary/5"
    >
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-primary" />
        <span className="truncate text-[11px] font-semibold">
          {product.name}
        </span>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-bold leading-none">
          {formatCOP(product.price)}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
          {product.durationDays === 1 ? "/día" : `/${product.durationDays}d`}
        </span>
      </div>
    </Link>
  );
}

/* -------------------- Post detail: sponsored similar profiles row -------------------- */

export function AdSimilarSponsoredRow() {
  const product = getProduct("similar-banner");
  const Icon = product.icon;
  return (
    <div className="bg-gradient-sensual relative overflow-hidden rounded-2xl border border-primary/20 p-5 shadow-md">
      <div className="absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-primary/20 blur-3xl" />
      <AdLabel className="absolute right-3 top-3" />
      <div className="relative flex flex-wrap items-center gap-4">
        <div className="bg-gradient-gold flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-amber-950 shadow">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gold">
            {product.short}
          </p>
          <p className="text-base font-bold leading-tight text-white">
            ¿Tu perfil aquí?
          </p>
          <p className="text-xs text-white/70">
            Aparece al pie de perfiles similares con un CTA directo. Ideal para
            conseguir tráfico de alta intención.
          </p>
          <p className="mt-1 text-[11px] text-white/70">
            <span className="font-bold text-gold">
              {formatCOP(product.price)}
            </span>{" "}
            · {product.durationDays} día · {product.estReach}
          </p>
        </div>
        <Button
          asChild
          size="sm"
          className="bg-gradient-gold border-0 font-semibold text-amber-950 hover:opacity-90"
        >
          <Link href="/profile">
            Activar
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
