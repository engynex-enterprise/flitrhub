"use client";

import { useState } from "react";
import { CheckCircle2, ImagePlus, Sparkles, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CITIES } from "@/lib/cities";
import { services } from "@/lib/services";
import {
  PAYMENT_OPTIONS,
  SERVICE_LOCATION_OPTIONS,
  TIER_OPTIONS,
  ZONES,
} from "@/lib/filters";
import type {
  PaymentMethod,
  ServiceLocation,
  Tier,
} from "@/lib/mock-posts";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PostDraft {
  name: string;
  age: string;
  city: string;
  zone: string;
  service: string;
  tier: Tier;
  pricePerHour: string;
  whatsapp: string;
  description: string;
  paymentMethods: PaymentMethod[];
  serviceLocations: ServiceLocation[];
}

const INITIAL_DRAFT: PostDraft = {
  name: "",
  age: "",
  city: "Bogotá",
  zone: ZONES[0],
  service: services[0].key,
  tier: "plata",
  pricePerHour: "",
  whatsapp: "",
  description: "",
  paymentMethods: ["efectivo"],
  serviceLocations: ["incall"],
};

export function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
  const [draft, setDraft] = useState<PostDraft>(INITIAL_DRAFT);
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof PostDraft>(key: K, value: PostDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const toggleIn = <T,>(arr: T[], value: T): T[] =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const reset = () => {
    setDraft(INITIAL_DRAFT);
    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend-only: real submit will POST to flitrhub-api once wired.
    setSubmitted(true);
  };

  const tierChips = TIER_OPTIONS.filter((t) => t.value !== "all") as {
    value: Tier;
    label: string;
  }[];

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {submitted ? (
          <SuccessState
            onClose={() => {
              onOpenChange(false);
              reset();
            }}
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Crear publicación
              </DialogTitle>
              <DialogDescription>
                Completa la información de tu perfil. Tu publicación estará
                disponible una vez sea revisada.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 py-2">
              {/* Foto */}
              <Field>
                <Label htmlFor="photo">Foto principal</Label>
                <div className="flex aspect-[3/2] items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary/40 hover:bg-accent/40">
                  <div className="flex flex-col items-center gap-2 p-4 text-center text-muted-foreground">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <ImagePlus className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium">
                      Arrastra una foto o haz clic para subir
                    </p>
                    <p className="text-xs">JPG o PNG · máx. 8 MB</p>
                    <Button type="button" variant="outline" size="sm" className="mt-1">
                      <Upload className="h-4 w-4" />
                      Subir foto
                    </Button>
                  </div>
                </div>
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field>
                  <Label htmlFor="name">Nombre artístico</Label>
                  <Input
                    id="name"
                    required
                    placeholder="Ej. Sofía Luxe"
                    value={draft.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </Field>
                <Field>
                  <Label htmlFor="age">Edad</Label>
                  <Input
                    id="age"
                    required
                    type="number"
                    min={18}
                    max={70}
                    placeholder="25"
                    value={draft.age}
                    onChange={(e) => update("age", e.target.value)}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field>
                  <Label htmlFor="city">Ciudad</Label>
                  <Select
                    id="city"
                    value={draft.city}
                    onChange={(e) => update("city", e.target.value)}
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field>
                  <Label htmlFor="zone">Zona</Label>
                  <Select
                    id="zone"
                    value={draft.zone}
                    onChange={(e) => update("zone", e.target.value)}
                  >
                    {ZONES.map((z) => (
                      <option key={z} value={z}>
                        {z}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <Field>
                <Label htmlFor="service">Categoría de servicio</Label>
                <Select
                  id="service"
                  value={draft.service}
                  onChange={(e) => update("service", e.target.value)}
                >
                  {services.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field>
                <Label>Plan</Label>
                <ChipsRow
                  options={tierChips}
                  isActive={(v) => draft.tier === v}
                  onClick={(v) => update("tier", v)}
                />
                <p className="text-xs text-muted-foreground">
                  Los planes Platino y Oro aparecen en Destacados y Recomendados
                  con prioridad.
                </p>
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field>
                  <Label htmlFor="price">Precio por hora (COP)</Label>
                  <Input
                    id="price"
                    required
                    type="number"
                    min={50}
                    step={10}
                    placeholder="250"
                    value={draft.pricePerHour}
                    onChange={(e) => update("pricePerHour", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    En miles. Ej. 250 = $250.000
                  </p>
                </Field>
                <Field>
                  <Label htmlFor="whatsapp">WhatsApp / Contacto</Label>
                  <Input
                    id="whatsapp"
                    required
                    type="tel"
                    placeholder="+57 300 000 0000"
                    value={draft.whatsapp}
                    onChange={(e) => update("whatsapp", e.target.value)}
                  />
                </Field>
              </div>

              <Field>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  rows={4}
                  required
                  placeholder="Cuéntale a tus clientes qué te hace especial..."
                  value={draft.description}
                  onChange={(e) => update("description", e.target.value)}
                />
              </Field>

              <Field>
                <Label>Tipo de encuentro</Label>
                <ChipsRow
                  options={SERVICE_LOCATION_OPTIONS}
                  isActive={(v) => draft.serviceLocations.includes(v)}
                  onClick={(v) =>
                    update(
                      "serviceLocations",
                      toggleIn(draft.serviceLocations, v)
                    )
                  }
                />
              </Field>

              <Field>
                <Label>Métodos de pago</Label>
                <ChipsRow
                  options={PAYMENT_OPTIONS}
                  isActive={(v) => draft.paymentMethods.includes(v)}
                  onClick={(v) =>
                    update("paymentMethods", toggleIn(draft.paymentMethods, v))
                  }
                />
              </Field>

              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                Al publicar declaras que tienes 18 años o más y aceptas los
                términos de uso de la plataforma.
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="brand">
                  Publicar perfil
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

function ChipsRow<T extends string>({
  options,
  isActive,
  onClick,
}: {
  options: { value: T; label: string }[];
  isActive: (v: T) => boolean;
  onClick: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onClick(opt.value)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
            isActive(opt.value)
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-foreground hover:bg-accent"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h2 className="mt-4 text-lg font-bold">Publicación enviada</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Tu perfil está en revisión. Te notificaremos cuando esté visible en la
        plataforma.
      </p>
      <Button variant="brand" className="mt-6" onClick={onClose}>
        Volver
      </Button>
    </div>
  );
}
