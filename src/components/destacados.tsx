"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, ChevronLeft, ChevronRight, Crown, Flame } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCOP } from "@/lib/format";
import type { Post } from "@/lib/mock-posts";

interface DestacadosProps {
  posts: Post[];
}

export function Destacados({ posts }: DestacadosProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (posts.length === 0) return null;

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <Flame className="h-5 w-5 text-gold" />
            Destacados
          </h2>
          <p className="text-xs text-muted-foreground">
            Perfiles Platino con prioridad de visibilidad
          </p>
        </div>
        <div className="flex items-center gap-1">
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

      <div
        ref={scrollerRef}
        className="scrollbar-hide -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2"
      >
        {posts.map((post) => (
          <FeaturedCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

function FeaturedCard({ post }: { post: Post }) {
  return (
    <Card
      className={cn(
        "group relative w-[220px] shrink-0 snap-start overflow-hidden p-0",
        "ring-1 ring-gold/40 transition-all hover:-translate-y-1 hover:shadow-2xl hover:ring-gold/70"
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
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
        <div className="bg-gradient-gold absolute left-2 top-2 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase text-amber-950 shadow-md">
          <Crown className="h-3 w-3" />
          Destacado
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3 text-white">
          <div className="flex items-center gap-1">
            <p className="truncate text-sm font-semibold">{post.name}</p>
            {post.verified && (
              <BadgeCheck className="h-4 w-4 shrink-0 fill-sky-400 text-white" />
            )}
          </div>
          <div className="flex items-center justify-between text-[11px] opacity-90">
            <span>
              {post.age} · {post.location}
            </span>
            <span className="font-semibold text-gold">{formatCOP(post.pricePerHour)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
