"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Check,
  Crown,
  Edit3,
  Eye,
  Gift,
  Heart,
  Image as ImageIcon,
  Lock,
  MoreHorizontal,
  Pause,
  Pencil,
  Play,
  Plus,
  Sparkles,
  Trash2,
  Unlock,
  Upload,
} from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { formatCOP } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";

/* -------------------- Mock data -------------------- */

interface VaultItem {
  id: string;
  type: "photo" | "video";
  thumb: string;
  duration?: string;
  access: "subscription" | "ppv" | "free";
  price?: number;
  views: number;
  likes: number;
  unlocks: number;
  earnings: number;
  status: "published" | "draft" | "scheduled";
  postedAt: string;
}

const VAULT: VaultItem[] = [
  { id: "v1", type: "photo", thumb: "https://picsum.photos/seed/flitr-vault-1/300/400", access: "subscription", views: 2_140, likes: 312, unlocks: 142, earnings: 4_260_000, status: "published", postedAt: "Hace 2 días" },
  { id: "v2", type: "video", thumb: "https://picsum.photos/seed/flitr-vault-2/300/400", duration: "2:34", access: "ppv", price: 25_000, views: 1_820, likes: 248, unlocks: 86, earnings: 2_150_000, status: "published", postedAt: "Hace 4 días" },
  { id: "v3", type: "photo", thumb: "https://picsum.photos/seed/flitr-vault-3/300/400", access: "subscription", views: 1_540, likes: 187, unlocks: 98, earnings: 2_940_000, status: "published", postedAt: "Hace 1 semana" },
  { id: "v4", type: "video", thumb: "https://picsum.photos/seed/flitr-vault-4/300/400", duration: "5:12", access: "ppv", price: 45_000, views: 980, likes: 142, unlocks: 78, earnings: 3_510_000, status: "published", postedAt: "Hace 1 semana" },
  { id: "v5", type: "photo", thumb: "https://picsum.photos/seed/flitr-vault-5/300/400", access: "subscription", views: 720, likes: 56, unlocks: 32, earnings: 960_000, status: "published", postedAt: "Hace 2 semanas" },
  { id: "v6", type: "photo", thumb: "https://picsum.photos/seed/flitr-vault-6/300/400", access: "free", views: 4_210, likes: 510, unlocks: 0, earnings: 0, status: "published", postedAt: "Hace 2 semanas" },
  { id: "v7", type: "video", thumb: "https://picsum.photos/seed/flitr-vault-7/300/400", duration: "1:48", access: "ppv", price: 18_000, views: 0, likes: 0, unlocks: 0, earnings: 0, status: "draft", postedAt: "—" },
  { id: "v8", type: "photo", thumb: "https://picsum.photos/seed/flitr-vault-8/300/400", access: "subscription", views: 0, likes: 0, unlocks: 0, earnings: 0, status: "scheduled", postedAt: "En 2h" },
];

interface SubTier {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  subs: number;
  active: boolean;
  benefits: string[];
  badge?: string;
  highlight?: boolean;
}

const TIERS: SubTier[] = [
  { id: "t1", name: "Básica", price: 30_000, durationMonths: 1, subs: 142, active: true, benefits: ["Fotos exclusivas", "Mensajes privados", "1 video al mes"] },
  { id: "t2", name: "Plus", price: 75_000, durationMonths: 3, subs: 58, active: true, benefits: ["Todo lo de Básica", "Videos ilimitados", "10% off PPV", "BTS"], highlight: true, badge: "Recomendado" },
  { id: "t3", name: "VIP", price: 150_000, durationMonths: 1, subs: 23, active: true, benefits: ["Todo lo de Plus", "Videollamada mensual", "Contenido a pedido", "PPV gratis"], badge: "Premium" },
];

interface Activity {
  id: string;
  kind: "subscribe" | "ppv" | "tip" | "renew";
  user: string;
  amount: number;
  detail?: string;
  ago: string;
}

const ACTIVITY: Activity[] = [
  { id: "a1", kind: "subscribe", user: "Carlos M.", amount: 75_000, detail: "Plus · 3 meses", ago: "Hace 12 min" },
  { id: "a2", kind: "ppv", user: "Andrés P.", amount: 25_000, detail: "Video · 2:34", ago: "Hace 32 min" },
  { id: "a3", kind: "tip", user: "Anónimo", amount: 50_000, ago: "Hace 1 h" },
  { id: "a4", kind: "subscribe", user: "Felipe R.", amount: 150_000, detail: "VIP · 1 mes", ago: "Hace 2 h" },
  { id: "a5", kind: "renew", user: "Juan David L.", amount: 30_000, detail: "Básica · renovación", ago: "Hace 4 h" },
  { id: "a6", kind: "ppv", user: "Mateo G.", amount: 45_000, detail: "Video · 5:12", ago: "Hace 6 h" },
  { id: "a7", kind: "tip", user: "Anónimo", amount: 100_000, ago: "Hace 8 h" },
];

