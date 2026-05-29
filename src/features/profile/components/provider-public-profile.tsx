"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  Calendar,
  Eye,
  Flag,
  Globe,
  Heart,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Share2,
  Sparkles,
  Star,
  Timer,
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
import { ExclusiveContent } from "@/features/posts/components/exclusive-content";
import { Header } from "@/features/layout/components/header";
import { TIER_STYLES } from "@/features/posts/components/post-card";
import { generatePosts, type Post } from "@/features/posts/data/mock-posts";
import { services } from "@/features/posts/data/services";
import { useChat } from "@/features/chat/chat-context";
import { useFavorites } from "@/features/favorites/use-favorites";
import { formatCOP } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";

const LANGUAGE_LABEL: Record<string, string> = {
  es: "Español",
  en: "Inglés",
  pt: "Portugués",
  fr: "Francés",
  it: "Italiano",
};

const REVIEWS = [
  {
    id: "r1",
    author: "Carlos M.",
    avatar: "https://i.pravatar.cc/80?img=12",
    initials: "CM",
    verified: true,
    rating: 5,
    body: "Excelente experiencia, profesional y discreta. Volveré sin duda.",
    date: "Hace 2 días",
  },
  {
    id: "r2",
    author: "Andrés P.",
    avatar: "https://i.pravatar.cc/80?img=33",
    initials: "AP",
    verified: true,
    rating: 5,
    body: "Muy atenta y simpática. La comunicación previa fue rápida y clara.",
    date: "Hace 5 días",
  },
  {
    id: "r3",
    author: "Felipe R.",
    initials: "FR",
    verified: false,
    rating: 4,
    body: "Buena comunicación, llegó a tiempo. Recomendada.",
    date: "Hace 1 semana",
  },
  {
    id: "r4",
    author: "Juan David L.",
    avatar: "https://i.pravatar.cc/80?img=8",
    initials: "JL",
    verified: true,
    rating: 5,
    body: "Súper recomendada. Llegó a la hora y muy amable. Repetiría.",
    date: "Hace 10 días",
  },
];

type Tab = "overview" | "posts" | "content" | "reviews";

interface ProviderPublicProfileProps {
  post: Post;
}

