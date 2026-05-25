"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ImagePlus, LogIn, Sparkles, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SimpleSelect } from "@/components/ui/simple-select";
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
import { useSession } from "@/lib/session";
import type {
  PaymentMethod,
  ServiceLocation,
  Tier,
} from "@/lib/mock-posts";

interface CreatePostDrawerProps {
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

const EMPTY_DRAFT: PostDraft = {
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

export function CreatePostDrawer({ open, onOpenChange }: CreatePostDrawerProps) {
  const { user, isLoggedIn, login } = useSession();

  const [draft, setDraft] = useState<PostDraft>(EMPTY_DRAFT);
  const [submitted, setSubmitted] = useState(false);

  // Prefill draft with session data when the drawer opens with a logged-in user.
  useEffect(() => {
    if (!open) return;
    if (user) {
      setDraft((d) => ({
        ...d,
        name: d.name || user.name,
        age: d.age || String(user.age),
        city: CITIES.includes(user.city) ? user.city : d.city,
        whatsapp: d.whatsapp || user.phone,
      }));
    }
  }, [open, user]);

  const update = <K extends keyof PostDraft>(key: K, value: PostDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const reset = () => {
    setDraft(EMPTY_DRAFT);
    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const tierChips = TIER_OPTIONS.filter((t) => t.value !== "all") as {
    value: Tier;
    label: string;
  }[];

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <SheetContent side="right" className="flex flex-col p-0">
        {submitted ? (
          <SuccessState
            onClose={() => {
              onOpenChange(false);
              reset();
            }}
          />
        ) : (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Crear publicación
              </SheetTitle>
              <SheetDescription>
                Completa la información de tu perfil. Tu publicación estará
                disponible una vez sea revisada.
              </SheetDescription>
            </SheetHeader>

            {isLoggedIn ? (
              <div className="flex items-center gap-2 border-b bg-primary/5 px-6 py-2 text-xs text-primary">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Datos prellenados con tu cuenta · {user?.email}
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 border-b bg-amber-500/10 px-6 py-2 text-xs text-amber-200">
                <span className="flex-1">
                  Inicia sesión para autocompletar tus datos.
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={login}
                  className="h-7 gap-1.5 border-amber-300/30 bg-amber-500/10 text-amber-100 hover:bg-amber-500/20"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Iniciar sesión
                </Button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
              <SheetBody className="space-y-5">
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
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-1"
                      >
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
                    <Label>Ciudad</Label>
                    <SimpleSelect
                      options={CITIES.map((c) => ({ value: c, label: c }))}
                      value={draft.city}
                      onChange={(v) => update("city", v)}
                    />
                  </Field>
                  <Field>
                    <Label>Zona</Label>
                    <SimpleSelect
                      options={ZONES.map((z) => ({ value: z, label: z }))}
                      value={draft.zone}
                      onChange={(v) => update("zone", v)}
                    />
                  </Field>
                </div>

                <Field>
                  <Label>Categoría de servicio</Label>
                  <SimpleSelect
                    options={services.map((s) => ({
                      value: s.key,
                      label: s.label,
                    }))}
                    value={draft.service}
                    onChange={(v) => update("service", v)}
                  />
                </Field>

                <Field>
                  <Label>Plan</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {tierChips.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => update("tier", opt.value)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                          draft.tier === opt.value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:bg-accent"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Los planes Platino y Oro aparecen en Destacados y
                    Recomendados con prioridad.
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
                  <MultiSelect
                    options={SERVICE_LOCATION_OPTIONS}
                    values={draft.serviceLocations}
                    onChange={(v) => update("serviceLocations", v)}
                    placeholder="Selecciona uno o más"
                  />
                </Field>

                <Field>
                  <Label>Métodos de pago aceptados</Label>
                  <MultiSelect
                    options={PAYMENT_OPTIONS}
                    values={draft.paymentMethods}
                    onChange={(v) => update("paymentMethods", v)}
                    placeholder="Selecciona uno o más"
                  />
                </Field>

                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                  Al publicar declaras que tienes 18 años o más y aceptas los
                  términos de uso de la plataforma.
                </div>
              </SheetBody>

              <SheetFooter>
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
              </SheetFooter>
            </form>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Field({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
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
