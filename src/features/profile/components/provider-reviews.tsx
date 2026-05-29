"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Filter,
  MessageCircle,
  MoreHorizontal,
  Reply,
  Star,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

/* -------------------- Mock data -------------------- */

interface Review {
  id: string;
  author: string;
  initials: string;
  avatar?: string;
  verified: boolean;
  rating: number;
  body: string;
  date: string;
  daysAgo: number;
  postName: string;
  tags: string[];
  helpful: number;
  reply?: { body: string; date: string };
}

const REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Carlos M.",
    initials: "CM",
    avatar: "https://i.pravatar.cc/80?img=12",
    verified: true,
    rating: 5,
    body: "Excelente experiencia, profesional y discreta. La comunicación previa fue clara, llegó puntual y el lugar muy cómodo. Sin duda volveré a contactarla.",
    date: "Hace 2 días",
    daysAgo: 2,
    postName: "Sofía",
    tags: ["Puntualidad", "Discreción", "Trato"],
    helpful: 12,
    reply: {
      body: "¡Gracias Carlos! Me encantó conocerte, espero verte pronto.",
      date: "Hace 1 día",
    },
  },
  {
    id: "r2",
    author: "Andrés P.",
    initials: "AP",
    avatar: "https://i.pravatar.cc/80?img=33",
    verified: true,
    rating: 5,
    body: "Muy atenta de principio a fin. El ambiente fue increíble y se nota la profesionalidad. Recomendada 100%.",
    date: "Hace 5 días",
    daysAgo: 5,
    postName: "Valentina",
    tags: ["Ambiente", "Atención"],
    helpful: 8,
  },
  {
    id: "r3",
    author: "Felipe R.",
    initials: "FR",
    verified: false,
    rating: 4,
    body: "Buena comunicación, llegó a tiempo y muy cordial. Pequeño detalle con el lugar pero nada grave. Volvería sin dudarlo.",
    date: "Hace 1 semana",
    daysAgo: 7,
    postName: "Sofía",
    tags: ["Comunicación"],
    helpful: 5,
  },
  {
    id: "r4",
    author: "Juan David L.",
    initials: "JL",
    avatar: "https://i.pravatar.cc/80?img=8",
    verified: true,
    rating: 5,
    body: "Súper recomendada. Llegó a la hora, fue muy amable y se nota que se cuida. Repetiría sin dudarlo.",
    date: "Hace 10 días",
    daysAgo: 10,
    postName: "Camila",
    tags: ["Higiene", "Puntualidad"],
    helpful: 14,
    reply: {
      body: "¡Gracias por tomarte el tiempo de dejar la reseña, Juan!",
      date: "Hace 9 días",
    },
  },
  {
    id: "r5",
    author: "Mateo G.",
    initials: "MG",
    verified: false,
    rating: 3,
    body: "Cumplió con lo acordado pero sentí que pudo haber sido un poco más cercana. El servicio en sí estuvo bien.",
    date: "Hace 12 días",
    daysAgo: 12,
    postName: "Daniela",
    tags: [],
    helpful: 2,
  },
  {
    id: "r6",
    author: "Sebastián O.",
    initials: "SO",
    avatar: "https://i.pravatar.cc/80?img=15",
    verified: true,
    rating: 5,
    body: "Una de las mejores experiencias. Muy auténtica, sin prisas y con un trato exquisito. La volveré a buscar.",
    date: "Hace 2 semanas",
    daysAgo: 14,
    postName: "Valentina",
    tags: ["Trato", "Autenticidad"],
    helpful: 18,
  },
];

type FilterKey = "all" | "5" | "4" | "3" | "unreplied";
type SortKey = "recent" | "highest" | "lowest" | "helpful";

/* -------------------- Component -------------------- */

