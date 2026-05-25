"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  Bell,
  Camera,
  Edit3,
  Eye,
  Heart,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Pencil,
  Phone,
  Plus,
  Repeat,
  Search,
  Settings,
  Share2,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trash2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreatePostDrawer } from "@/components/create-post-drawer";
import { DiscreetCover } from "@/components/discreet-cover";
import { LoginDialog } from "@/components/login-dialog";
import { PreferencesDialog } from "@/components/preferences-dialog";
import { TIER_STYLES } from "@/components/post-card";
import { useSession, type SessionUser, type UserRole } from "@/lib/session";
import { useFavorites } from "@/lib/favorites";
import { useUserPreferences, hasAnyPreference } from "@/lib/preferences";
import { useChat } from "@/lib/chat-context";
import { generatePosts, getPostById, type Post } from "@/lib/mock-posts";
import { formatCOP } from "@/lib/format";
import { cn } from "@/lib/utils";

export function AccountProfile() {
  const { user, isLoggedIn, switchRole, logout } = useSession();
  const { favorites, toggleFavorite } = useFavorites();
  const { prefs, save: savePrefs, clear: clearPrefs } = useUserPreferences();
  const { chats } = useChat();

  const [createOpen, setCreateOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);

  if (!isLoggedIn || !user) {
    return <LoggedOutState />;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <main className="mx-auto max-w-5xl px-4 pb-16 md:px-6">
        <ProfileHero
          user={user}
          onCreate={() => setCreateOpen(true)}
          onSwitchRole={switchRole}
        />

        {user.role === "provider" ? (
          <ProviderView
            user={user}
            onCreate={() => setCreateOpen(true)}
            onLogout={logout}
          />
        ) : (
          <ClientView
            chatsCount={chats.length}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onOpenPrefs={() => setPrefsOpen(true)}
            hasPrefs={hasAnyPreference(prefs)}
            user={user}
            onLogout={logout}
          />
        )}
      </main>

      <CreatePostDrawer open={createOpen} onOpenChange={setCreateOpen} />
      <PreferencesDialog
        open={prefsOpen}
        onOpenChange={setPrefsOpen}
        prefs={prefs}
        onSave={savePrefs}
        onClear={clearPrefs}
      />
    </div>
  );
}

/* -------------------- Top bar -------------------- */

function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 md:px-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2 gap-1.5">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Inicio
          </Link>
        </Button>
        <h1 className="text-sm font-bold tracking-tight">Mi cuenta</h1>
        <div className="ml-auto flex items-center gap-1">
          <Button asChild variant="ghost" size="icon" aria-label="Notificaciones">
            <Link href="#">
              <Bell className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Centro de chat">
            <Link href="/chat" target="_blank" rel="noopener">
              <MessageSquare className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

/* -------------------- Hero (shared) -------------------- */

function ProfileHero({
  user,
  onCreate,
  onSwitchRole,
}: {
  user: SessionUser;
  onCreate: () => void;
  onSwitchRole: () => void;
}) {
  const isProvider = user.role === "provider";

  return (
    <section className="relative mt-6 overflow-hidden rounded-2xl border bg-card">
      {/* Cover */}
      <div className="bg-gradient-sensual relative h-32 md:h-40">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -left-12 -bottom-8 h-32 w-32 rounded-full bg-gold/20 blur-3xl" />
        <button
          type="button"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
          aria-label="Cambiar portada"
        >
          <Camera className="h-3.5 w-3.5" />
        </button>
        <RoleBadge role={user.role} className="absolute left-3 top-3" />
      </div>

      {/* Avatar + info */}
      <div className="relative px-5 pb-5 pt-0">
        <div className="-mt-12 flex items-end justify-between gap-3">
          <div className="relative">
            <Avatar className="no-blur h-24 w-24 ring-4 ring-card md:h-28 md:w-28">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground hover:bg-primary/90"
              aria-label="Cambiar foto"
            >
              <Camera className="h-3 w-3" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Edit3 className="h-3.5 w-3.5" />
              Editar perfil
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Share2 className="h-3.5 w-3.5" />
              Compartir
            </Button>
            {isProvider ? (
              <Button
                variant="brand"
                size="sm"
                onClick={onCreate}
                className="gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Publicar
              </Button>
            ) : (
              <Button asChild variant="brand" size="sm" className="gap-1.5">
                <Link href="/">
                  <Search className="h-3.5 w-3.5" />
                  Buscar
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-1.5">
            <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
            <BadgeCheck className="h-5 w-5 fill-sky-500 text-white" />
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </span>
            <span className="inline-flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              {user.phone}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {user.city}
            </span>
          </p>
        </div>

        {/* Role switch */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/30 p-3">
          <div className="min-w-0 text-xs">
            <p className="font-semibold">
              {isProvider
                ? "¿También buscas servicios?"
                : "¿Quieres ofrecer servicios?"}
            </p>
            <p className="text-muted-foreground">
              {isProvider
                ? "Cambia a cuenta cliente para explorar perfiles."
                : "Conviértete en anunciante y publica tu perfil."}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onSwitchRole}
            className="gap-1.5"
          >
            <Repeat className="h-3.5 w-3.5" />
            Cambiar a {isProvider ? "cliente" : "anunciante"}
          </Button>
        </div>
      </div>
    </section>
  );
}

function RoleBadge({
  role,
  className,
}: {
  role: UserRole;
  className?: string;
}) {
  const isProvider = role === "provider";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-md backdrop-blur",
        isProvider
          ? "bg-gradient-gold text-amber-950"
          : "bg-white/15 text-white",
        className
      )}
    >
      {isProvider ? <Sparkles className="h-3 w-3" /> : <Heart className="h-3 w-3" />}
      {isProvider ? "Anunciante" : "Cliente"}
    </span>
  );
}