export function ProviderPublicProfile({ post }: ProviderPublicProfileProps) {
  const [tab, setTab] = useState<Tab>("overview");
  const { openChat } = useChat();
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.has(post.id);

  const tier = TIER_STYLES[post.tier];
  const service = services.find((s) => s.key === post.service);

  // Generate provider's other publications (same service + city). Place the
  // current one first so the navigation feels anchored.
  const otherPosts = useMemo(() => {
    const generated = generatePosts(0, 6, post.service, post.city);
    return [post, ...generated.filter((p) => p.id !== post.id)].slice(0, 5);
  }, [post]);

  const memberSinceLabel = useMemo(() => {
    const m = post.memberSinceMonths;
    if (m < 12) return `${m} ${m === 1 ? "mes" : "meses"}`;
    const y = Math.floor(m / 12);
    return `${y} ${y === 1 ? "año" : "años"}`;
  }, [post.memberSinceMonths]);

  const startChat = () =>
    openChat({
      id: post.id,
      name: post.name,
      imageUrl: post.imageUrl,
      isOnline: post.isOnline,
    });

  const tabs: { id: Tab; label: string; icon: typeof Eye }[] = [
    { id: "overview", label: "Resumen", icon: BarChart3 },
    { id: "posts", label: "Publicaciones", icon: Sparkles },
    { id: "content", label: "Contenido exclusivo", icon: Lock },
    { id: "reviews", label: "Reseñas", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header favoritesCount={favorites.size} />

      {/* Cover */}
      <CoverSection post={post} />

      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="mb-4 -mt-12 flex justify-start md:-mt-16">
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href={`/post/${encodeURIComponent(post.id)}`}>
              <ArrowLeft className="h-3.5 w-3.5" />
              Volver a la publicación
            </Link>
          </Button>
        </div>

        <ProfileHeader
          post={post}
          isFavorite={isFavorite}
          onFavorite={() => toggleFavorite(post.id)}
          onChat={startChat}
        />

        <ProfileTabs tabs={tabs} active={tab} onChange={setTab} />

        <div className="grid gap-6 pb-16 lg:grid-cols-[320px_minmax(0,1fr)]">
          <ProfileSidebar
            post={post}
            memberSinceLabel={memberSinceLabel}
            service={service?.label ?? null}
          />

          <div className="min-w-0">
            {tab === "overview" && (
              <OverviewPanel
                post={post}
                otherPosts={otherPosts}
                onGoTab={setTab}
              />
            )}
            {tab === "posts" && (
              <SectionPanel
                title="Todas las publicaciones"
                subtitle={`${otherPosts.length} perfiles activos del anunciante`}
              >
                <PostsGrid posts={otherPosts} highlightId={post.id} />
              </SectionPanel>
            )}
            {tab === "content" && (
              <SectionPanel
                title="Contenido exclusivo"
                subtitle="Vault privado · suscríbete o desbloquea individual"
              >
                <ExclusiveContent post={post} />
              </SectionPanel>
            )}
            {tab === "reviews" && (
              <SectionPanel
                title="Reseñas"
                subtitle={`${REVIEWS.length} clientes opinaron sobre ${post.name}`}
              >
                <ReviewsList />
              </SectionPanel>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Cover -------------------- */

function CoverSection({ post }: { post: Post }) {
  return (
    <div className="relative h-48 w-full overflow-hidden md:h-72">
      <Image
        src={post.imageUrl}
        alt=""
        fill
        sizes="100vw"
        priority
        className="no-blur scale-105 object-cover blur-md brightness-75"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -left-20 -bottom-12 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
    </div>
  );
}

/* -------------------- Header -------------------- */

function ProfileHeader({
  post,
  isFavorite,
  onFavorite,
  onChat,
}: {
  post: Post;
  isFavorite: boolean;
  onFavorite: () => void;
  onChat: () => void;
}) {
  const tier = TIER_STYLES[post.tier];
  return (
    <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-end">
        <div className="relative">
          <Avatar className="no-blur h-28 w-28 ring-4 ring-background md:h-36 md:w-36">
            <AvatarImage src={post.imageUrl} alt={post.name} />
            <AvatarFallback className="text-3xl">{post.name[0]}</AvatarFallback>
          </Avatar>
          {post.isOnline && (
            <span className="absolute bottom-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-background" />
          )}
        </div>

        <div className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {post.name}
            </h1>
            {post.verified && (
              <BadgeCheck className="h-6 w-6 fill-sky-500 text-white" />
            )}
            <Badge
              className={cn(
                "gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow",
                tier.className
              )}
            >
              {tier.label}
            </Badge>
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {post.age} años
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {post.location}, {post.city}
            </span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {post.rating?.toFixed(1) ?? "—"} ({post.reviewsCount})
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onFavorite}
          className={cn("gap-1.5", isFavorite && "text-rose-500")}
        >
          <Heart className={cn("h-3.5 w-3.5", isFavorite && "fill-rose-500")} />
          {isFavorite ? "Guardado" : "Guardar"}
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Share2 className="h-3.5 w-3.5" />
          Compartir
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Flag className="h-3.5 w-3.5" />
          Reportar
        </Button>
        {post.isOnline && (
          <Button
            variant="brand"
            size="sm"
            onClick={onChat}
            className="gap-1.5"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Chat
          </Button>
        )}
      </div>
    </div>
  );
}

/* -------------------- Tabs -------------------- */

function ProfileTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: Tab; label: string; icon: typeof Eye }[];
  active: Tab;
  onChange: (t: Tab) => void;
}) {
  return (
    <div className="sticky top-16 z-20 -mx-4 mt-6 border-b bg-background/95 px-4 backdrop-blur md:-mx-6 md:px-6">
      <div className="flex overflow-x-auto">
        {tabs.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={cn(
                "relative inline-flex shrink-0 items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
              {isActive && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------- Sidebar -------------------- */

function ProfileSidebar({
  post,
  memberSinceLabel,
  service,
}: {
  post: Post;
  memberSinceLabel: string;
  service: string | null;
}) {
  return (
    <aside className="mt-6 flex flex-col gap-4 lg:sticky lg:top-32 lg:self-start">
      <Card className="p-5">
        <h3 className="text-sm font-bold">Sobre el anunciante</h3>
        <div className="mt-3 space-y-2.5 text-sm">
          <InfoRow icon={MapPin} label="Ciudad" value={post.city} />
          <InfoRow icon={Calendar} label="Edad" value={`${post.age} años`} />
          {service && <InfoRow icon={Sparkles} label="Servicio" value={service} />}
          <InfoRow
            icon={Globe}
            label="Idiomas"
            value={post.languages
              .map((l) => LANGUAGE_LABEL[l] ?? l)
              .join(", ")}
          />
          <InfoRow icon={Timer} label="En flitrhub" value={memberSinceLabel} />
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-bold">Estadísticas</h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <MiniStat
            icon={Eye}
            label="Visitas"
            value={post.viewsCount.toLocaleString("es-CO")}
            tone="text-sky-400"
          />
          <MiniStat
            icon={Star}
            label="Rating"
            value={post.rating?.toFixed(1) ?? "—"}
            tone="text-gold"
          />
          <MiniStat
            icon={Timer}
            label="Respuesta"
            value={`${post.responseTimeMins} min`}
            tone="text-emerald-400"
          />
          <MiniStat
            icon={MessageCircle}
            label="Reseñas"
            value={String(post.reviewsCount)}
            tone="text-primary"
          />
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-bold">Contacto directo</h3>
        <div className="mt-3 space-y-2">
          <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
          <Button variant="outline" className="w-full gap-2">
            <Phone className="h-4 w-4" />
            Llamar
          </Button>
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">
          Tiempo medio de respuesta: {post.responseTimeMins} min
        </p>
      </Card>
    </aside>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function MiniStat({
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
    <div className="rounded-lg border bg-background p-2.5">
      <div className="flex items-center gap-1.5">
        <Icon className={cn("h-3.5 w-3.5", tone)} />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="mt-1 text-base font-bold">{value}</p>
    </div>
  );
}

/* -------------------- Section wrapper -------------------- */

function SectionPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}

/* -------------------- Overview panel -------------------- */

function OverviewPanel({
  post,
  otherPosts,
  onGoTab,
}: {
  post: Post;
  otherPosts: Post[];
  onGoTab: (t: Tab) => void;
}) {
  return (
    <div className="mt-6 space-y-6">
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Sobre {post.name}
        </h2>
        <p className="mt-2 leading-relaxed text-foreground/90">
          {post.description}
        </p>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <h2 className="flex items-center gap-2 text-base font-bold tracking-tight">
            <Sparkles className="h-4 w-4 text-primary" />
            Sus publicaciones
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onGoTab("posts")}
            className="text-xs"
          >
            Ver todas ({otherPosts.length})
          </Button>
        </div>
        <PostsGrid posts={otherPosts.slice(0, 3)} highlightId={post.id} />
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <h2 className="flex items-center gap-2 text-base font-bold tracking-tight">
            <Lock className="h-4 w-4 text-primary" />
            Contenido exclusivo
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onGoTab("content")}
            className="text-xs"
          >
            Ver vault completo
          </Button>
        </div>
        <Card className="bg-gradient-sensual relative overflow-hidden border-primary/30 p-5">
          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative flex flex-wrap items-center gap-4">
            <div className="bg-gradient-gold flex h-11 w-11 items-center justify-center rounded-xl text-amber-950 shadow">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white">
                Vault privado disponible
              </p>
              <p className="text-xs text-white/70">
                Suscríbete o compra contenido individual. Fotos, videos y más.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => onGoTab("content")}
              className="bg-gradient-gold border-0 font-semibold text-amber-950 hover:opacity-90"
            >
              Acceder
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}

/* -------------------- Posts grid -------------------- */

function PostsGrid({
  posts,
  highlightId,
}: {
  posts: Post[];
  highlightId?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {posts.map((p) => (
        <PostMiniCard
          key={p.id}
          post={p}
          isCurrent={p.id === highlightId}
        />
      ))}
    </div>
  );
}

function PostMiniCard({
  post,
  isCurrent,
}: {
  post: Post;
  isCurrent: boolean;
}) {
  const tier = TIER_STYLES[post.tier];
  return (
    <Link
      href={`/post/${encodeURIComponent(post.id)}`}
      className={cn(
        "group block overflow-hidden rounded-xl border bg-card",
        isCurrent && "ring-2 ring-primary"
      )}
    >
      <div className="relative aspect-[3/4] w-full bg-muted">
        <Image
          src={post.imageUrl}
          alt={post.name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
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
        {isCurrent && (
          <span className="absolute right-2 top-2 inline-flex items-center gap-0.5 rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-foreground shadow">
            Aquí
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2 text-white">
          <p className="truncate text-xs font-semibold">{post.name}</p>
          <p className="text-[10px] opacity-90">
            {post.location} · {formatCOP(post.pricePerHour)}/h
          </p>
        </div>
      </div>
    </Link>
  );
}

/* -------------------- Reviews list -------------------- */

function ReviewsList() {
  return (
    <div className="space-y-3">
      {REVIEWS.map((r) => (
        <Card key={r.id} className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 shrink-0">
              {r.avatar && <AvatarImage src={r.avatar} alt="" />}
              <AvatarFallback className="text-xs font-semibold">
                {r.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <p className="text-sm font-semibold">{r.author}</p>
                {r.verified && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-sky-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-400">
                    Verificado
                  </span>
                )}
                <span className="text-[11px] text-muted-foreground">
                  · {r.date}
                </span>
              </div>
              <div className="mt-1 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3",
                      i < r.rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted-foreground/40"
                    )}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                {r.body}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