export function ProviderReviews() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<SortKey>("recent");

  const filtered = useMemo(() => {
    const list = REVIEWS.filter((r) => {
      if (filter === "all") return true;
      if (filter === "unreplied") return !r.reply;
      return r.rating === Number(filter);
    });
    return [...list].sort((a, b) => {
      if (sort === "recent") return a.daysAgo - b.daysAgo;
      if (sort === "highest") return b.rating - a.rating;
      if (sort === "lowest") return a.rating - b.rating;
      return b.helpful - a.helpful;
    });
  }, [filter, sort]);

  const total = REVIEWS.length;
  const avg = REVIEWS.reduce((s, r) => s + r.rating, 0) / total;
  const dist = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: REVIEWS.filter((r) => r.rating === stars).length,
  }));
  const unreplied = REVIEWS.filter((r) => !r.reply).length;
  const responseRate = Math.round(
    ((total - unreplied) / total) * 100
  );

  return (
    <div className="space-y-4">
      {/* Summary header */}
      <Card className="overflow-hidden p-0">
        <div className="grid gap-0 md:grid-cols-[260px_minmax(0,1fr)]">
          {/* Big rating */}
          <div className="bg-gradient-sensual relative flex flex-col items-center justify-center gap-1 overflow-hidden p-6 text-white">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/30 blur-3xl" />
            <div className="relative">
              <p className="text-5xl font-bold leading-none">
                {avg.toFixed(1)}
              </p>
              <div className="mt-2 flex justify-center">
                <StarRow rating={avg} />
              </div>
              <p className="mt-1.5 text-center text-xs text-white/80">
                Basado en {total} reseñas
              </p>
            </div>
          </div>

          {/* Distribution + meta */}
          <div className="space-y-3 p-5">
            <div className="space-y-1.5">
              {dist.map((d) => {
                const pct = (d.count / total) * 100;
                return (
                  <div
                    key={d.stars}
                    className="flex items-center gap-2 text-xs"
                  >
                    <span className="flex w-10 shrink-0 items-center gap-0.5 font-semibold">
                      {d.stars}
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 shrink-0 text-right tabular-nums text-muted-foreground">
                      {d.count}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-2 border-t pt-3">
              <SummaryStat
                icon={TrendingUp}
                label="Respondidas"
                value={`${responseRate}%`}
                tone="text-emerald-400"
              />
              <SummaryStat
                icon={MessageCircle}
                label="Pendientes"
                value={String(unreplied)}
                tone="text-primary"
              />
              <SummaryStat
                icon={ThumbsUp}
                label="Útiles"
                value={String(REVIEWS.reduce((s, r) => s + r.helpful, 0))}
                tone="text-sky-400"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Filters + sort */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <FilterPill
            active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            Todas
          </FilterPill>
          <FilterPill
            active={filter === "5"}
            onClick={() => setFilter("5")}
          >
            5 ★
          </FilterPill>
          <FilterPill
            active={filter === "4"}
            onClick={() => setFilter("4")}
          >
            4 ★
          </FilterPill>
          <FilterPill
            active={filter === "3"}
            onClick={() => setFilter("3")}
          >
            3 ★ y menos
          </FilterPill>
          <FilterPill
            active={filter === "unreplied"}
            onClick={() => setFilter("unreplied")}
          >
            Sin responder
          </FilterPill>
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor="reviews-sort"
            className="text-[11px] text-muted-foreground"
          >
            Ordenar
          </label>
          <select
            id="reviews-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-md border bg-background px-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="recent">Más recientes</option>
            <option value="highest">Mayor rating</option>
            <option value="lowest">Menor rating</option>
            <option value="helpful">Más útiles</option>
          </select>
        </div>
      </div>

      {/* Reviews list */}
      {filtered.length === 0 ? (
        <Card className="border-dashed p-8 text-center">
          <Star className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            No hay reseñas que coincidan con el filtro.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------- Review card -------------------- */

function ReviewCard({ review }: { review: Review }) {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          {review.avatar && <AvatarImage src={review.avatar} alt="" />}
          <AvatarFallback className="text-xs font-semibold">
            {review.initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <p className="truncate text-sm font-semibold">{review.author}</p>
            {review.verified && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-sky-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-400">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Verificado
              </span>
            )}
            <span className="text-[11px] text-muted-foreground">
              · {review.date}
            </span>
          </div>

          <div className="mt-0.5 flex items-center gap-2">
            <StarRow rating={review.rating} size="sm" />
            <span className="text-[11px] text-muted-foreground">
              Sobre{" "}
              <span className="font-semibold text-foreground">
                {review.postName}
              </span>
            </span>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-foreground/85">
            {review.body}
          </p>

          {review.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {review.tags.map((t) => (
                <Badge
                  key={t}
                  variant="outline"
                  className="rounded-full bg-muted/50 px-2 py-0 text-[10px] font-medium"
                >
                  {t}
                </Badge>
              ))}
            </div>
          )}

          {/* Existing reply */}
          {review.reply && (
            <div className="mt-3 rounded-lg border-l-2 border-primary bg-muted/30 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                <Reply className="h-3 w-3" />
                Tu respuesta · {review.reply.date}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-foreground/80">
                {review.reply.body}
              </p>
            </div>
          )}

          {/* Reply composer */}
          {!review.reply && replying && (
            <div className="mt-3 space-y-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Escribe una respuesta pública…"
                rows={2}
                className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setReplying(false);
                    setReplyText("");
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="brand"
                  size="sm"
                  disabled={!replyText.trim()}
                  onClick={() => {
                    // Mock — real flow will hit flitrhub-api.
                    setReplying(false);
                    setReplyText("");
                  }}
                >
                  Publicar respuesta
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-3 flex items-center gap-1 border-t pt-2">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ThumbsUp className="h-3 w-3" />
              Útil ({review.helpful})
            </button>
            {!review.reply && !replying && (
              <button
                type="button"
                onClick={() => setReplying(true)}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10"
              >
                <Reply className="h-3 w-3" />
                Responder
              </button>
            )}
            <button
              type="button"
              className="ml-auto rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Más opciones"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* -------------------- Helpers -------------------- */

function StarRow({
  rating,
  size = "md",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  const cls = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = rating >= n;
        const half = !fill && rating >= n - 0.5;
        return (
          <Star
            key={n}
            className={cn(
              cls,
              fill || half
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted-foreground/40"
            )}
          />
        );
      })}
    </div>
  );
}

function SummaryStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Star;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1">
        <Icon className={cn("h-3 w-3", tone)} />
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="mt-0.5 text-base font-bold tabular-nums">{value}</p>
    </div>
  );
}

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
