"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Heart,
  Lock,
  Mail,
  Phone,
  Sparkles,
  User as UserIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SimpleSelect } from "@/components/ui/simple-select";
import {
  AppleIcon,
  FacebookIcon,
  GoogleIcon,
} from "@/components/icons/social";
import { CITIES } from "@/lib/cities";
import { useSession, type UserRole } from "@/lib/session";
import { cn } from "@/lib/utils";

interface SignupDraft {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
  city: string;
  acceptTerms: boolean;
  marketing: boolean;
}

const EMPTY: SignupDraft = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirm: "",
  city: "Bogotá",
  acceptTerms: false,
  marketing: true,
};

export function SignupForm() {
  const router = useRouter();
  const { login } = useSession();

  const [role, setRole] = useState<UserRole>("client");
  const [draft, setDraft] = useState<SignupDraft>(EMPTY);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof SignupDraft>(key: K, value: SignupDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const validate = (): string | null => {
    if (!draft.name.trim()) return "Escribe tu nombre.";
    if (!draft.email.trim()) return "Ingresa tu correo.";
    if (!draft.password) return "Crea una contraseña.";
    if (draft.password.length < 6)
      return "La contraseña debe tener al menos 6 caracteres.";
    if (draft.password !== draft.confirm) return "Las contraseñas no coinciden.";
    if (!draft.acceptTerms) return "Debes aceptar los términos para continuar.";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    // Mock — frontend-only. Real flow will POST to flitrhub-api.
    login(role);
    router.push("/profile");
  };

  const handleSocial = (_provider: "google" | "facebook" | "apple") => {
    login(role);
    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative top glow */}
      <div className="bg-gradient-sensual pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 opacity-60 blur-3xl" />

      <header className="border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 md:px-6">
          <Button asChild variant="ghost" size="sm" className="-ml-2 gap-1.5">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Inicio
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-col px-4 py-10 md:py-14">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
            F
          </span>
          <span className="text-2xl font-bold tracking-tight text-brand">
            flitr<span className="text-primary">hub</span>
          </span>
        </Link>

        <div className="rounded-2xl border bg-card p-6 shadow-xl">
          <div className="mb-5">
            <h1 className="text-xl font-bold tracking-tight">Crear cuenta</h1>
            <p className="text-sm text-muted-foreground">
              Únete a flitrhub en menos de un minuto.
            </p>
          </div>

          {/* Role tabs */}
          <div className="mb-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tipo de cuenta
            </p>
            <div className="grid grid-cols-2 gap-2">
              <RoleCard
                icon={Heart}
                label="Soy cliente"
                description="Busco servicios"
                active={role === "client"}
                onClick={() => setRole("client")}
              />
              <RoleCard
                icon={Sparkles}
                label="Soy anunciante"
                description="Ofrezco servicios"
                active={role === "provider"}
                onClick={() => setRole("provider")}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field>
              <Label htmlFor="signup-name">Nombre completo</Label>
              <div className="relative">
                <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="signup-name"
                  required
                  placeholder={
                    role === "provider" ? "Tu nombre artístico" : "Tu nombre"
                  }
                  value={draft.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="pl-9"
                />
              </div>
            </Field>

            <Field>
              <Label htmlFor="signup-email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="tucorreo@ejemplo.com"
                  value={draft.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="pl-9"
                />
              </div>
            </Field>

            <Field>
              <Label htmlFor="signup-phone">Teléfono / WhatsApp</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="+57 300 000 0000"
                  value={draft.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="pl-9"
                />
              </div>
            </Field>

            <Field>
              <Label>Ciudad</Label>
              <SimpleSelect
                options={CITIES.map((c) => ({ value: c, label: c }))}
                value={draft.city}
                onChange={(v) => update("city", v)}
              />
            </Field>

            <div className="grid grid-cols-1 gap-4">
              <Field>
                <Label htmlFor="signup-password">Contraseña</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    placeholder="Mínimo 6 caracteres"
                    value={draft.password}
                    onChange={(e) => update("password", e.target.value)}
                    className="pl-9 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Ver contraseña"
                    }
                    className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:bg-accent"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </Field>

              <Field>
                <Label htmlFor="signup-confirm">Confirmar contraseña</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="signup-confirm"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    placeholder="Repite tu contraseña"
                    value={draft.confirm}
                    onChange={(e) => update("confirm", e.target.value)}
                    className="pl-9"
                  />
                </div>
              </Field>
            </div>

            <label className="flex cursor-pointer items-start gap-2 text-xs">
              <Checkbox
                checked={draft.acceptTerms}
                onCheckedChange={(v) =>
                  update("acceptTerms", v === true)
                }
                className="mt-0.5"
              />
              <span>
                Soy mayor de 18 años y acepto los{" "}
                <Link href="#" className="font-semibold text-primary hover:underline">
                  términos
                </Link>{" "}
                y la{" "}
                <Link href="#" className="font-semibold text-primary hover:underline">
                  política de privacidad
                </Link>
                .
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-2 text-xs">
              <Checkbox
                checked={draft.marketing}
                onCheckedChange={(v) =>
                  update("marketing", v === true)
                }
                className="mt-0.5"
              />
              <span className="text-muted-foreground">
                Quiero recibir recomendaciones y novedades por correo.
              </span>
            </label>

            {error && (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" variant="brand" className="w-full">
              <CheckCircle2 className="h-4 w-4" />
              Crear cuenta
            </Button>
          </form>

          <Divider>o registrarse con</Divider>

          <div className="grid grid-cols-3 gap-2">
            <SocialButton onClick={() => handleSocial("google")}>
              <GoogleIcon />
              Google
            </SocialButton>
            <SocialButton onClick={() => handleSocial("facebook")}>
              <FacebookIcon />
              Facebook
            </SocialButton>
            <SocialButton onClick={() => handleSocial("apple")}>
              <AppleIcon className="text-foreground" />
              Apple
            </SocialButton>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link href="/" className="font-semibold text-primary hover:underline">
            Inicia sesión desde el menú
          </Link>
        </p>
      </main>
    </div>
  );
}

function Field({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1.5">{children}</div>;
}

function RoleCard({
  icon: Icon,
  label,
  description,
  active,
  onClick,
}: {
  icon: typeof Heart;
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-xl border p-3 text-left transition-all",
        active
          ? "border-primary bg-primary/10 shadow-[0_0_0_2px_hsl(var(--primary)/0.18)]"
          : "border-border bg-background hover:border-primary/40 hover:bg-accent"
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
          active ? "bg-primary/15 text-primary" : "bg-muted text-primary"
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold">{label}</p>
        <p className="truncate text-[10px] text-muted-foreground">
          {description}
        </p>
      </div>
    </button>
  );
}

function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {children}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function SocialButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center gap-1.5 rounded-md border bg-background px-2 py-2 text-xs font-medium transition-colors hover:bg-accent"
    >
      {children}
    </button>
  );
}
