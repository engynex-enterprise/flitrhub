"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronRight,
  EyeOff,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Repeat,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  User as UserIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Switch } from "@/shared/components/ui/switch";
import { Header } from "@/features/layout/components/header";
import { LoginDialog } from "@/features/auth/components/login-dialog";
import { useSession } from "@/features/auth/session";
import { useDiscreet } from "@/features/discreet/use-discreet";
import { cn } from "@/shared/lib/utils";

type SectionId =
  | "account"
  | "security"
  | "notifications"
  | "privacy"
  | "danger";

const SECTIONS: {
  id: SectionId;
  label: string;
  description: string;
  icon: typeof UserIcon;
}[] = [
  {
    id: "account",
    label: "Cuenta",
    description: "Información personal y de contacto",
    icon: UserIcon,
  },
  {
    id: "security",
    label: "Seguridad",
    description: "Contraseña y sesiones activas",
    icon: Lock,
  },
  {
    id: "notifications",
    label: "Notificaciones",
    description: "Cómo y cuándo te avisamos",
    icon: Bell,
  },
  {
    id: "privacy",
    label: "Privacidad",
    description: "Modo discreto y visibilidad",
    icon: ShieldCheck,
  },
  {
    id: "danger",
    label: "Zona de peligro",
    description: "Eliminar cuenta",
    icon: ShieldAlert,
  },
];

export function SettingsPage() {
  const { user, isLoggedIn } = useSession();
  const [section, setSection] = useState<SectionId>("account");

  if (!isLoggedIn || !user) {
    return <LoggedOutSettings />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona tu cuenta, privacidad y notificaciones.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <SettingsNav
            active={section}
            onChange={setSection}
            userName={user.name}
            userEmail={user.email}
            userAvatar={user.avatar}
          />

          <div className="min-w-0">
            {section === "account" && <AccountSection />}
            {section === "security" && <SecuritySection />}
            {section === "notifications" && <NotificationsSection />}
            {section === "privacy" && <PrivacySection />}
            {section === "danger" && <DangerSection />}
          </div>
        </div>
      </main>
    </div>
  );
}

/* -------------------- Side nav -------------------- */

function SettingsNav({
  active,
  onChange,
  userName,
  userEmail,
  userAvatar,
}: {
  active: SectionId;
  onChange: (s: SectionId) => void;
  userName: string;
  userEmail: string;
  userAvatar?: string;
}) {
  return (
    <aside className="flex flex-col gap-3 lg:sticky lg:top-20 lg:self-start">
      <Card className="overflow-hidden p-0">
        <div className="bg-gradient-sensual relative flex items-center gap-3 px-4 py-4">
          <Avatar className="no-blur h-11 w-11 ring-2 ring-white/30">
            <AvatarImage src={userAvatar} alt="" />
            <AvatarFallback>{userName[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{userName}</p>
            <p className="truncate text-xs text-white/70">{userEmail}</p>
          </div>
        </div>
        <Separator />
        <nav className="flex flex-col p-1.5">
          {SECTIONS.map((s) => {
            const isActive = s.id === active;
            const isDanger = s.id === "danger";
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onChange(s.id)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
                  isActive
                    ? isDanger
                      ? "bg-destructive/10 text-destructive"
                      : "bg-primary/10 text-foreground"
                    : "hover:bg-accent"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md",
                    isActive
                      ? isDanger
                        ? "bg-destructive/15 text-destructive"
                        : "bg-primary/15 text-primary"
                      : "bg-muted text-foreground"
                  )}
                >
                  <s.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-sm font-semibold",
                      isDanger && !isActive && "text-destructive"
                    )}
                  >
                    {s.label}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {s.description}
                  </p>
                </div>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-opacity",
                    isActive ? "opacity-100" : "opacity-40"
                  )}
                />
              </button>
            );
          })}
        </nav>
      </Card>

      <Button asChild variant="ghost" size="sm" className="justify-start gap-2">
        <Link href="/profile">
          <UserIcon className="h-4 w-4" />
          Volver a mi cuenta
        </Link>
      </Button>
    </aside>
  );
}

