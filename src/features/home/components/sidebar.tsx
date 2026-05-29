"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { services, type ServiceKey } from "@/features/posts/data/services";
import { discreetLabel, useDiscreet } from "@/features/discreet/use-discreet";
import { AdSidebarBlock, SponsoredTag } from "@/features/home/components/ads";
import { generateFeatured } from "@/features/posts/data/mock-posts";

interface SidebarProps {
  active: ServiceKey;
  onSelect: (key: ServiceKey) => void;
  showAds?: boolean;
  showSponsoredPick?: boolean;
}

export function Sidebar({
  active,
  onSelect,
  showAds = false,
  showSponsoredPick = false,
}: SidebarProps) {
  const { enabled: discreet } = useDiscreet();

  return (
    <aside className="fixed inset-y-0 left-0 top-16 z-30 hidden w-72 shrink-0 border-r bg-background md:block">
      <nav className="flex h-[calc(100vh-4rem)] flex-col gap-1 overflow-y-auto p-4">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {discreet ? "Catálogo" : "Servicios"}
        </p>
        {services.map((service) => {
          const Icon = service.icon;
          const isActive = active === service.key;
          const label = discreet ? discreetLabel(service.key) : service.label;
          return (
            <button
              key={service.key}
              type="button"
              onClick={() => onSelect(service.key)}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-accent"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
                  isActive
                    ? "border-primary/30 bg-primary/15 text-primary"
                    : "border-border bg-muted/40 text-primary group-hover:bg-background"
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-brand">
                  {label}{" "}
                  {!discreet && (
                    <span className="text-foreground/80">
                      en {service.city}
                    </span>
                  )}
                </span>
              </span>
            </button>
          );
        })}

        <div className="mt-auto space-y-3">
          {showSponsoredPick && <SponsoredPickCard active={active} />}
          {showAds && <AdSidebarBlock />}
          <div className="rounded-xl border bg-muted/40 p-4">
            <p className="text-xs font-semibold text-muted-foreground">Aviso</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Plataforma exclusiva para mayores de 18 años. Verifica la
              autenticidad de los perfiles antes de cualquier contacto.
            </p>
          </div>
        </div>
      </nav>
    </aside>
  );
}

export function MobileServiceTabs({
  active,
  onSelect,
}: {
  active: ServiceKey;
  onSelect: (key: ServiceKey) => void;
}) {
  const { enabled: discreet } = useDiscreet();
  return (
    <div className="-mx-4 mb-4 overflow-x-auto border-b bg-background px-4 md:hidden">
      <div className="flex gap-2 pb-3">
        {services.map((service) => {
          const Icon = service.icon;
          const isActive = active === service.key;
          const label = discreet ? discreetLabel(service.key) : service.label;
          return (
            <button
              key={service.key}
              type="button"
              onClick={() => onSelect(service.key)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Sponsored pick — a tiny "patrocinado" mini-profile shown to clients only.
 * Picks a featured profile deterministically from the active service. */
function SponsoredPickCard({ active }: { active: ServiceKey }) {
  const featured = generateFeatured(active);
  const post = featured[0];
  if (!post) return null;
  return (
    <Link
      href={`/post/${encodeURIComponent(post.id)}`}
      className="group flex items-center gap-2.5 rounded-xl border bg-card p-2.5 transition-colors hover:border-primary/40 hover:bg-primary/5"
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={post.imageUrl}
          alt={post.name}
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-1">
          <SponsoredTag variant="subtle" />
        </div>
        <p className="flex items-center gap-1 truncate text-xs font-semibold">
          {post.name}
          {post.verified && (
            <BadgeCheck className="h-3 w-3 shrink-0 fill-sky-500 text-white" />
          )}
        </p>
        <p className="truncate text-[10px] text-muted-foreground">
          {post.location}, {post.city}
        </p>
      </div>
      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
