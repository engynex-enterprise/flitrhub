"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Bell,
  Camera,
  Edit3,
  Eye,
  Heart,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Pencil,
  Phone,
  Plus,
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
import { PreferencesDialog } from "@/components/preferences-dialog";
import { TIER_STYLES } from "@/components/post-card";
import { useSession } from "@/lib/session";
import { useFavorites } from "@/lib/favorites";
import { useUserPreferences, hasAnyPreference } from "@/lib/preferences";
import { useChat } from "@/lib/chat-context";
import { generatePosts, getPostById, type Post } from "@/lib/mock-posts";
import { services } from "@/lib/services";
import { formatCOP } from "@/lib/format";
import { cn } from "@/lib/utils";

export function AccountProfile() {
  const { user, isLoggedIn, login, logout } = useSession();
  const { favorites, toggleFavorite } = useFavorites();
  const { prefs, save: savePrefs, clear: clearPrefs } = useUserPreferences();
  const { chats } = useChat();

  const [createOpen, setCreateOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);

  if (!isLoggedIn || !user) {
    return <LoggedOutState onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-5xl px-4 pb-16 md:px-6">
        <ProfileHero user={user} onCreate={() => setCreateOpen(true)} />

        <StatsRow chatsCount={chats.length} favoritesCount={favorites.size} />

        <Section
          icon={Sparkles}
          title="Mis publicaciones"
          subtitle="Perfiles que has publicado en la plataforma"
          action={
            <Button
              variant="brand"
              size="sm"
              onClick={() => setCreateOpen(true)}
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Nueva publicación
            </Button>
          }
        >
          <MyPosts onCreate={() => setCreateOpen(true)} />
        </Section>

        <Section
          icon={Heart}
          title="Favoritos"
          subtitle="Perfiles que has guardado"
          count={favorites.size}
        >
          <FavoritesGrid favorites={favorites} onToggle={toggleFavorite} />
        </Section>

        <Section
          icon={Target}
          title="Mis preferencias"
          subtitle="Tus filtros guardados para recomendaciones"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPrefsOpen(true)}
              className="gap-1.5"
            >
              <Pencil className="h-3.5 w-3.5" />
              Editar
            </Button>
          }
        >
          <PreferencesSummary
            hasPrefs={hasAnyPreference(prefs)}
            onConfigure={() => setPrefsOpen(true)}
          />
        </Section>

        <Section
          icon={Settings}
          title="Configuración de cuenta"
          subtitle="Datos de contacto y notificaciones"
        >
          <AccountSettings user={user} onLogout={logout} />
        </Section>
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

/* -------------------- Header -------------------- */

function Header() {
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

/* -------------------- Hero -------------------- */

function ProfileHero({
  user,
  onCreate,
}: {
  user: { name: string; email: string; phone: string; city: string; age: number; avatar: string };
  onCreate: () => void;
}) {
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
      </div>

      {/* Avatar + info */}
      <div className="relative px-5 pb-5 pt-0">
        <div className="-mt-12 flex items-end justify-between gap-3">
          <div className="relative">
            <Avatar className="h-24 w-24 ring-4 ring-card md:h-28 md:w-28">
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
            <Button
              variant="brand"
              size="sm"
              onClick={onCreate}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Publicar
            </Button>
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
      </div>
    </section>
  );
}

/* -------------------- Stats -------------------- */

function StatsRow({
  chatsCount,
  favoritesCount,
}: {
  chatsCount: number;
  favoritesCount: number;
}) {
  const stats: { label: string; value: string; icon: typeof Eye; tone: string }[] = [
    {
      label: "Visitas al perfil",
      value: "1.245",
      icon: Eye,
      tone: "text-sky-400 bg-sky-500/10",
    },
    {
      label: "Favoritos guardados",
      value: String(favoritesCount),
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
      label: "Rating promedio",
      value: "4.8",
      icon: Star,
      tone: "text-gold bg-amber-500/10",
    },
  ];

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

/* -------------------- Section wrapper -------------------- */

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

/* -------------------- My posts -------------------- */

function MyPosts({ onCreate }: { onCreate: () => void }) {
  // Mock: 2 sample listings owned by the logged-in user.
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

/* -------------------- Favorites -------------------- */

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

/* -------------------- Preferences summary -------------------- */

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
          desde el botón "Mis preferencias" en el feed.
        </p>
      </div>
    </Card>
  );
}

/* -------------------- Account settings -------------------- */

function AccountSettings({
  user,
  onLogout,
}: {
  user: { name: string; email: string; phone: string; city: string };
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

/* -------------------- Logged-out state -------------------- */

function LoggedOutState({ onLogin }: { onLogin: () => void }) {
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
      <div className="mt-6 flex gap-2">
        <Button variant="brand" onClick={onLogin}>
          <LogIn className="h-4 w-4" />
          Iniciar sesión
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