/* -------------------- Section shell -------------------- */

function SectionShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

/* -------------------- Account -------------------- */

function AccountSection() {
  const { user, switchRole } = useSession();
  if (!user) return null;

  const fields: {
    icon: typeof Mail;
    label: string;
    value: string;
    type?: string;
  }[] = [
    { icon: UserIcon, label: "Nombre completo", value: user.name },
    { icon: Mail, label: "Correo electrónico", value: user.email, type: "email" },
    { icon: Phone, label: "Teléfono / WhatsApp", value: user.phone, type: "tel" },
    { icon: MapPin, label: "Ciudad", value: user.city },
  ];

  return (
    <SectionShell
      title="Información de cuenta"
      description="Estos datos aparecen en tu perfil y se usan para contactarte."
    >
      <Card className="divide-y p-0">
        {fields.map((f) => (
          <EditableRow key={f.label} {...f} />
        ))}
      </Card>

      <Card className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="text-sm font-semibold">Tipo de cuenta</p>
          <p className="text-xs text-muted-foreground">
            Actualmente eres{" "}
            <span className="font-semibold text-foreground">
              {user.role === "provider" ? "anunciante" : "cliente"}
            </span>
            . Puedes cambiar el tipo en cualquier momento.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={switchRole} className="gap-1.5">
          <Repeat className="h-3.5 w-3.5" />
          Cambiar a {user.role === "provider" ? "cliente" : "anunciante"}
        </Button>
      </Card>
    </SectionShell>
  );
}

function EditableRow({
  icon: Icon,
  label,
  value,
  type,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  type?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  return (
    <div className="flex items-start gap-3 px-5 py-4">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {editing ? (
          <Input
            type={type || "text"}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="mt-1 h-9"
            autoFocus
          />
        ) : (
          <p className="mt-0.5 truncate text-sm font-medium">{value}</p>
        )}
      </div>
      {editing ? (
        <div className="flex gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDraft(value);
              setEditing(false);
            }}
          >
            Cancelar
          </Button>
          <Button variant="brand" size="sm" onClick={() => setEditing(false)}>
            Guardar
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditing(true)}
          className="gap-1 text-xs"
        >
          Editar
        </Button>
      )}
    </div>
  );
}

/* -------------------- Security -------------------- */

function SecuritySection() {
  return (
    <SectionShell
      title="Seguridad"
      description="Mantén tu cuenta protegida con una contraseña fuerte."
    >
      <Card className="p-5">
        <h3 className="text-sm font-semibold">Cambiar contraseña</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Usa al menos 8 caracteres con números y símbolos.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="current">Contraseña actual</Label>
            <Input id="current" type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-1.5 md:col-start-1">
            <Label htmlFor="new">Nueva contraseña</Label>
            <Input id="new" type="password" placeholder="Mínimo 8 caracteres" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirmar nueva contraseña</Label>
            <Input id="confirm" type="password" placeholder="Repite la nueva" />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="brand" size="sm">
            Actualizar contraseña
          </Button>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">Sesiones activas</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Estos dispositivos tienen acceso actualmente a tu cuenta.
            </p>
          </div>
          <Button variant="outline" size="sm">
            Cerrar todas
          </Button>
        </div>
        <Separator className="my-4" />
        <SessionRow
          device="Chrome · macOS"
          location="Bogotá, Colombia"
          current
        />
        <SessionRow device="Safari · iPhone" location="Bogotá · hace 2h" />
      </Card>
    </SectionShell>
  );
}

function SessionRow({
  device,
  location,
  current,
}: {
  device: string;
  location: string;
  current?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-sm font-medium">
          {device}
          {current && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Actual
            </span>
          )}
        </p>
        <p className="truncate text-xs text-muted-foreground">{location}</p>
      </div>
      {!current && (
        <Button variant="ghost" size="sm" className="text-xs text-destructive">
          Cerrar
        </Button>
      )}
    </div>
  );
}

/* -------------------- Notifications -------------------- */