/* -------------------- Provider view -------------------- */

function ProviderView({
  user,
  onCreate,
  onLogout,
}: {
  user: SessionUser;
  onCreate: () => void;
  onLogout: () => void;
}) {
  return (
    <>
      <StatsRow
        stats={[
          {
            label: "Visitas a tus perfiles",
            value: "12.4k",
            icon: Eye,
            tone: "text-sky-400 bg-sky-500/10",
          },
          {
            label: "Favoritos recibidos",
            value: "843",
            icon: Heart,
            tone: "text-rose-400 bg-rose-500/10",
          },
          {
            label: "Contactos esta semana",
            value: "127",
            icon: MessageCircle,
            tone: "text-primary bg-primary/10",
          },
          {
            label: "Rating promedio",
            value: "4.8",
            icon: Star,
            tone: "text-gold bg-amber-500/10",
          },
        ]}
      />

      <Section
        icon={Sparkles}
        title="Mis publicaciones"
        subtitle="Perfiles que tienes activos en la plataforma"
        action={
          <Button
            variant="brand"
            size="sm"
            onClick={onCreate}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Nueva publicación
          </Button>
        }
      >
        <MyPosts onCreate={onCreate} />
      </Section>

      <Section
        icon={BarChart3}
        title="Estadísticas"
        subtitle="Cómo se desempeñan tus publicaciones esta semana"
      >
        <ProviderStats />
      </Section>

      <Section
        icon={Star}
        title="Reseñas recibidas"
        subtitle="Lo que opinan tus clientes"
      >
        <ProviderReviews />
      </Section>

      <Section
        icon={Settings}
        title="Configuración de cuenta"
        subtitle="Datos de contacto y notificaciones"
      >
        <AccountSettings user={user} onLogout={onLogout} />
      </Section>
    </>
  );
}

function ProviderStats() {
  const items = [
    { label: "Perfil con más visitas", value: "Sofía · 4.2k", trend: "+18%" },
    { label: "Mejor rating", value: "Valentina · 4.9 ★", trend: "+0.2" },
    { label: "Conversión chats", value: "31%", trend: "+5%" },
    { label: "Tiempo respuesta", value: "8 min", trend: "-2 min" },
  ];
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {items.map((s) => (
        <Card key={s.label} className="p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              {s.trend}
            </span>
          </div>
          <p className="mt-1 text-lg font-bold">{s.value}</p>
        </Card>
      ))}
    </div>
  );
}

function ProviderReviews() {
  const reviews = [
    { author: "Carlos M.", rating: 5, body: "Excelente experiencia, profesional y discreta.", date: "Hace 2 días" },
    { author: "Andrés P.", rating: 5, body: "Muy atenta, llegó puntual y el lugar muy cómodo.", date: "Hace 5 días" },
    { author: "Felipe R.", rating: 4, body: "Buena comunicación, volvería sin dudarlo.", date: "Hace 1 semana" },
  ];
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {reviews.map((r) => (
        <Card key={r.author} className="p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold">{r.author}</p>
            <span className="flex shrink-0 items-center gap-1 text-xs">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{r.rating}</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/80">{r.body}</p>
          <p className="mt-2 text-[10px] text-muted-foreground">{r.date}</p>
        </Card>
      ))}
    </div>
  );
}

/* -------------------- Client view -------------------- */

