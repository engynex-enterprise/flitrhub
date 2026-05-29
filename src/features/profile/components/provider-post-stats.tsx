"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  Heart,
  MessageCircle,
  Phone,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { TIER_STYLES } from "@/features/posts/components/post-card";
import { generatePosts, type Post } from "@/features/posts/data/mock-posts";
import { cn } from "@/shared/lib/utils";

import { Kpi, Sparkline } from "./provider-stats";

/* -------------------- Mock data -------------------- */

interface PostStat {
  post: Post;
  views: number;
  views7d: number;
  favs: number;
  chats: number;
  contacts: number;
  rating: number;
  reviewCount: number;
  trend: number[];
  topSource: string;
  isPromoted: boolean;
}

const STAT_SEED = [
  {
    views: 4250,
    views7d: 980,
    favs: 312,
    chats: 89,
    contacts: 42,
    rating: 4.9,
    reviewCount: 52,
    topSource: "Búsqueda",
    promoted: true,
  },
  {
    views: 3120,
    views7d: 720,
    favs: 248,
    chats: 64,
    contacts: 31,
    rating: 4.8,
    reviewCount: 38,
    topSource: "Recomendaciones",
    promoted: true,
  },
  {
    views: 2410,
    views7d: 540,
    favs: 187,
    chats: 47,
    contacts: 22,
    rating: 4.7,
    reviewCount: 24,
    topSource: "Búsqueda",
    promoted: false,
  },
  {
    views: 1980,
    views7d: 410,
    favs: 142,
    chats: 38,
    contacts: 18,
    rating: 4.6,
    reviewCount: 19,
    topSource: "Directo",
    promoted: false,
  },
  {
    views: 1540,
    views7d: 290,
    favs: 98,
    chats: 28,
    contacts: 11,
    rating: 4.5,
    reviewCount: 14,
    topSource: "Recomendaciones",
    promoted: false,
  },
];

// Deterministic pseudo-random — stable across renders.
function genTrend(seed: number, len = 14): number[] {
  const out: number[] = [];
  let s = seed * 53 + 17;
  for (let i = 0; i < len; i++) {
    s = (s * 9301 + 49297) % 233280;
    out.push(Math.round(40 + (s / 233280) * 100));
  }
  return out;
}

function buildStats(): PostStat[] {
  const posts = generatePosts(0, STAT_SEED.length, "prepagos");
  return posts.map((p, i) => ({
    post: p,
    ...STAT_SEED[i],
    trend: genTrend(i + 1),
    isPromoted: STAT_SEED[i].promoted,
  }));
}

type SortKey = "views" | "favs" | "contacts" | "conversion";

/* -------------------- Component -------------------- */

