"use client";

import { useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, ChevronLeft, ChevronRight, Heart, Pencil, Target } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { DiscreetCover } from "@/features/posts/components/discreet-cover";
import { TIER_STYLES } from "@/features/posts/components/post-card";
import { cn } from "@/shared/lib/utils";
import { formatCOP } from "@/shared/lib/format";
import type { Post } from "@/features/posts/data/mock-posts";
import {
  computeMatchScore,
  hasAnyPreference,
  type UserPreferences,
} from "@/features/posts/preferences";

interface RecomendadosProps {
  posts: Post[];
  prefs: UserPreferences;
  onEditPreferences: () => void;
}

interface RankedPost {
  post: Post;
  score: number;
}

export function Recomendados({ posts, prefs, onEditPreferences }: RecomendadosProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const ranked = useMemo<RankedPost[]>(() => {
    if (!hasAnyPreference(prefs)) return [];
    const items = posts
      .map((post) => ({ post, score: computeMatchScore(post, prefs).score }))
      .filter((r) => r.score >= 50)
      .sort((a, b) => b.score - a.score || (b.post.rating ?? 0) - (a.post.rating ?? 0));
    return items.slice(0, 12);
  }, [posts, prefs]);

  if (!hasAnyPreference(prefs)) {
    return (
      <section className="mb-8">
        <Card
          className={cn(
            "bg-gradient-sensual relative overflow-hidden border-primary/20 p-5",
            "flex flex-wrap items-center gap-4"
          )}
        >
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
            <Target className="h-6 w-6" />
          </div>
          <div className="relative min-w-0 flex-1">
            <p className="text-base font-bold text-white md:text-lg">
              Cuéntanos qué buscas
            </p>
            <p className="text-xs text-white/70 md:text-sm">
              Define tus preferencias y te mostraremos los perfiles que más coinciden con tu estilo.
            </p>
          </div>
          <Button
            variant="brand"
            onClick={onEditPreferences}
            className="relative shrink-0"
          >
            <Heart className="h-4 w-4" />
            Configurar
          </Button>
        </Card>
      </section>
    );
  }

  const scrollBy = (dir: 1 | -1) =>
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <Target className="h-5 w-5 text-primary" />
            Recomendados para ti
          </h2>
          <p className="text-xs text-muted-foreground">
            Perfiles que coinciden con tus preferencias
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditPreferences}
            className="h-8 gap-1.5 text-muted-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scrollBy(-1)}
            aria-label="Anterior"
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scrollBy(1)}
            aria-label="Siguiente"
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {ranked.length === 0 ? (
        <Card className="border-dashed p-6 text-center text-sm text-muted-foreground">
          No encontramos perfiles que coincidan con tus preferencias. Prueba
          ajustando tu configuración.
        </Card>
      ) : (
        <div
          ref={scrollerRef}
          className="scrollbar-hide -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2"
        >
          {ranked.map(({ post, score }) => (
            <MatchCard key={post.id} post={post} score={score} />
          ))}
        </div>
      )}
    </section>
  );
}

function MatchCard({ post, score }: { post: Post; score: number }) {
  const tier = TIER_STYLES[post.tier];
  const ringColor =
    score >= 85
      ? "ring-emerald-400/70"
      : score >= 70
      ? "ring-primary/60"
      : "ring-gold/50";

  return (
    <Card
      className={cn(
        "group relative w-[220px] shrink-0 snap-start overflow-hidden p-0",
        "ring-1 transition-all hover:-translate-y-1 hover:shadow-2xl",
        ringColor
      )}
    >
      <Link
        href={`/profile/${encodeURIComponent(post.id)}`}
        className="absolute inset-0 z-10"
        aria-label={`Ver perfil de ${post.name}`}
      />
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
        <Image
          src={post.imageUrl}
          alt={post.name}
          fill
          sizes="220px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <DiscreetCover size="sm" />

        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase text-white shadow-md backdrop-blur">
          <Target className="h-3 w-3 text-primary" />
          {score}% match
        </div>

        <div
          className={cn(
            "absolute right-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-semibold shadow",
            tier.className
          )}
        >
          {tier.label}
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 text-white">
          <div className="flex items-center gap-1">
            <p className="truncate text-sm font-semibold">{post.name}</p>
            {post.verified && (
              <BadgeCheck className="h-4 w-4 shrink-0 fill-sky-400 text-white" />
            )}
          </div>
          <div className="flex items-center justify-between text-[11px] opacity-90">
            <span>
              {post.age} · {post.location} · {post.distanceKm}km
            </span>
            <span className="font-semibold text-gold">{formatCOP(post.pricePerHour)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
