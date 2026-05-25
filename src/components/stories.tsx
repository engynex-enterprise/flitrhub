"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DiscreetCover } from "@/components/discreet-cover";
import { StoryViewer } from "@/components/story-viewer";
import { cn } from "@/lib/utils";
import type { Post } from "@/lib/mock-posts";

interface StoriesProps {
  items: Post[];
}

export function Stories({ items }: StoriesProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Historias en vivo
        </h2>
        <div className="hidden gap-1 sm:flex">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scrollBy(-1)}
            aria-label="Anterior"
            className="h-7 w-7"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scrollBy(1)}
            aria-label="Siguiente"
            className="h-7 w-7"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="scrollbar-hide -mx-1 flex gap-3 overflow-x-auto px-1 py-1"
      >
        <AddStoryBubble />
        {items.map((p, i) => (
          <StoryBubble
            key={p.id}
            post={p}
            onClick={() => setViewerIndex(i)}
          />
        ))}
      </div>

      <StoryViewer
        stories={items}
        initialIndex={viewerIndex ?? 0}
        open={viewerIndex !== null}
        onClose={() => setViewerIndex(null)}
      />
    </section>
  );
}

function StoryBubble({ post, onClick }: { post: Post; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-[72px] shrink-0 flex-col items-center gap-1.5 focus:outline-none"
    >
      <span
        className={cn(
          "ring-gradient relative flex h-16 w-16 items-center justify-center rounded-full p-[2.5px] transition-transform group-hover:scale-105"
        )}
      >
        <span className="block h-full w-full rounded-full bg-background p-[2px]">
          <span className="relative block h-full w-full overflow-hidden rounded-full">
            <Image
              src={post.imageUrl}
              alt={post.name}
              fill
              sizes="64px"
              className="object-cover"
            />
            <DiscreetCover size="xs" rounded showLabel={false} />
          </span>
        </span>
        {post.isOnline && (
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-background" />
        )}
      </span>
      <span className="w-full truncate text-center text-[11px] text-foreground/80">
        {post.name.split(" ")[0]}
      </span>
    </button>
  );
}

function AddStoryBubble() {
  return (
    <button
      type="button"
      className="group flex w-[72px] shrink-0 flex-col items-center gap-1.5 focus:outline-none"
    >
      <span className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-primary/50 bg-primary/10 transition-colors group-hover:bg-primary/15">
        <Plus className="h-6 w-6 text-primary" />
      </span>
      <span className="text-[11px] text-foreground/80">Tu historia</span>
    </button>
  );
}
