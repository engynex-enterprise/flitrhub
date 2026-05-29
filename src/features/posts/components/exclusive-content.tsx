"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Check,
  Crown,
  Gift,
  Heart,
  Lock,
  MessageCircle,
  Play,
  Sparkles,
  Unlock,
  Users,
  Video,
} from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { formatCOP } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";
import type { Post } from "@/features/posts/data/mock-posts";

/* -------------------- Types & mock data -------------------- */

type ContentType = "photo" | "video";
type ContentAccess = "subscription" | "ppv" | "free";

interface ContentItem {
  id: string;
  type: ContentType;
  thumb: string;
  duration?: string;
  access: ContentAccess;
  price?: number;
  likes: number;
  unlocks: number;
  isNew?: boolean;
}

interface SubTier {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  benefits: string[];
  badge?: string;
  highlight?: boolean;
  subs: number;
}

function genContent(postId: string): ContentItem[] {
  const seed = postId.split("-").pop() ?? "0";
  const base = Number(seed) || 1;
  const t = (i: number) =>
    `https://picsum.photos/seed/flitr-${base}-prem-${i}/600/800`;
  return [
    { id: "c1", type: "photo", thumb: t(1), access: "subscription", likes: 124, unlocks: 89 },
    { id: "c2", type: "video", thumb: t(2), duration: "2:34", access: "ppv", price: 25_000, likes: 86, unlocks: 42, isNew: true },
    { id: "c3", type: "photo", thumb: t(3), access: "subscription", likes: 98, unlocks: 67 },
    { id: "c4", type: "video", thumb: t(4), duration: "5:12", access: "ppv", price: 45_000, likes: 142, unlocks: 78 },
    { id: "c5", type: "photo", thumb: t(5), access: "subscription", likes: 56, unlocks: 32 },
    { id: "c6", type: "photo", thumb: t(6), access: "free", likes: 210, unlocks: 0 },
    { id: "c7", type: "video", thumb: t(7), duration: "1:48", access: "subscription", likes: 88, unlocks: 51, isNew: true },
    { id: "c8", type: "photo", thumb: t(8), access: "ppv", price: 18_000, likes: 64, unlocks: 28 },
  ];
}

const TIERS: SubTier[] = [
  {
    id: "t1",
    name: "Básica",
    price: 30_000,
    durationMonths: 1,
    subs: 142,
    benefits: [
      "Acceso a fotos exclusivas",
      "Mensajes privados ilimitados",
      "1 video gratis al mes",
    ],
  },
  {
    id: "t2",
    name: "Plus",
    price: 75_000,
    durationMonths: 3,
    subs: 58,
    benefits: [
      "Todo lo de Básica",
      "Videos ilimitados",
      "10% off en pay-per-view",
      "Contenido detrás de cámaras",
    ],
    highlight: true,
    badge: "Recomendado",
  },
  {
    id: "t3",
    name: "VIP",
    price: 150_000,
    durationMonths: 1,
    subs: 23,
    benefits: [
      "Todo lo de Plus",
      "Videollamada mensual privada",
      "Contenido personalizado a pedido",
      "Prioridad en respuestas",
      "PPV ilimitado",
    ],
    badge: "Premium",
  },
];

/* -------------------- Component -------------------- */

type Filter = "all" | "photos" | "videos";

