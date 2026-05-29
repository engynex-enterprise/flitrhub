"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  BarChart3,
  Camera,
  Edit3,
  Eye,
  Heart,
  Info,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Pencil,
  Phone,
  Plus,
  Repeat,
  Search,
  Share2,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trash2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Header } from "@/features/layout/components/header";
import { CreatePostDrawer } from "@/features/posts/components/create-post-drawer";
import { DiscreetCover } from "@/features/posts/components/discreet-cover";
import { LoginDialog } from "@/features/auth/components/login-dialog";
import { EditProfileDialog } from "@/features/profile/components/edit-profile-dialog";
import { ProviderStats } from "@/features/profile/components/provider-stats";
import { PreferencesDialog } from "@/features/posts/components/preferences-dialog";
import { TIER_STYLES } from "@/features/posts/components/post-card";
import { useSession, type SessionUser, type UserRole } from "@/features/auth/session";
import { useFavorites } from "@/features/favorites/use-favorites";
import { useUserPreferences, hasAnyPreference } from "@/features/posts/preferences";
import { useChat } from "@/features/chat/chat-context";
import { generatePosts, getPostById, type Post } from "@/features/posts/data/mock-posts";
import { formatCOP } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";

type TabId =
  | "overview"
  | "posts"
  | "reviews"
  | "favorites"
  | "chats"
  | "preferences";

export function AccountProfile() {
  const { user, isLoggedIn, switchRole } = useSession();
  const { favorites, toggleFavorite } = useFavorites();
  const { prefs, save: savePrefs, clear: clearPrefs } = useUserPreferences();
  const { chats } = useChat();

  const [createOpen, setCreateOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [tab, setTab] = useState<TabId>("overview");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Revoke object URLs on unmount / replacement to avoid leaks.
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [avatarPreview, coverPreview]);

  const handlePickImage = (
    file: File | null,
    setter: (url: string | null) => void,
    current: string | null
  ) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (current) URL.revokeObjectURL(current);
    setter(URL.createObjectURL(file));
  };

  if (!isLoggedIn || !user) {
    return <LoggedOutState />;
  }

  const isProvider = user.role === "provider";

  const tabs: { id: TabId; label: string; icon: typeof Eye }[] = isProvider
    ? [
        { id: "overview", label: "Resumen", icon: BarChart3 },
        { id: "posts", label: "Publicaciones", icon: Sparkles },
        { id: "reviews", label: "Reseñas", icon: Star },
      ]
    : [
        { id: "overview", label: "Resumen", icon: BarChart3 },
        { id: "favorites", label: "Favoritos", icon: Heart },
        { id: "chats", label: "Conversaciones", icon: MessageSquare },
        { id: "preferences", label: "Preferencias", icon: Target },
      ];

  return (
    <div className="min-h-screen bg-background">
      <Header
        favoritesCount={favorites.size}
        onCreatePost={isProvider ? () => setCreateOpen(true) : undefined}
      />

      {/* Full-bleed cover */}
      <CoverSection
        role={user.role}
        coverUrl={coverPreview}
        onPickCover={(file) =>
          handlePickImage(file, setCoverPreview, coverPreview)
        }
      />

      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <ProfileHeader
          user={user}
          isProvider={isProvider}
          onCreate={() => setCreateOpen(true)}
          onEdit={() => setEditOpen(true)}
          avatarUrl={avatarPreview ?? user.avatar}
          onPickAvatar={(file) =>
            handlePickImage(file, setAvatarPreview, avatarPreview)
          }
        />

        <ProfileTabs tabs={tabs} active={tab} onChange={setTab} />

        <div className="grid gap-6 pb-16 lg:grid-cols-[320px_minmax(0,1fr)]">
          <ProfileSidebar
            user={user}
            isProvider={isProvider}
            favoritesCount={favorites.size}
            chatsCount={chats.length}
            onSwitchRole={switchRole}
          />

          <div className="min-w-0">
            {tab === "overview" && (
              <OverviewTab
                user={user}
                isProvider={isProvider}
                chatsCount={chats.length}
                favoritesCount={favorites.size}
                onCreate={() => setCreateOpen(true)}
                onOpenPrefs={() => setPrefsOpen(true)}
                onGoTab={setTab}
              />
            )}

            {tab === "posts" && (
              <TabPanel
                title="Mis publicaciones"
                subtitle="Perfiles que tienes activos en la plataforma"
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
              </TabPanel>
            )}

            {tab === "reviews" && (
              <TabPanel
                title="Reseñas recibidas"
                subtitle="Lo que opinan tus clientes"
              >
                <ProviderReviews />
              </TabPanel>
            )}

            {tab === "favorites" && (
              <TabPanel
                title="Favoritos"
                subtitle="Perfiles que has guardado para volver más tarde"
                count={favorites.size}
              >
                <FavoritesGrid favorites={favorites} onToggle={toggleFavorite} />
              </TabPanel>
            )}

            {tab === "chats" && (
              <TabPanel
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
              </TabPanel>
            )}

            {tab === "preferences" && (
              <TabPanel
                title="Mis preferencias"
                subtitle="Tus filtros guardados para personalizar recomendaciones"
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
              </TabPanel>
            )}

          </div>
        </div>
      </div>

      <CreatePostDrawer open={createOpen} onOpenChange={setCreateOpen} />
      <PreferencesDialog
        open={prefsOpen}
        onOpenChange={setPrefsOpen}
        prefs={prefs}
        onSave={savePrefs}
        onClear={clearPrefs}
      />
      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
}