const ACTIVITY_LABEL: Record<Activity["kind"], { label: string; icon: typeof Crown; tone: string }> = {
  subscribe: { label: "Nueva suscripción", icon: Crown, tone: "text-primary bg-primary/15" },
  renew: { label: "Renovación", icon: Check, tone: "text-emerald-400 bg-emerald-500/15" },
  ppv: { label: "Compra PPV", icon: Unlock, tone: "text-gold bg-amber-500/15" },
  tip: { label: "Propina", icon: Gift, tone: "text-rose-400 bg-rose-500/15" },
};

type VaultFilter = "all" | "photos" | "videos" | "drafts";

/* -------------------- Component -------------------- */

export function ProviderContent() {
  const [filter, setFilter] = useState<VaultFilter>("all");

  const published = VAULT.filter((v) => v.status === "published");

  const filtered = VAULT.filter((v) => {
    if (filter === "all") return v.status === "published";
    if (filter === "photos")
      return v.status === "published" && v.type === "photo";
    if (filter === "videos")
      return v.status === "published" && v.type === "video";
    return v.status !== "published";
  });

  return (
    <div className="space-y-4">
      {/* Subscription tiers */}
      <section>
        <SectionHeader
          icon={Crown}
          title="Tiers de suscripción"
          subtitle="Configura los planes que ofreces a tus fans"
          action={
            <Button variant="outline" size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Nuevo tier
            </Button>
          }
        />
        <div className="grid gap-3 md:grid-cols-3">
          {TIERS.map((t) => (
            <ManagerTierCard key={t.id} tier={t} />
          ))}
        </div>
      </section>

      {/* Vault */}
      <section>
        <SectionHeader
          icon={Lock}
          title="Vault de contenido"
          subtitle={`${published.length} publicaciones activas · ${VAULT.length - published.length} en cola`}
          action={
            <Button variant="brand" size="sm" className="gap-1.5">
              <Upload className="h-3.5 w-3.5" />
              Subir contenido
            </Button>
          }
        />
        <div className="mb-3 flex flex-wrap gap-1.5">
          <FilterPill
            active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            Publicado · {published.length}
          </FilterPill>
          <FilterPill
            active={filter === "photos"}
            onClick={() => setFilter("photos")}
          >
            Fotos · {published.filter((v) => v.type === "photo").length}
          </FilterPill>
          <FilterPill
            active={filter === "videos"}
            onClick={() => setFilter("videos")}
          >
            Videos · {published.filter((v) => v.type === "video").length}
          </FilterPill>
          <FilterPill
            active={filter === "drafts"}
            onClick={() => setFilter("drafts")}
          >
            Borradores / programados ·{" "}
            {VAULT.filter((v) => v.status !== "published").length}
          </FilterPill>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((v) => (
            <VaultCard key={v.id} item={v} />
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section>
        <SectionHeader
          icon={Sparkles}
          title="Actividad reciente"
          subtitle="Suscripciones, compras y propinas"
        />
        <Card className="overflow-hidden p-0">
          <div className="divide-y">
            {ACTIVITY.map((a) => (
              <ActivityRow key={a.id} activity={a} />
            ))}
          </div>
          <div className="border-t bg-muted/30 px-4 py-2 text-center">
            <Button variant="ghost" size="sm" className="text-xs">
              Ver toda la actividad
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}

/* -------------------- Section header -------------------- */

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: typeof Crown;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <div>
        <h3 className="flex items-center gap-2 text-base font-bold tracking-tight">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/* -------------------- Manager tier card -------------------- */

function ManagerTierCard({ tier }: { tier: SubTier }) {
  const monthlyRevenue = (tier.price / tier.durationMonths) * tier.subs;
  return (
    <Card
      className={cn(
        "relative flex flex-col gap-3 p-4",
        tier.highlight && "border-primary/40 bg-primary/5"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold">{tier.name}</p>
            {tier.badge && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                  tier.highlight
                    ? "bg-gradient-gold text-amber-950"
                    : "bg-primary/15 text-primary"
                )}
              >
                {tier.badge}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-bold leading-none">
              {formatCOP(tier.price)}
            </span>
            <span className="text-[10px] text-muted-foreground">
              / {tier.durationMonths === 1 ? "mes" : `${tier.durationMonths}m`}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          aria-label="Editar tier"
        >
          <Edit3 className="h-3 w-3" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-md bg-muted/40 p-2 text-[11px]">
        <div>
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
            Suscriptores
          </p>
          <p className="font-bold tabular-nums">{tier.subs}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
            Mensual
          </p>
          <p className="font-bold tabular-nums text-emerald-400">
            {formatCOP(Math.round(monthlyRevenue))}
          </p>
        </div>
      </div>

      <ul className="space-y-1">
        {tier.benefits.map((b) => (
          <li
            key={b}
            className="flex items-start gap-1.5 text-[11px] text-foreground/80"
          >
            <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex gap-1.5">
        <Button variant="outline" size="sm" className="flex-1 gap-1">
          <Pencil className="h-3 w-3" />
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          aria-label="Pausar"
        >
          <Pause className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
}

/* -------------------- Vault card -------------------- */

function VaultCard({ item }: { item: VaultItem }) {
  const isDraft = item.status === "draft";
  const isScheduled = item.status === "scheduled";

  return (
    <Card className="group relative overflow-hidden p-0">
      <div className="relative aspect-[3/4] w-full bg-muted">
        <Image
          src={item.thumb}
          alt=""
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={cn("object-cover", (isDraft || isScheduled) && "opacity-60")}
        />

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {item.access === "subscription" && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-foreground">
              <Crown className="h-2.5 w-2.5" />
              Sub
            </span>
          )}
          {item.access === "ppv" && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-gradient-gold px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-950">
              PPV {item.price && formatCOP(item.price)}
            </span>
          )}
          {item.access === "free" && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-white/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur">
              Gratis
            </span>
          )}
          {isDraft && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
              Borrador
            </span>
          )}
          {isScheduled && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-sky-500/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              Programado
            </span>
          )}
        </div>

        <div className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
          {item.type === "video" ? (
            <>
              <Play className="h-2.5 w-2.5 fill-white" />
              {item.duration}
            </>
          ) : (
            <ImageIcon className="h-2.5 w-2.5" />
          )}
        </div>

        {/* Hover actions */}
        <div className="absolute inset-x-2 bottom-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="outline"
            size="sm"
            className="h-7 flex-1 border-white/20 bg-black/60 px-2 text-[10px] text-white backdrop-blur hover:bg-black/80"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 border-white/20 bg-black/60 px-2 text-[10px] text-white backdrop-blur hover:bg-black/80"
            aria-label="Más"
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 border-rose-500/40 bg-rose-500/20 px-2 text-[10px] text-rose-300 backdrop-blur hover:bg-rose-500/30"
            aria-label="Eliminar"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="p-2.5">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-0.5">
            <Eye className="h-2.5 w-2.5" />
            {item.views.toLocaleString("es-CO")}
          </span>
          <span className="inline-flex items-center gap-0.5">
            <Heart className="h-2.5 w-2.5" />
            {item.likes}
          </span>
          {item.access !== "free" && item.status === "published" && (
            <span className="inline-flex items-center gap-0.5">
              <Unlock className="h-2.5 w-2.5" />
              {item.unlocks}
            </span>
          )}
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          {item.earnings > 0 ? (
            <p className="text-sm font-bold leading-none text-emerald-400">
              {formatCOP(item.earnings)}
            </p>
          ) : (
            <p className="text-[10px] text-muted-foreground">{item.postedAt}</p>
          )}
          <span className="text-[9px] text-muted-foreground">
            {item.earnings > 0 ? item.postedAt : ""}
          </span>
        </div>
      </div>
    </Card>
  );
}

/* -------------------- Activity row -------------------- */

function ActivityRow({ activity }: { activity: Activity }) {
  const meta = ACTIVITY_LABEL[activity.kind];
  const Icon = meta.icon;
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          meta.tone
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm">
          <span className="font-semibold">{activity.user}</span>{" "}
          <span className="text-muted-foreground">— {meta.label}</span>
        </p>
        {activity.detail && (
          <p className="text-[11px] text-muted-foreground">{activity.detail}</p>
        )}
      </div>
      <div className="text-right">
        <p className="text-sm font-bold tabular-nums text-emerald-400">
          +{formatCOP(activity.amount)}
        </p>
        <p className="text-[10px] text-muted-foreground">{activity.ago}</p>
      </div>
    </div>
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