export function ExclusiveContent({ post }: { post: Post }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [subscribed, setSubscribed] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());

  const items = useMemo(() => genContent(post.id), [post.id]);
  const totalSubs = TIERS.reduce((s, t) => s + t.subs, 0);
  const photos = items.filter((i) => i.type === "photo").length;
  const videos = items.filter((i) => i.type === "video").length;

  const filtered = items.filter((i) =>
    filter === "all"
      ? true
      : filter === "photos"
        ? i.type === "photo"
        : i.type === "video"
  );

  const handleUnlock = (id: string) => {
    setUnlocked((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <section>
      {/* Hero */}
      <Card className="bg-gradient-sensual relative overflow-hidden border-primary/30 p-6">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />

        <div className="relative flex flex-wrap items-center gap-4">
          <div className="bg-gradient-gold flex h-14 w-14 items-center justify-center rounded-2xl text-amber-950 shadow-lg">
            <Sparkles className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gold">
                Contenido exclusivo
              </p>
              <Badge className="border-0 bg-primary/30 px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider text-white">
                +18
              </Badge>
            </div>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-white md:text-2xl">
              El vault privado de {post.name}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/75">
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {totalSubs.toLocaleString("es-CO")} suscriptores
              </span>
              <span className="inline-flex items-center gap-1">
                <Lock className="h-3.5 w-3.5" />
                {items.length} publicaciones
              </span>
              <span className="inline-flex items-center gap-1">
                <Video className="h-3.5 w-3.5" />
                {videos} videos
              </span>
              <span className="inline-flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                {photos} fotos
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tiers */}
      <div className="mt-6">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              <Crown className="h-4 w-4 text-gold" />
              Suscríbete para acceso ilimitado
            </h3>
            <p className="text-xs text-muted-foreground">
              Cancela cuando quieras · Renovación automática
            </p>
          </div>
          {subscribed && (
            <Badge className="border-0 bg-emerald-500/15 text-emerald-400">
              <Check className="mr-1 h-3 w-3" />
              Suscrito a {TIERS.find((t) => t.id === subscribed)?.name}
            </Badge>
          )}
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {TIERS.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              active={subscribed === tier.id}
              onSubscribe={() =>
                setSubscribed(subscribed === tier.id ? null : tier.id)
              }
            />
          ))}
        </div>
      </div>

      {/* Vault */}
      <div className="mt-8">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              <Lock className="h-4 w-4 text-primary" />
              Vault de contenido
            </h3>
            <p className="text-xs text-muted-foreground">
              Compra individual o accede con tu suscripción
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <FilterPill
              active={filter === "all"}
              onClick={() => setFilter("all")}
            >
              Todo · {items.length}
            </FilterPill>
            <FilterPill
              active={filter === "photos"}
              onClick={() => setFilter("photos")}
            >
              Fotos · {photos}
            </FilterPill>
            <FilterPill
              active={filter === "videos"}
              onClick={() => setFilter("videos")}
            >
              Videos · {videos}
            </FilterPill>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              isUnlocked={unlocked.has(item.id) || subscribed !== null}
              onUnlock={() => handleUnlock(item.id)}
            />
          ))}
        </div>
      </div>

      {/* Tip / DM CTA */}
      <TipCard postName={post.name} />
    </section>
  );
}

/* -------------------- Tier card -------------------- */

