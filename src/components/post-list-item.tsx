"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Crown, Heart, MapPin, PlayCircle, Sparkles, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DiscreetCover } from "@/components/discreet-cover";
import { TIER_STYLES } from "@/components/post-card";
import { cn } from "@/lib/utils";
import { formatCOP } from "@/lib/format";
import type { Post } from "@/lib/mock-posts";

interface PostListItemProps {
  post: Post;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export function PostListItem({ post, isFavorite, onToggleFavorite }: PostListItemProps) {
  const tier = TIER_STYLES[post.tier];

  return (
    <Card className="peekable group relative flex overflow-hidden p-0 transition-all hover:shadow-md">
      <Link
        href={`/profile/${encodeURIComponent(post.id)}`}
        className="absolute inset-0 z-10"
        aria-label={`Ver perfil de ${post.name}`}
      />
      <div className="relative h-40 w-32 shrink-0 overflow-hidden bg-muted sm:w-40">
        <Image
          src={post.imageUrl}
          alt={post.name}
          fill
          sizes="160px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <DiscreetCover size="sm" />
        <Badge
          className={cn(
            "absolute left-2 top-2 gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold shadow",
            tier.className
          )}
        >
          <Crown className="h-3 w-3" />
          {tier.label}
        </Badge>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-base font-semibold">{post.name}</p>
                {post.verified && (
                  <BadgeCheck className="h-4 w-4 shrink-0 fill-sky-500 text-white" />
                )}
                {post.isNew && (
                  <Badge className="gap-1 bg-emerald-500 px-1.5 py-0 text-[9px] uppercase text-white">
                    <Sparkles className="h-2.5 w-2.5" />
                    Nuevo
                  </Badge>
                )}
              </div>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {post.age} años · {post.location}, {post.city}
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(post.id);
              }}
              aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
              className={cn(
                "relative z-20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors",
                isFavorite ? "text-rose-500" : "text-foreground/60 hover:text-rose-500"
              )}
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-rose-500")} />
            </button>
          </div>

          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {post.description}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {post.isOnline && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                En línea
              </span>
            )}
            {post.hasVideo && (
              <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold">
                <PlayCircle className="h-3 w-3" />
                Video
              </span>
            )}
            {post.rating !== undefined && (
              <span className="flex items-center gap-1 text-xs font-semibold">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {post.rating.toFixed(1)}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-primary">
            {formatCOP(post.pricePerHour)}
            <span className="text-[10px] font-normal text-muted-foreground">/hora</span>
          </p>
        </div>
      </div>
    </Card>
  );
}
