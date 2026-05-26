"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Heart,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
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

const STEPS = [
  { id: 1, label: "Cuenta" },
  { id: 2, label: "Datos" },
  { id: 3, label: "Seguridad" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

export function SignupForm() {
  const router = useRouter();
  const { login } = useSession();

  const [step, setStep] = useState<StepId>(1);
  const [role, setRole] = useState<UserRole>("client");
  const [draft, setDraft] = useState<SignupDraft>(EMPTY);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof SignupDraft>(key: K, value: SignupDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const validateStep = (s: StepId): string | null => {
    if (s === 1) {
      if (!draft.name.trim()) return "Escribe tu nombre.";
      if (!draft.email.trim()) return "Ingresa tu correo.";
    }
    if (s === 2) {
      if (!draft.phone.trim()) return "Ingresa tu teléfono o WhatsApp.";
      if (!draft.city) return "Selecciona tu ciudad.";
    }
    if (s === 3) {
      if (!draft.password) return "Crea una contraseña.";
      if (draft.password.length < 6)
        return "La contraseña debe tener al menos 6 caracteres.";
      if (draft.password !== draft.confirm)
        return "Las contraseñas no coinciden.";
      if (!draft.acceptTerms)
        return "Debes aceptar los términos para continuar.";
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep((s) => (s < 3 ? ((s + 1) as StepId) : s));
  };

  const handleBack = () => {
    setError(null);
    setStep((s) => (s > 1 ? ((s - 1) as StepId) : s));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateStep(3);
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

      <main className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 gap-8 px-4 py-8 md:py-12 lg:grid-cols-2 lg:gap-12">
        {/* Left: form column */}
        <div className="mx-auto flex w-full max-w-md flex-col justify-center">
          <Link
            href="/"
            className="mb-6 flex items-center justify-center gap-2 lg:justify-start"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
              F
            </span>
            <span className="text-2xl font-bold tracking-tight text-brand">
              flitr<span className="text-primary">hub</span>
            </span>
          </Link>

          <div className="rounded-2xl border bg-card p-6 shadow-xl">
            <div className="mb-5">
              <div className="flex items-center justify-between gap-2">
                <h1 className="text-xl font-bold tracking-tight">
                  Crear cuenta
                </h1>
                <span className="text-xs text-muted-foreground">
                  Paso {step} de {STEPS.length}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {step === 1 && "Cuéntanos quién eres."}
                {step === 2 && "Cómo te contactamos."}
                {step === 3 && "Protege tu cuenta."}
              </p>

              {/* Progress */}
              <Stepper current={step} />
            </div>

            <form
              onSubmit={
                step === 3
                  ? handleSubmit
                  : (e) => {
                      e.preventDefault();
                      handleNext();
                    }
              }
              className="space-y-4"
            >
              {step === 1 && (
                <>
                  <div>
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

                  <Field>
                    <Label htmlFor="signup-name">Nombre completo</Label>
                    <div className="relative">
                      <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        required
                        placeholder={
                          role === "provider"
                            ? "Tu nombre artístico"
                            : "Tu nombre"
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
                </>
              )}

              {step === 2 && (
                <>
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
                </>
              )}

              {step === 3 && (
                <>
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
                          showPassword
                            ? "Ocultar contraseña"
                            : "Ver contraseña"
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
                    <Label htmlFor="signup-confirm">
                      Confirmar contraseña
                    </Label>
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
                      <Link
                        href="#"
                        className="font-semibold text-primary hover:underline"
                      >
                        términos
                      </Link>{" "}
                      y la{" "}
                      <Link
                        href="#"
                        className="font-semibold text-primary hover:underline"
                      >
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
                </>
              )}

              {error && (
                <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {error}
                </p>
              )}

              <div className="flex gap-2 pt-1">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Atrás
                  </Button>
                )}
                {step < 3 ? (
                  <Button type="submit" variant="brand" className="flex-1 gap-1.5">
                    Siguiente
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" variant="brand" className="flex-1 gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    Crear cuenta
                  </Button>
                )}
              </div>
            </form>

            {step === 1 && (
              <>
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
              </>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link href="/" className="font-semibold text-primary hover:underline">
              Inicia sesión desde el menú
            </Link>
          </p>
        </div>

        {/* Right: hero column */}
        <aside className="relative hidden overflow-hidden rounded-3xl border shadow-xl lg:block">
          <Image
            src="https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1400&q=80"
            alt="Conexiones reales en flitrhub"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent" />

          <div className="relative flex h-full flex-col justify-between p-8 text-white">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              La plataforma de encuentros premium
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                  Conecta con quien quieras,{" "}
                  <span className="text-primary">cuando quieras</span>.
                </h2>
                <p className="max-w-md text-sm text-white/80 md:text-base">
                  En flitrhub encuentras anunciantes verificados, perfiles
                  reales y experiencias a tu medida. Discreción, confianza y
                  calidad en una sola plataforma.
                </p>
              </div>

              <ul className="space-y-3 text-sm">
                <Highlight icon={ShieldCheck}>
                  Perfiles verificados y pagos seguros
                </Highlight>
                <Highlight icon={Heart}>
                  Conexiones reales, sin intermediarios
                </Highlight>
                <Highlight icon={Star}>
                  Reseñas auténticas de la comunidad
                </Highlight>
              </ul>

              <div className="flex items-center gap-3 border-t border-white/15 pt-5">
                <div className="flex -space-x-2">
                  {[
                    "https://i.pravatar.cc/64?img=47",
                    "https://i.pravatar.cc/64?img=32",
                    "https://i.pravatar.cc/64?img=49",
                  ].map((src) => (
                    <Image
                      key={src}
                      src={src}
                      alt=""
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full border-2 border-background object-cover"
                    />
                  ))}
                </div>
                <p className="text-xs text-white/80">
                  Más de <span className="font-semibold text-white">10.000</span>{" "}
                  personas ya confían en flitrhub.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

function Stepper({ current }: { current: StepId }) {
  return (
    <div className="mt-4 flex items-center gap-2">
      {STEPS.map((s, i) => {
        const done = s.id < current;
        const active = s.id === current;
        return (
          <div key={s.id} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors",
                done && "bg-primary text-primary-foreground",
                active && "bg-primary text-primary-foreground ring-2 ring-primary/30",
                !done && !active && "bg-muted text-muted-foreground"
              )}
            >
              {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : s.id}
            </div>
            <span
              className={cn(
                "text-[11px] font-medium",
                active ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-px flex-1 transition-colors",
                  done ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
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

function Highlight({
  icon: Icon,
  children,
}: {
  icon: typeof Heart;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-primary backdrop-blur">
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-white/90">{children}</span>
    </li>
  );
}