function TierCard({
  tier,
  active,
  onSubscribe,
}: {
  tier: SubTier;
  active: boolean;
  onSubscribe: () => void;
}) {
  return (
    <Card
      className={cn(
        "relative flex flex-col gap-3 p-4 transition-colors",
        tier.highlight && "border-primary/40 bg-primary/5",
        active && "border-emerald-500/50 bg-emerald-500/5"
      )}
    >
      {tier.badge && (
        <span
          className={cn(
            "absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
            tier.highlight
              ? "bg-gradient-gold text-amber-950"
              : "bg-primary/15 text-primary"
          )}
        >
          {tier.badge}
        </span>
      )}

      <div>
        <p className="text-sm font-bold">{tier.name}</p>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-2xl font-bold leading-none">
            {formatCOP(tier.price)}
          </span>
          <span className="text-[11px] text-muted-foreground">
            / {tier.durationMonths === 1 ? "mes" : `${tier.durationMonths} meses`}
          </span>
        </div>
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          {tier.subs} suscriptores activos
        </p>
      </div>

      <ul className="space-y-1.5">
        {tier.benefits.map((b) => (
          <li
            key={b}
            className="flex items-start gap-1.5 text-[11px] text-foreground/85"
          >
            <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={onSubscribe}
        variant={active ? "outline" : tier.highlight ? "brand" : "outline"}
        size="sm"
        className="mt-auto w-full"
      >
        {active ? "Suscrito · Cancelar" : "Suscribirme"}
      </Button>
    </Card>
  );
}

/* -------------------- Content card -------------------- */

function ContentCard({
  item,
  isUnlocked,
  onUnlock,
}: {
  item: ContentItem;
  isUnlocked: boolean;
  onUnlock: () => void;
}) {
  const isLocked = !isUnlocked && item.access !== "free";
  const accessLabel =
    item.access === "subscription"
      ? "Solo suscriptores"
      : item.access === "ppv"
        ? "Compra individual"
        : "Gratis";
  return (
    <Card className="group relative overflow-hidden p-0">
      <div className="relative aspect-[3/4] w-full bg-muted">
        <Image
          src={item.thumb}
          alt=""
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={cn(
            "object-cover transition-all",
            isLocked && "blur-xl scale-110 brightness-50"
          )}
        />

        {/* Top badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {item.isNew && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              Nuevo
            </span>
          )}
          {item.access === "subscription" && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-foreground backdrop-blur">
              <Crown className="h-2.5 w-2.5" />
              Sub
            </span>
          )}
          {item.access === "ppv" && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-gradient-gold px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-950 shadow">
              PPV
            </span>
          )}
          {item.access === "free" && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-white/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur">
              Gratis
            </span>
          )}
        </div>

        {/* Type icon */}
        <div className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
          {item.type === "video" ? (
            <>
              <Play className="h-2.5 w-2.5 fill-white" />
              {item.duration}
            </>
          ) : (
            <Sparkles className="h-2.5 w-2.5" />
          )}
        </div>

        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/90">
              {accessLabel}
            </p>
            {item.access === "ppv" && item.price && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onUnlock();
                }}
                className="bg-gradient-gold mt-1 h-7 border-0 px-2.5 text-[11px] font-semibold text-amber-950 shadow hover:opacity-90"
              >
                <Unlock className="mr-1 h-3 w-3" />
                {formatCOP(item.price)}
              </Button>
            )}
          </div>
        )}

        {/* Unlocked play indicator */}
        {!isLocked && item.type === "video" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur">
              <Play className="h-5 w-5 fill-white text-white" />
            </div>
          </div>
        )}

        {/* Bottom stats */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2">
          <div className="flex items-center justify-between gap-1 text-[10px] font-medium text-white/90">
            <span className="inline-flex items-center gap-0.5">
              <Heart className="h-2.5 w-2.5" />
              {item.likes}
            </span>
            {item.access !== "free" && (
              <span className="inline-flex items-center gap-0.5">
                <Unlock className="h-2.5 w-2.5" />
                {item.unlocks}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* -------------------- Tip / DM CTA -------------------- */

function TipCard({ postName }: { postName: string }) {
  const [tip, setTip] = useState<number | null>(null);
  const presets = [10_000, 25_000, 50_000, 100_000];
  return (
    <Card className="mt-6 p-5">
      <div className="flex flex-wrap items-center gap-4">
        <div className="bg-gradient-gold flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-amber-950 shadow">
          <Gift className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">Envía una propina a {postName}</p>
          <p className="text-[11px] text-muted-foreground">
            Las propinas son anónimas y van directo a la creadora.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setTip(tip === amount ? null : amount)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                tip === amount
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-border text-muted-foreground hover:bg-accent"
              )}
            >
              {formatCOP(amount)}
            </button>
          ))}
          <Button
            variant="brand"
            size="sm"
            disabled={tip === null}
            className="gap-1.5"
          >
            <Gift className="h-3.5 w-3.5" />
            {tip ? `Enviar ${formatCOP(tip)}` : "Enviar"}
          </Button>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-md border border-dashed border-primary/40 bg-primary/5 px-3 py-2 text-[11px] text-muted-foreground">
        <MessageCircle className="h-3.5 w-3.5 shrink-0 text-primary" />
        <span>
          ¿Buscas algo personalizado? Mándale un mensaje privado para pedir
          contenido a la medida.
        </span>
      </div>
    </Card>
  );
}

/* -------------------- Helpers -------------------- */

function FilterPill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:bg-accent"
      )}
    >
      {children}
    </button>
  );
}
