"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Heart, Lock, Mail, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AppleIcon,
  FacebookIcon,
  GoogleIcon,
} from "@/components/icons/social";
import { useSession, type UserRole } from "@/lib/session";
import { cn } from "@/lib/utils";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { login } = useSession();
  const [role, setRole] = useState<UserRole>("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setPassword("");
      setShowPassword(false);
      setError(null);
      setRole("client");
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }
    // Mock — any credentials are accepted. Real flow will hit flitrhub-api.
    login(role);
    onOpenChange(false);
  };

  const handleSocial = (_provider: "google" | "facebook" | "apple") => {
    // Mock — same as form submit, using the selected role.
    login(role);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              F
            </span>
            Bienvenido a flitr
            <span className="text-primary">hub</span>
          </DialogTitle>
          <DialogDescription>
            Inicia sesión para continuar.
          </DialogDescription>
        </DialogHeader>

        {/* Role tabs */}
        <div className="mt-1 grid grid-cols-2 gap-1 rounded-lg border bg-muted/40 p-1">
          <RoleTab
            label="Cliente"
            icon={Heart}
            active={role === "client"}
            onClick={() => setRole("client")}
          />
          <RoleTab
            label="Anunciante"
            icon={Sparkles}
            active={role === "provider"}
            onClick={() => setRole("provider")}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="login-email">Correo electrónico</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="tucorreo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password">Contraseña</Label>
              <button
                type="button"
                className="text-xs font-medium text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:bg-accent"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" variant="brand" className="w-full">
            Iniciar sesión
          </Button>
        </form>

        <Divider>o continuar con</Divider>

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

        <p className="text-center text-xs text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link
            href="/signup"
            onClick={() => onOpenChange(false)}
            className="font-semibold text-primary hover:underline"
          >
            Crear una
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  );
}

function RoleTab({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: typeof Heart;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition-colors",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-1">
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