function ClientView({
  chatsCount,
  favorites,
  onToggleFavorite,
  onOpenPrefs,
  hasPrefs,
  user,
  onLogout,
}: {
  chatsCount: number;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onOpenPrefs: () => void;
  hasPrefs: boolean;
  user: SessionUser;
  onLogout: () => void;
}) {
  return (
    <>
      <StatsRow
        stats={[
          {
            label: "Perfiles visitados",
            value: "47",
            icon: Eye,
            tone: "text-sky-400 bg-sky-500/10",
          },
          {
            label: "Favoritos guardados",
            value: String(favorites.size),
            icon: Heart,
            tone: "text-rose-400 bg-rose-500/10",
          },
          {
            label: "Chats activos",
            value: String(chatsCount),
            icon: MessageCircle,
            tone: "text-primary bg-primary/10",
          },
          {
            label: "Reseñas dadas",
            value: "12",
            icon: Star,
            tone: "text-gold bg-amber-500/10",
          },
        ]}
      />

      <Section
        icon={Heart}
        title="Favoritos"
        subtitle="Perfiles que has guardado para volver más tarde"
        count={favorites.size}
      >
        <FavoritesGrid favorites={favorites} onToggle={onToggleFavorite} />
      </Section>

      <Section
        icon={Target}
        title="Mis preferencias"
        subtitle="Tus filtros guardados para personalizar recomendaciones"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenPrefs}
            className="gap-1.5"
          >
            <Pencil className="h-3.5 w-3.5" />
            Editar
          </Button>
        }
      >
        <PreferencesSummary
          hasPrefs={hasPrefs}
          onConfigure={onOpenPrefs}
        />
      </Section>

      <Section
        icon={MessageSquare}
        title="Mis conversaciones"
        subtitle="Continúa donde lo dejaste"
        action={
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href="/chat" target="_blank" rel="noopener">
              Abrir centro de chat
            </Link>
          </Button>
        }
      >
        <RecentChats />
      </Section>

      <Section
        icon={Settings}
        title="Configuración de cuenta"
        subtitle="Datos de contacto y notificaciones"
      >
        <AccountSettings user={user} onLogout={onLogout} />
      </Section>
    </>
  );
}