/* -------------------- Cover (full bleed) -------------------- */

function CoverSection({
  role,
  coverUrl,
  onPickCover,
}: {
  role: UserRole;
  coverUrl: string | null;
  onPickCover: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-gradient-sensual relative h-44 w-full overflow-hidden md:h-64">
      {coverUrl ? (
        <img
          src={coverUrl}
          alt="Portada"
          className="no-blur absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -left-20 -bottom-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />

      <div className="relative mx-auto flex h-full max-w-6xl items-start justify-between px-4 pt-4 md:px-6">
        <RoleBadge role={role} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-black/60"
          aria-label="Cambiar portada"
        >
          <Camera className="h-3.5 w-3.5" />
          {coverUrl ? "Cambiar portada" : "Editar portada"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            onPickCover(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

/* -------------------- Profile header -------------------- */

function ProfileHeader({
  user,
  isProvider,
  onCreate,
  onEdit,
  avatarUrl,
  onPickAvatar,
}: {
  user: SessionUser;
  isProvider: boolean;
  onCreate: () => void;
  onEdit: () => void;
  avatarUrl: string;
  onPickAvatar: (file: File | null) => void;
}) {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative -mt-16 flex flex-col gap-4 md:-mt-20 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-end">
        <div className="relative">
          <Avatar className="no-blur h-32 w-32 ring-4 ring-background md:h-40 md:w-40">
            <AvatarImage src={avatarUrl} alt={user.name} />
            <AvatarFallback className="text-3xl">{user.name[0]}</AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground hover:bg-primary/90"
            aria-label="Cambiar foto"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              onPickAvatar(e.target.files?.[0] ?? null);
              e.target.value = "";
            }}
          />
        </div>

        <div className="pb-2">
          <div className="flex items-center gap-1.5">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              {user.name}
            </h2>
            <BadgeCheck className="h-6 w-6 fill-sky-500 text-white" />
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {user.city}
            </span>
            <span className="inline-flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="gap-1.5"
        >
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
              Buscar perfiles
            </Link>
          </Button>
        )}
      </div>
    </div>
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

/* -------------------- Tabs -------------------- */

function ProfileTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: TabId; label: string; icon: typeof Eye }[];
  active: TabId;
  onChange: (t: TabId) => void;
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
  user,
  isProvider,
  favoritesCount,
  chatsCount,
  onSwitchRole,
}: {
  user: SessionUser;
  isProvider: boolean;
  favoritesCount: number;
  chatsCount: number;
  onSwitchRole: () => void;
}) {
  return (
    <aside className="mt-6 flex flex-col gap-4 lg:sticky lg:top-32 lg:self-start">
      <Card className="p-5">
        <h3 className="flex items-center gap-2 text-sm font-bold">
          <Info className="h-4 w-4 text-primary" />
          Sobre mí
        </h3>
        <div className="mt-3 space-y-2.5 text-sm">
          <InfoRow icon={Mail} label="Correo" value={user.email} />
          <InfoRow icon={Phone} label="Teléfono" value={user.phone} />
          <InfoRow icon={MapPin} label="Ciudad" value={user.city} />
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-bold">
          {isProvider ? "Tu actividad" : "Tu cuenta"}
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {isProvider ? (
            <>
              <MiniStat icon={Eye} label="Visitas" value="12.4k" tone="text-sky-400" />
              <MiniStat icon={Heart} label="Favs" value="843" tone="text-rose-400" />
              <MiniStat
                icon={MessageCircle}
                label="Contactos"
                value="127"
                tone="text-primary"
              />
              <MiniStat icon={Star} label="Rating" value="4.8" tone="text-gold" />
            </>
          ) : (
            <>
              <MiniStat icon={Eye} label="Visitados" value="47" tone="text-sky-400" />
              <MiniStat
                icon={Heart}
                label="Favoritos"
                value={String(favoritesCount)}
                tone="text-rose-400"
              />
              <MiniStat
                icon={MessageCircle}
                label="Chats"
                value={String(chatsCount)}
                tone="text-primary"
              />
              <MiniStat icon={Star} label="Reseñas" value="12" tone="text-gold" />
            </>
          )}
        </div>
      </Card>

      <Card className="bg-muted/30 p-5">
        <p className="text-sm font-semibold">
          {isProvider
            ? "¿También buscas servicios?"
            : "¿Quieres ofrecer servicios?"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {isProvider
            ? "Cambia a cuenta cliente para explorar perfiles."
            : "Conviértete en anunciante y publica tu perfil."}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onSwitchRole}
          className="mt-3 w-full gap-1.5"
        >
          <Repeat className="h-3.5 w-3.5" />
          Cambiar a {isProvider ? "cliente" : "anunciante"}
        </Button>
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

/* -------------------- Tab panel -------------------- */

function TabPanel({
  title,
  subtitle,
  action,
  count,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
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

/* -------------------- Overview -------------------- */

function OverviewTab({
  user,
  isProvider,
  chatsCount,
  favoritesCount,
  onCreate,
  onOpenPrefs,
  onGoTab,
}: {
  user: SessionUser;
  isProvider: boolean;
  chatsCount: number;
  favoritesCount: number;
  onCreate: () => void;
  onOpenPrefs: () => void;
  onGoTab: (t: TabId) => void;
}) {
  return (
    <div className="mt-6 space-y-6">
      <StatsRow
        stats={
          isProvider
            ? [
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
              ]
            : [
                {
                  label: "Perfiles visitados",
                  value: "47",
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
                  label: "Reseñas dadas",
                  value: "12",
                  icon: Star,
                  tone: "text-gold bg-amber-500/10",
                },
              ]
        }
      />

      {isProvider ? (
        <>
          <OverviewSection
            title="Estadísticas"
            subtitle="Cómo se desempeñan tus publicaciones esta semana"
            icon={BarChart3}
          >
            <ProviderStats />
          </OverviewSection>

          <OverviewSection
            title="Publicaciones recientes"
            icon={Sparkles}
            onSeeAll={() => onGoTab("posts")}
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
          </OverviewSection>
        </>
      ) : (
        <>
          <OverviewSection
            title="Continúa tus chats"
            icon={MessageSquare}
            onSeeAll={() => onGoTab("chats")}
          >
            <RecentChats />
          </OverviewSection>

          <OverviewSection
            title="Tus preferencias"
            icon={Target}
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
            <PreferencesSummary hasPrefs={false} onConfigure={onOpenPrefs} />
          </OverviewSection>
        </>
      )}
    </div>
  );
}

function OverviewSection({
  title,
  subtitle,
  icon: Icon,
  action,
  onSeeAll,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: typeof Eye;
  action?: React.ReactNode;
  onSeeAll?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold tracking-tight">
            <Icon className="h-4 w-4 text-primary" />
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {action}
          {onSeeAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSeeAll}
              className="text-xs"
            >
              Ver todo
            </Button>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

/* -------------------- Provider sections -------------------- */

function ProviderReviews() {
  const reviews = [
    { author: "Carlos M.", rating: 5, body: "Excelente experiencia, profesional y discreta.", date: "Hace 2 días" },
    { author: "Andrés P.", rating: 5, body: "Muy atenta, llegó puntual y el lugar muy cómodo.", date: "Hace 5 días" },
    { author: "Felipe R.", rating: 4, body: "Buena comunicación, volvería sin dudarlo.", date: "Hace 1 semana" },
  ];
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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

/* -------------------- Client sections -------------------- */

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
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
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
        href={`/post/${encodeURIComponent(post.id)}`}
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
            <Link href={`/post/${encodeURIComponent(post.id)}`}>
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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4">
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
        href={`/post/${encodeURIComponent(post.id)}`}
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