export function ProviderPostStats() {
  const stats = useMemo(() => buildStats(), []);
  const [sort, setSort] = useState<SortKey>("views");

  const sorted = useMemo(() => {
    return [...stats].sort((a, b) => {
      if (sort === "views") return b.views - a.views;
      if (sort === "favs") return b.favs - a.favs;
      if (sort === "contacts") return b.contacts - a.contacts;
      const aConv = a.contacts / a.views;
      const bConv = b.contacts / b.views;
      return bConv - aConv;
    });
  }, [stats, sort]);

  const totalViews = stats.reduce((s, x) => s + x.views, 0);
  const totalContacts = stats.reduce((s, x) => s + x.contacts, 0);
  const totalFavs = stats.reduce((s, x) => s + x.favs, 0);

  const byViews = [...stats].sort((a, b) => b.views - a.views);
  const best = byViews[0];
  const worst = byViews[byViews.length - 1];

  return (
    <div className="space-y-4">
      {/* Top KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi
          label="Publicaciones"
          value={String(stats.length)}
          icon={Sparkles}
          tone="text-primary bg-primary/10"
        />
        <Kpi
          label="Vistas totales"
          value={totalViews.toLocaleString("es-CO")}
          icon={Eye}
          tone="text-sky-400 bg-sky-500/10"
        />
        <Kpi
          label="Favoritos"
          value={totalFavs.toLocaleString("es-CO")}
          icon={Heart}
          tone="text-rose-400 bg-rose-500/10"
        />
        <Kpi
          label="Conversión global"
          value={`${((totalContacts / totalViews) * 100).toFixed(1)}%`}
          icon={TrendingUp}
          tone="text-gold bg-amber-500/10"
        />
      </div>

      {/* Best vs worst */}
      <div className="grid gap-3 md:grid-cols-2">
        <HighlightCard
          title="Tu mejor publicación"
          tone="emerald"
          stat={best}
          metric="conversión"
          value={`${((best.contacts / best.views) * 100).toFixed(1)}%`}
        />
        <HighlightCard
          title="Necesita atención"
          tone="rose"
          stat={worst}
          metric="vistas"
          value={worst.views.toLocaleString("es-CO")}
        />
      </div>

      {/* Sort */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Ordenar por</span>
        <SortPill active={sort === "views"} onClick={() => setSort("views")}>
          Vistas
        </SortPill>
        <SortPill active={sort === "favs"} onClick={() => setSort("favs")}>
          Favoritos
        </SortPill>
        <SortPill
          active={sort === "contacts"}
          onClick={() => setSort("contacts")}
        >
          Contactos
        </SortPill>
        <SortPill
          active={sort === "conversion"}
          onClick={() => setSort("conversion")}
        >
          Conversión
        </SortPill>
      </div>

      {/* Per-post detailed cards */}
      <div className="space-y-3">
        {sorted.map((s, i) => (
          <PostStatsCard key={s.post.id} stat={s} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}

/* -------------------- Sub-components -------------------- */

function HighlightCard({
  title,
  tone,
  stat,
  metric,
  value,
}: {
  title: string;
  tone: "emerald" | "rose";
  stat: PostStat;
  metric: string;
  value: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
            tone === "emerald"
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-rose-500/10 text-rose-400"
          )}
        >
          {value} {metric}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
          <Image
            src={stat.post.imageUrl}
            alt=""
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{stat.post.name}</p>
          <p className="text-[11px] text-muted-foreground">
            {stat.views.toLocaleString("es-CO")} vistas · {stat.contacts}{" "}
            contactos · {stat.favs} ♥
          </p>
        </div>
        <div className="hidden w-24 shrink-0 sm:block">
          <Sparkline data={stat.trend} tone={tone} />
        </div>
      </div>
    </Card>
  );
}

function SortPill({
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

function PostStatsCard({ stat, rank }: { stat: PostStat; rank: number }) {
  const tier = TIER_STYLES[stat.post.tier];
  const conv = ((stat.contacts / stat.views) * 100).toFixed(1);
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col md:flex-row">
        <Link
          href={`/post/${encodeURIComponent(stat.post.id)}`}
          className="relative h-32 w-full shrink-0 overflow-hidden bg-muted md:h-auto md:w-32"
        >
          <Image
            src={stat.post.imageUrl}
            alt={stat.post.name}
            fill
            sizes="128px"
            className="object-cover"
          />
          <Badge
            className={cn(
              "absolute left-2 top-2 gap-1 rounded-full px-1.5 py-0 text-[9px] font-semibold shadow",
              tier.className
            )}
          >
            {tier.label}
          </Badge>
          <span className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-[10px] font-bold text-white backdrop-blur">
            #{rank}
          </span>
          {stat.isPromoted && (
            <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary-foreground">
              <Sparkles className="h-2.5 w-2.5" />
              Promoción
            </span>
          )}
        </Link>

        <div className="min-w-0 flex-1 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{stat.post.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {stat.post.age} años · {stat.post.location} · ★ {stat.rating} (
                {stat.reviewCount})
              </p>
            </div>
            <Link
              href={`/post/${encodeURIComponent(stat.post.id)}`}
              className="shrink-0 text-[11px] font-semibold text-primary hover:underline"
            >
              Ver publicación →
            </Link>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-5">
            <MicroStat
              icon={Eye}
              label="Vistas"
              value={stat.views.toLocaleString("es-CO")}
              tone="text-sky-400"
            />
            <MicroStat
              icon={Heart}
              label="Favs"
              value={String(stat.favs)}
              tone="text-rose-400"
            />
            <MicroStat
              icon={MessageCircle}
              label="Chats"
              value={String(stat.chats)}
              tone="text-primary"
            />
            <MicroStat
              icon={Phone}
              label="Contactos"
              value={String(stat.contacts)}
              tone="text-emerald-400"
            />
            <MicroStat
              icon={TrendingUp}
              label="Conv."
              value={`${conv}%`}
              tone="text-gold"
            />
          </div>

          <div className="mt-3 flex items-center gap-3">
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Últimos 14d
            </span>
            <div className="min-w-0 flex-1">
              <Sparkline data={stat.trend} />
            </div>
            <span className="shrink-0 text-[11px] text-muted-foreground">
              {stat.views7d.toLocaleString("es-CO")} vistas/7d
            </span>
          </div>

          <div className="mt-2 text-[10px] text-muted-foreground">
            Mayor tráfico desde:{" "}
            <span className="font-semibold text-foreground">
              {stat.topSource}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function MicroStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Eye;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-md border bg-background/50 p-2">
      <div className="flex items-center gap-1">
        <Icon className={cn("h-3 w-3", tone)} />
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="mt-0.5 text-sm font-bold tabular-nums">{value}</p>
    </div>
  );
}