function RecentChats() {
  const { chats } = useChat();
  if (chats.length === 0) {
    return (
      <Card className="border-dashed p-6 text-center">
        <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          Aún no tienes conversaciones.
        </p>
        <Button asChild variant="outline" size="sm" className="mt-3">
          <Link href="/">Explorar perfiles</Link>
        </Button>
      </Card>
    );
  }
  return (
    <Card>
      <div className="divide-y">
        {chats.slice(0, 5).map((c) => {
          const last = c.messages[c.messages.length - 1];
          return (
            <Link
              key={c.peer.id}
              href={`/chat?peer=${encodeURIComponent(c.peer.id)}`}
              target="_blank"
              rel="noopener"
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent"
            >
              <div className="relative shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={c.peer.imageUrl} alt="" />
                  <AvatarFallback>{c.peer.name[0]}</AvatarFallback>
                </Avatar>
                {c.peer.isOnline && (
                  <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-card" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{c.peer.name}</p>
                {last && (
                  <p className="truncate text-xs text-muted-foreground">
                    {last.from === "me" ? "Tú: " : ""}
                    {last.text}
                  </p>
                )}
              </div>
              {c.unread > 0 && (
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                  {c.unread}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </Card>
  );
}

/* -------------------- Shared -------------------- */

function StatsRow({
  stats,
}: {
  stats: {
    label: string;
    value: string;
    icon: typeof Eye;
    tone: string;
  }[];
}) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label} className="p-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                s.tone
              )}
            >
              <s.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold">{s.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  subtitle,
  action,
  count,
  children,
}: {
  icon: typeof Eye;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <Icon className="h-5 w-5 text-primary" />
            {title}
            {count !== undefined && (
              <span className="ml-1 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                {count}
              </span>
            )}
          </h2>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function MyPosts({ onCreate }: { onCreate: () => void }) {
  const myPosts = useMemo<Post[]>(() => generatePosts(0, 2, "prepagos"), []);

  if (myPosts.length === 0) {
    return (
      <Card className="border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Aún no has publicado ningún perfil.
        </p>
        <Button variant="brand" size="sm" onClick={onCreate} className="mt-3 gap-1.5">
          <Plus className="h-4 w-4" />
          Crear publicación
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {myPosts.map((post) => (
        <MyPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function MyPostCard({ post }: { post: Post }) {
  const tier = TIER_STYLES[post.tier];

  return (
    <Card className="group relative flex overflow-hidden p-0">
      <Link
        href={`/profile/${encodeURIComponent(post.id)}`}
        className="relative h-32 w-28 shrink-0 overflow-hidden bg-muted"
        aria-label={`Ver ${post.name}`}
      >
        <Image
          src={post.imageUrl}
          alt={post.name}
          fill
          sizes="120px"
          className="object-cover transition-transform group-hover:scale-105"
        />
        <DiscreetCover size="xs" />
        <Badge
          className={cn(
            "absolute left-1.5 top-1.5 gap-1 rounded-full px-1.5 py-0 text-[9px] font-semibold shadow",
            tier.className
          )}
        >
          {tier.label}
        </Badge>
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{post.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {post.age} años · {post.location}
              </p>
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                post.isOnline
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {post.isOnline ? "Activa" : "Pausada"}
            </span>
          </div>
          <p className="mt-1 text-xs">
            <span className="font-semibold text-primary">
              {formatCOP(post.pricePerHour)}
            </span>
            <span className="text-muted-foreground">/h</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Button asChild variant="outline" size="sm" className="h-7 gap-1 text-[11px]">
            <Link href={`/profile/${encodeURIComponent(post.id)}`}>
              <Eye className="h-3 w-3" />
              Ver
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="h-7 gap-1 text-[11px]">
            <Edit3 className="h-3 w-3" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 text-[11px] text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3 w-3" />
            Eliminar
          </Button>
        </div>
      </div>
    </Card>
  );
}

function FavoritesGrid({
  favorites,
  onToggle,
}: {
  favorites: Set<string>;
  onToggle: (id: string) => void;
}) {
  const items = useMemo(() => {
    const ids = [...favorites];
    return ids
      .map((id) => getPostById(id))
      .filter((p): p is Post => p !== null);
  }, [favorites]);

  if (favorites.size === 0) {
    return (
      <Card className="border-dashed p-8 text-center">
        <Heart className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          Aún no has guardado ningún perfil.
        </p>
        <Button asChild variant="outline" size="sm" className="mt-3">
          <Link href="/">Explorar perfiles</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {items.map((post) => (
        <FavoriteCard key={post.id} post={post} onUnfavorite={() => onToggle(post.id)} />
      ))}
    </div>
  );
}

function FavoriteCard({
  post,
  onUnfavorite,
}: {
  post: Post;
  onUnfavorite: () => void;
}) {
  return (
    <Card className="group relative overflow-hidden p-0">
      <Link
        href={`/profile/${encodeURIComponent(post.id)}`}
        className="block"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <Image
            src={post.imageUrl}
            alt={post.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
          <DiscreetCover size="sm" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2 text-white">
            <p className="truncate text-xs font-semibold">{post.name}</p>
            <p className="text-[10px] opacity-90">
              {post.age} · {post.location}
            </p>
          </div>
        </div>
      </Link>
      <button
        type="button"
        onClick={onUnfavorite}
        aria-label="Quitar de favoritos"
        className="absolute right-1.5 top-1.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white hover:bg-rose-600"
      >
        <Heart className="h-3.5 w-3.5 fill-white" />
      </button>
    </Card>
  );
}

function PreferencesSummary({
  hasPrefs,
  onConfigure,
}: {
  hasPrefs: boolean;
  onConfigure: () => void;
}) {
  if (!hasPrefs) {
    return (
      <Card className="bg-gradient-sensual relative overflow-hidden border-primary/20 p-5">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex flex-wrap items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
            <Target className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold text-white">
              Configura tus preferencias
            </p>
            <p className="text-xs text-white/70">
              Te recomendaremos perfiles que se ajusten a lo que buscas.
            </p>
          </div>
          <Button variant="brand" size="sm" onClick={onConfigure}>
            Configurar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-5 w-5 text-primary" />
        <p className="text-sm font-medium">
          Tienes preferencias activas. Edita en cualquier momento desde aquí o
          desde el botón &quot;Mis preferencias&quot; en el feed.
        </p>
      </div>
    </Card>
  );
}

function AccountSettings({
  user,
  onLogout,
}: {
  user: SessionUser;
  onLogout: () => void;
}) {
  const rows: { label: string; value: string }[] = [
    { label: "Nombre", value: user.name },
    { label: "Correo", value: user.email },
    { label: "Teléfono / WhatsApp", value: user.phone },
    { label: "Ciudad", value: user.city },
  ];

  return (
    <Card>
      <div className="divide-y">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between gap-3 px-5 py-3"
          >
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {r.label}
              </p>
              <p className="truncate text-sm font-medium">{r.value}</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              <Pencil className="h-3.5 w-3.5" />
              Editar
            </Button>
          </div>
        ))}
      </div>
      <Separator />
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <p className="text-xs text-muted-foreground">
          ¿Quieres salir de tu cuenta?
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="gap-1.5 text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-3.5 w-3.5" />
          Cerrar sesión
        </Button>
      </div>
    </Card>
  );
}

/* -------------------- Logged-out -------------------- */

function LoggedOutState() {
  const [loginOpen, setLoginOpen] = useState(false);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="bg-gradient-sensual relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl">
        <Sparkles className="relative h-9 w-9 text-gold" />
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight">
        Inicia sesión para ver tu perfil
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Gestiona tus publicaciones, favoritos, preferencias y conversaciones
        desde un solo lugar.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button variant="brand" onClick={() => setLoginOpen(true)}>
          Iniciar sesión
        </Button>
        <Button asChild variant="outline">
          <Link href="/signup">Crear cuenta</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}
