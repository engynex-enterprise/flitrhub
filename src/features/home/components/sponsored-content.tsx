"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Crown,
  MapPin,
  Sparkles,
  Star,
  Target,
  X,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { DiscreetCover } from "@/features/posts/components/discreet-cover";
import { SponsoredTag } from "@/features/home/components/ads";
import { TIER_STYLES } from "@/features/posts/components/post-card";
import {
  generateFeatured,
  generatePosts,
  type Post,
} from "@/features/posts/data/mock-posts";
import type { ServiceKey } from "@/features/posts/data/services";
import { services } from "@/features/posts/data/services";
import { useSession } from "@/features/auth/session";
import { useUserPreferences } from "@/features/posts/preferences";
import { formatCOP } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";

/* ============================================================
 * 1. Banner principal home — full-bleed 24h banner for one
 *    advertiser, shown to non-providers at the top of the home.
 * ============================================================ */

export function HomeMainBanner({
  service = "masajes",
  city = "Bogotá",
  className,
}: {
  service?: ServiceKey;
  city?: string;
  className?: string;
}) {
  const { isProvider } = useSession();
  const post = useMemo(() => generateFeatured(service, city)[0], [service, city]);

  if (isProvider || !post) return null;

  return (
    <Link
      href={`/post/${encodeURIComponent(post.id)}`}
      className={cn(
        "group relative block w-full overflow-hidden rounded-2xl border border-primary/20 shadow-lg",
        "aspect-[16/6] md:aspect-[16/4]",
        className
      )}
    >
      <Image
        src={post.imageUrl}
        alt={post.name}
        fill
        sizes="(max-width: 1024px) 100vw, 80vw"
        priority
        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <DiscreetCover size="lg" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/55 to-transparent" />
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />

      <SponsoredTag className="absolute right-3 top-3 z-10" />

      <div className="absolute inset-y-0 left-0 z-10 flex max-w-md flex-col justify-center gap-2 p-5 md:gap-3 md:p-8">
        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gold">
          <Sparkles className="h-3 w-3" />
          Hoy destacada
        </p>
        <h2 className="flex items-center gap-2 text-2xl font-bold leading-tight md:text-4xl">
          {post.name}
          {post.verified && (
            <BadgeCheck className="h-5 w-5 fill-sky-500 text-white md:h-6 md:w-6" />
          )}
        </h2>
        <p className="flex items-center gap-2 text-xs text-muted-foreground md:text-sm">
          <MapPin className="h-3.5 w-3.5" />
          {post.location}, {post.city} · {post.age} años
          {post.rating && (
            <>
              <span className="text-muted-foreground/40">·</span>
              <span className="inline-flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {post.rating.toFixed(1)}
              </span>
            </>
          )}
        </p>
        <p className="hidden line-clamp-2 text-sm text-foreground/85 md:block">
          {post.description}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <Button
            size="sm"
            variant="brand"
            className="gap-1.5 shadow-md md:size-default"
          >
            Conocer perfil
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs text-muted-foreground md:text-sm">
            desde{" "}
            <span className="font-bold text-foreground">
              {formatCOP(post.pricePerHour)}
            </span>
            /h
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ============================================================
 * 2. Notificación push — slide-in toast simulating a paid push
 *    sent to clients who viewed similar profiles.
 * ============================================================ */

const PUSH_STORAGE_KEY = "flitrhub:push-toast-seen";
const PUSH_DELAY_MS = 6500;

export function PushNotificationToast() {
  const { isProvider } = useSession();
  const [open, setOpen] = useState(false);
  const post = useMemo(
    () =>
      generateFeatured("prepagos", "Bogotá")[1] ??
      generateFeatured("prepagos", "Bogotá")[0],
    []
  );

  useEffect(() => {
    if (isProvider) return;
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(PUSH_STORAGE_KEY)) return;
    } catch {
      return;
    }
    const t = setTimeout(() => setOpen(true), PUSH_DELAY_MS);
    return () => clearTimeout(t);
  }, [isProvider]);

  const dismiss = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(PUSH_STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (!open || !post) return null;

  return (
    <div
      role="dialog"
      aria-label="Notificación"
      className="fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-primary/30 bg-card p-3 shadow-2xl"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Cerrar notificación"
        className="absolute right-2 top-2 rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div className="flex items-start gap-3 pr-5">
        <div className="relative shrink-0">
          <Avatar className="no-blur h-11 w-11 ring-2 ring-primary/30">
            <AvatarImage src={post.imageUrl} alt={post.name} />
            <AvatarFallback>{post.name[0]}</AvatarFallback>
          </Avatar>
          {post.isOnline && (
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-card" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
              flitrhub
            </p>
            <SponsoredTag variant="subtle" />
          </div>
          <p className="mt-0.5 text-sm font-bold leading-tight">
            Mira a {post.name} en {post.city}
          </p>
          <p className="text-[11px] leading-snug text-muted-foreground">
            Similar a perfiles que viste recientemente
          </p>
          <div className="mt-2 flex gap-1.5">
            <Button
              asChild
              size="sm"
              variant="brand"
              className="h-7 gap-1 px-2.5 text-[11px]"
            >
              <Link
                href={`/post/${encodeURIComponent(post.id)}`}
                onClick={dismiss}
              >
                Ver perfil
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
            <Button
              onClick={dismiss}
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[11px]"
            >
              Más tarde
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * 3. Banner en perfiles similares — wide CTA at the foot of a
 *    profile, used on the post detail page for clients.
 * ============================================================ */

export function SimilarProfileSponsoredCard({
  excludeId,
  service,
  city = "Bogotá",
}: {
  excludeId?: string;
  service: ServiceKey;
  city?: string;
}) {
  const { isProvider } = useSession();
  const post = useMemo(() => {
    const candidates = generatePosts(0, 6, service, city);
    return candidates.find((p) => p.id !== excludeId) ?? candidates[0];
  }, [service, city, excludeId]);

  if (isProvider || !post) return null;
  const tier = TIER_STYLES[post.tier];

  return (
    <Card className="overflow-hidden p-0">
      <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-0 md:grid-cols-[180px_minmax(0,1fr)]">
        <Link
          href={`/post/${encodeURIComponent(post.id)}`}
          className="relative block aspect-[3/4] overflow-hidden bg-muted"
        >
          <Image
            src={post.imageUrl}
            alt={post.name}
            fill
            sizes="180px"
            className="object-cover transition-transform group-hover:scale-105"
          />
          <DiscreetCover size="sm" />
          <Badge
            className={cn(
              "absolute left-2 top-2 gap-1 rounded-full px-1.5 py-0 text-[9px] font-semibold shadow",
              tier.className
            )}
          >
            <Crown className="h-2.5 w-2.5" />
            {tier.label}
          </Badge>
        </Link>

        <div className="relative flex flex-col justify-between p-4">
          <SponsoredTag className="absolute right-3 top-3" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Perfil similar
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <p className="truncate text-base font-bold md:text-lg">
                {post.name}
              </p>
              {post.verified && (
                <BadgeCheck className="h-4 w-4 fill-sky-500 text-white" />
              )}
            </div>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-0.5">
                <MapPin className="h-3 w-3" />
                {post.location}, {post.city}
              </span>
              {post.rating && (
                <span className="inline-flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {post.rating.toFixed(1)} ({post.reviewsCount})
                </span>
              )}
              <span>· {post.age} años</span>
            </p>
            <p className="mt-2 line-clamp-2 text-xs text-foreground/80">
              {post.description}
            </p>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm">
              <span className="font-bold text-primary">
                {formatCOP(post.pricePerHour)}
              </span>
              <span className="text-muted-foreground">/h</span>
            </p>
            <Button asChild size="sm" variant="brand" className="gap-1.5">
              <Link href={`/post/${encodeURIComponent(post.id)}`}>
                Ver perfil
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ============================================================
 * 4. Match con preferencias — banner shown to clients that
 *    have preferences saved; pitches a profile that "matches".
 * ============================================================ */

export function MatchedPreferenceBanner({
  service,
  city = "Bogotá",
}: {
  service: ServiceKey;
  city?: string;
}) {
  const { isProvider } = useSession();
  const { hasPreferences } = useUserPreferences();
  const post = useMemo(() => {
    const candidates = generatePosts(0, 8, service, city);
    return candidates[2] ?? candidates[0];
  }, [service, city]);

  if (isProvider || !hasPreferences || !post) return null;
  const serviceMeta = services.find((s) => s.key === service);
  const tier = TIER_STYLES[post.tier];

  return (
    <Card className="bg-gradient-sensual relative overflow-hidden border-primary/30 p-0">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/30 blur-3xl" />
      <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />
      <SponsoredTag className="absolute right-3 top-3 z-10" />

      <div className="relative grid gap-0 md:grid-cols-[160px_minmax(0,1fr)]">
        <Link
          href={`/post/${encodeURIComponent(post.id)}`}
          className="relative block aspect-[3/4] overflow-hidden bg-muted md:h-full md:aspect-auto"
        >
          <Image
            src={post.imageUrl}
            alt={post.name}
            fill
            sizes="160px"
            className="object-cover"
          />
          <DiscreetCover size="sm" />
          <Badge
            className={cn(
              "absolute left-2 top-2 gap-1 rounded-full px-1.5 py-0 text-[9px] font-semibold shadow",
              tier.className
            )}
          >
            {tier.label}
          </Badge>
        </Link>

        <div className="flex flex-col justify-center gap-2 p-5 text-white">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gold">
            <Target className="h-3 w-3" />
            Coincide con tus preferencias
          </p>
          <h3 className="text-xl font-bold leading-tight">{post.name}</h3>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-white/75">
            {serviceMeta && (
              <>
                <serviceMeta.icon className="h-3 w-3" />
                {serviceMeta.label}
                <span className="text-white/40">·</span>
              </>
            )}
            <span className="inline-flex items-center gap-0.5">
              <MapPin className="h-3 w-3" />
              {post.location}, {post.city}
            </span>
            <span>· {post.age} años</span>
          </p>
          <p className="line-clamp-2 text-xs text-white/80">
            {post.description}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Button
              asChild
              size="sm"
              className="bg-gradient-gold border-0 font-semibold text-amber-950 hover:opacity-90"
            >
              <Link href={`/post/${encodeURIComponent(post.id)}`}>
                Ver perfil
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
            <span className="text-xs text-white/70">
              <span className="font-bold text-gold">
                {formatCOP(post.pricePerHour)}
              </span>
              /h
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ============================================================
 * 5. Top del servicio — pinned profile at the top of a service
 *    section, with a prominent (but still labeled) badge.
 * ============================================================ */

export function TopOfServicePin({
  service,
  city = "Bogotá",
}: {
  service: ServiceKey;
  city?: string;
}) {
  const { isProvider } = useSession();
  const post = useMemo(() => {
    const candidates = generatePosts(0, 4, service, city);
    return candidates[0];
  }, [service, city]);

  if (isProvider || !post) return null;
  const serviceMeta = services.find((s) => s.key === service);
  const tier = TIER_STYLES[post.tier];

  return (
    <Link
      href={`/post/${encodeURIComponent(post.id)}`}
      className="group relative block overflow-hidden rounded-2xl border border-gold/40 bg-card shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl"
    >
      <div className="grid grid-cols-[130px_minmax(0,1fr)] gap-0 md:grid-cols-[200px_minmax(0,1fr)]">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <Image
            src={post.imageUrl}
            alt={post.name}
            fill
            sizes="200px"
            className="object-cover transition-transform group-hover:scale-105"
          />
          <DiscreetCover size="sm" />
          <Badge
            className={cn(
              "absolute left-2 top-2 gap-1 rounded-full px-1.5 py-0 text-[9px] font-semibold shadow",
              tier.className
            )}
          >
            {tier.label}
          </Badge>
        </div>

        <div className="relative flex flex-col justify-center gap-1.5 p-4 md:p-5">
          <div className="absolute right-3 top-3 flex items-center gap-1.5">
            <SponsoredTag />
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-gold px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-950 shadow">
              <Crown className="h-2.5 w-2.5" />
              Top del servicio
            </span>
          </div>

          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gold">
            {serviceMeta?.label ?? "Servicio"} · 24h en el primer lugar
          </p>
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-lg font-bold md:text-xl">
              {post.name}
            </h3>
            {post.verified && (
              <BadgeCheck className="h-4 w-4 shrink-0 fill-sky-500 text-white" />
            )}
          </div>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-0.5">
              <MapPin className="h-3 w-3" />
              {post.location}, {post.city}
            </span>
            {post.rating && (
              <span className="inline-flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {post.rating.toFixed(1)}
              </span>
            )}
            <span>· {post.age} años</span>
          </p>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm">
              <span className="font-bold text-primary">
                {formatCOP(post.pricePerHour)}
              </span>
              <span className="text-muted-foreground">/h</span>
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
              Ver perfil
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
