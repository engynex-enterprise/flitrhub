"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Crown, Heart, MapPin, PlayCircle, Sparkles, Star } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { DiscreetCover } from "@/features/posts/components/discreet-cover";
import { cn } from "@/shared/lib/utils";
import { formatCOP } from "@/shared/lib/format";
import type { Post, Tier } from "@/features/posts/data/mock-posts";

export const TIER_STYLES: Record<
  Tier,
  { label: string; className: string }
> = {
  platino: {
    label: "Platino",
    className: "bg-platino text-platino-foreground",
  },
  oro: {
    label: "Oro",
    className: "bg-gradient-gold text-amber-950",
  },
  plata: {
    label: "Plata",
    className: "bg-slate-300 text-slate-900",
  },
  basico: {
    label: "Básico",
    className: "bg-white/15 text-white backdrop-blur",
  },
};

interface PostCardProps {
  post: Post;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export function PostCard({ post, isFavorite, onToggleFavorite }: PostCardProps) {
  const tier = TIER_STYLES[post.tier];

  return (
    <Card className="peekable group relative overflow-hidden border-border/60 p-0 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_60px_-15px_rgba(220,40,100,0.35)]">
      <Link
        href={`/post/${encodeURIComponent(post.id)}`}
        className="absolute inset-0 z-10"
        aria-label={`Ver perfil de ${post.name}`}
      />
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
        <Image
          src={post.imageUrl}
          alt={post.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
        <DiscreetCover size="md" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />

        <Badge
          className={cn(
            "absolute left-3 top-3 gap-1 rounded-full px-3 py-1 text-xs font-semibold shadow-md",
            tier.className
          )}
        >
          <Crown className="h-3.5 w-3.5" />
          {tier.label}
        </Badge>

        {post.isNew && (
          <Badge className="absolute right-3 top-3 gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase text-white shadow-md">
            <Sparkles className="h-3 w-3" />
            Nuevo
          </Badge>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(post.id);
          }}
          aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          className={cn(
            "absolute bottom-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border bg-background/90 backdrop-blur transition-colors",
            isFavorite ? "text-rose-500" : "text-foreground/70 hover:text-rose-500"
          )}
        >
          <Heart className={cn("h-4 w-4", isFavorite && "fill-rose-500")} />
        </button>

        {post.isOnline && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            En línea
          </div>
        )}
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-1.5">
            <p className="truncate text-base font-semibold">{post.name}</p>
            {post.verified && (
              <BadgeCheck className="h-4 w-4 shrink-0 fill-sky-500 text-white" />
            )}
          </div>
          {post.hasVideo ? (
            <PlayCircle
              className="h-6 w-6 shrink-0 text-foreground/60"
              aria-label="Tiene video"
            />
          ) : post.rating ? (
            <div className="flex shrink-0 items-center gap-1 text-sm font-semibold">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {post.rating.toFixed(1)}
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-2 text-sm">
          <p className="flex items-center gap-1 truncate text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {post.age} años · {post.location}
          </p>
          <p className="shrink-0 font-semibold text-primary">
            {formatCOP(post.pricePerHour)}
            <span className="text-[10px] font-normal text-muted-foreground">/h</span>
          </p>
        </div>
      </div>
    </Card>
  );
}
