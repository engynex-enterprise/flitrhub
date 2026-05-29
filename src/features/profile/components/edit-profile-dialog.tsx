"use client";

import { useEffect, useState } from "react";
import { Mail, MapPin, Phone, User } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
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
import { useSession, type SessionUser } from "@/features/auth/session";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormState = {
  name: string;
  email: string;
  phone: string;
  city: string;
  age: string;
};

function toForm(user: SessionUser): FormState {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    city: user.city,
    age: String(user.age),
  };
}

export function EditProfileDialog({
  open,
  onOpenChange,
}: EditProfileDialogProps) {
  const { user, updateUser } = useSession();
  const [form, setForm] = useState<FormState>(() =>
    user ? toForm(user) : { name: "", email: "", phone: "", city: "", age: "" }
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Reset when the dialog opens (so cancel → next open shows fresh values).
  useEffect(() => {
    if (open && user) {
      setForm(toForm(user));
      setError(null);
    }
  }, [open, user]);

  if (!user) return null;

  const set = (k: keyof FormState, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (!form.email.trim() || !form.email.includes("@")) {
      setError("Ingresa un correo válido.");
      return;
    }
    const age = Number(form.age);
    if (!Number.isFinite(age) || age < 18 || age > 99) {
      setError("La edad debe estar entre 18 y 99.");
      return;
    }

    setError(null);
    setSaving(true);
    // Mock — real flow will hit flitrhub-api.
    setTimeout(() => {
      updateUser({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        age,
      });
      setSaving(false);
      onOpenChange(false);
    }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>
            Actualiza tu información personal. Será visible en tu cuenta.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <Field
            id="edit-name"
            label="Nombre"
            icon={User}
            value={form.name}
            onChange={(v) => set("name", v)}
            placeholder="Tu nombre"
            autoComplete="name"
            required
          />

          <Field
            id="edit-email"
            label="Correo electrónico"
            icon={Mail}
            type="email"
            value={form.email}
            onChange={(v) => set("email", v)}
            placeholder="tucorreo@ejemplo.com"
            autoComplete="email"
            required
          />

          <Field
            id="edit-phone"
            label="Teléfono"
            icon={Phone}
            type="tel"
            value={form.phone}
            onChange={(v) => set("phone", v)}
            placeholder="+57 300 000 0000"
            autoComplete="tel"
          />

          <div className="grid grid-cols-[1fr_100px] gap-3">
            <Field
              id="edit-city"
              label="Ciudad"
              icon={MapPin}
              value={form.city}
              onChange={(v) => set("city", v)}
              placeholder="Bogotá"
              autoComplete="address-level2"
            />
            <div className="space-y-1.5">
              <Label htmlFor="edit-age">Edad</Label>
              <Input
                id="edit-age"
                type="number"
                inputMode="numeric"
                min={18}
                max={99}
                value={form.age}
                onChange={(e) => set("age", e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="brand" disabled={saving}>
              {saving ? "Guardando…" : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  required,
}: {
  id: string;
  label: string;
  icon: typeof Mail;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className="pl-9"
        />
      </div>
    </div>
  );
}
