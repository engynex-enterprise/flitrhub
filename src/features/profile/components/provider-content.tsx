"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Crown,
  Edit3,
  Eye,
  Heart,
  Image as ImageIcon,
  Lock,
  MoreHorizontal,
  Play,
  Trash2,
  Unlock,
  Upload,
} from "lucide-react";

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
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold tracking-tight">
            <Lock className="h-4 w-4 text-primary" />
            Vault de contenido
          </h3>
          <p className="text-xs text-muted-foreground">
            {published.length} publicaciones activas ·{" "}
            {VAULT.length - published.length} en cola
          </p>
        </div>
        <Button variant="brand" size="sm" className="gap-1.5">
          <Upload className="h-3.5 w-3.5" />
          Subir contenido
        </Button>
      </div>

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
          className={cn(
            "object-cover",
            (isDraft || isScheduled) && "opacity-60"
          )}
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