function NotificationsSection() {
  return (
    <SectionShell
      title="Notificaciones"
      description="Elige los avisos que quieres recibir y dónde."
    >
      <Card className="divide-y p-0">
        <ToggleRow
          title="Mensajes nuevos"
          description="Cuando alguien te escriba por chat."
          defaultOn
        />
        <ToggleRow
          title="Favoritos recibidos"
          description="Cuando un cliente guarde tu perfil."
          defaultOn
        />
        <ToggleRow
          title="Reseñas nuevas"
          description="Cuando recibas una nueva reseña."
          defaultOn
        />
        <ToggleRow
          title="Recomendaciones por correo"
          description="Perfiles destacados que pueden interesarte."
        />
        <ToggleRow
          title="Promociones y novedades"
          description="Ofertas especiales de flitrhub."
        />
      </Card>
    </SectionShell>
  );
}

function ToggleRow({
  title,
  description,
  defaultOn,
}: {
  title: string;
  description: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-start justify-between gap-3 px-5 py-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={on} onCheckedChange={setOn} />
    </div>
  );
}

/* -------------------- Privacy -------------------- */

function PrivacySection() {
  const { enabled: discreet, toggle: toggleDiscreet } = useDiscreet();

  return (
    <SectionShell
      title="Privacidad"
      description="Controla cómo se muestra el contenido y tu perfil."
    >
      <Card className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {discreet ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">Modo discreto</p>
              <p className="text-xs text-muted-foreground">
                Difumina imágenes sensibles hasta que pases el mouse o las
                toques. Útil para navegar en lugares públicos.
              </p>
            </div>
          </div>
          <Switch checked={discreet} onCheckedChange={toggleDiscreet} />
        </div>
      </Card>

      <Card className="divide-y p-0">
        <ToggleRow
          title="Mostrar mi perfil en búsquedas"
          description="Aparece en los resultados cuando otros buscan."
          defaultOn
        />
        <ToggleRow
          title="Mostrar última conexión"
          description="Otros usuarios verán cuándo te conectaste por última vez."
          defaultOn
        />
        <ToggleRow
          title="Permitir mensajes de no-contactos"
          description="Cualquiera puede iniciar un chat contigo."
          defaultOn
        />
      </Card>
    </SectionShell>
  );
}

/* -------------------- Danger zone -------------------- */

function DangerSection() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { logout } = useSession();

  return (
    <SectionShell
      title="Zona de peligro"
      description="Acciones irreversibles sobre tu cuenta."
    >
      <Card className="border-destructive/40 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <LogOut className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">Cerrar sesión</p>
              <p className="text-xs text-muted-foreground">
                Cierra tu sesión en este dispositivo. Podrás volver a entrar
                cuando quieras.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="gap-1.5 text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-3.5 w-3.5" />
            Cerrar sesión
          </Button>
        </div>
      </Card>

      <Card className="border-destructive/40 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <Trash2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">Eliminar cuenta</p>
              <p className="text-xs text-muted-foreground">
                Esta acción es permanente. Se borrarán tus publicaciones,
                favoritos, reseñas y conversaciones.
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmOpen(true)}
            className="gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Eliminar cuenta
          </Button>
        </div>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <Trash2 className="h-5 w-5" />
            </div>
            <DialogTitle className="text-center">
              ¿Eliminar cuenta de forma permanente?
            </DialogTitle>
            <DialogDescription className="text-center">
              Esta acción no se puede deshacer. Se borrarán todos tus datos,
              publicaciones, favoritos y conversaciones.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmOpen(false);
                // Mock — frontend only.
              }}
              className="flex-1 gap-1.5"
            >
              <Trash2 className="h-4 w-4" />
              Sí, eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SectionShell>
  );
}

/* -------------------- Logged out -------------------- */

function LoggedOutSettings() {
  const [loginOpen, setLoginOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">
          Inicia sesión para acceder a la configuración
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Necesitas estar logueado para gestionar tu cuenta, privacidad y
          notificaciones.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <Button variant="brand" onClick={() => setLoginOpen(true)}>
            Iniciar sesión
          </Button>
          <Button asChild variant="outline">
            <Link href="/signup">Crear cuenta</Link>
          </Button>
        </div>
        <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      </div>
    </div>
  );
}
