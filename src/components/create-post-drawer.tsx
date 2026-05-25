"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ImagePlus,
  LogIn,
  Sparkles,
  Upload,
} from "lucide-react";

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
import { services, type ServiceKey } from "@/lib/services";
import {
  BODY_TYPE_OPTIONS,
  ETHNICITY_OPTIONS,
  HAIR_COLOR_OPTIONS,
  LANGUAGE_OPTIONS,
  PAYMENT_OPTIONS,
  SERVICE_LOCATION_OPTIONS,
  TIER_OPTIONS,
  ZONES,
} from "@/lib/filters";
import { SERVICE_FORM_CONFIG } from "@/lib/service-form-config";
import { useSession } from "@/lib/session";
import type {
  BodyType,
  Ethnicity,
  HairColor,
  Language,
  PaymentMethod,
  ServiceLocation,
  Tier,
} from "@/lib/mock-posts";

interface CreatePostDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PostDraft {
  // common
  service: ServiceKey | null;
  name: string;
  age: string;
  city: string;
  zone: string;
  tier: Tier;
  price: string;
  whatsapp: string;
  description: string;
  paymentMethods: PaymentMethod[];
  serviceLocations: ServiceLocation[];
  languages: Language[];

  // physical (shown when showPhysical)
  bodyType: BodyType | "";
  hairColor: HairColor | "";
  ethnicity: Ethnicity | "";
  height: string;

  // service-specific
  specialties: string[];
  extras: string[];
  role: string;

  // parejas
  partnerName: string;
  partnerAge: string;

  // despedidas
  groupCapacity: string;
}

const EMPTY_DRAFT: PostDraft = {
  service: null,
  name: "",
  age: "",
  city: "Bogotá",
  zone: ZONES[0],
  tier: "plata",
  price: "",
  whatsapp: "",
  description: "",
  paymentMethods: ["efectivo"],
  serviceLocations: ["incall"],
  languages: ["es"],

  bodyType: "",
  hairColor: "",
  ethnicity: "",
  height: "",

  specialties: [],
  extras: [],
  role: "",

  partnerName: "",
  partnerAge: "",
  groupCapacity: "",
};

type Step = "service" | "form";

export function CreatePostDrawer({ open, onOpenChange }: CreatePostDrawerProps) {
  const { user, isLoggedIn, login } = useSession();

  const [step, setStep] = useState<Step>("service");
  const [draft, setDraft] = useState<PostDraft>(EMPTY_DRAFT);
  const [submitted, setSubmitted] = useState(false);

  // Reset when opening; prefill basics from session.
  useEffect(() => {
    if (!open) return;
    setStep("service");
    setSubmitted(false);
    setDraft((d) => ({
      ...d,
      service: null,
      specialties: [],
      extras: [],
      role: "",
      name: user?.name ?? "",
      age: user?.age ? String(user.age) : "",
      city: user?.city && CITIES.includes(user.city) ? user.city : d.city,
      whatsapp: user?.phone ?? "",
    }));
  }, [open, user]);

  const update = <K extends keyof PostDraft>(key: K, value: PostDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const selectService = (key: ServiceKey) => {
    setDraft((d) => ({
      ...d,
      service: key,
      // Reset service-specific fields when switching
      specialties: [],
      extras: [],
      role: "",
      partnerName: "",
      partnerAge: "",
      groupCapacity: "",
    }));
    setStep("form");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col p-0">
        {submitted ? (
          <SuccessState
            onClose={() => {
              onOpenChange(false);
            }}
          />
        ) : step === "service" ? (
          <ServiceStep
            selected={draft.service}
            onSelect={selectService}
            isLoggedIn={isLoggedIn}
            onLogin={login}
            userEmail={user?.email}
            onCancel={() => onOpenChange(false)}
          />
        ) : (
          <FormStep
            draft={draft}
            update={update}
            onBack={() => setStep("service")}
            onCancel={() => onOpenChange(false)}
            onSubmit={handleSubmit}
            isLoggedIn={isLoggedIn}
            userEmail={user?.email}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

/* -------------------- Step 1: choose service -------------------- */

function ServiceStep({
  selected,
  onSelect,
  isLoggedIn,
  onLogin,
  userEmail,
  onCancel,
}: {
  selected: ServiceKey | null;
  onSelect: (s: ServiceKey) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  userEmail?: string;
  onCancel: () => void;
}) {
  return (
    <>
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Crear publicación
        </SheetTitle>
        <SheetDescription>
          Paso 1 de 2 — ¿Qué tipo de servicio vas a publicar?
        </SheetDescription>
      </SheetHeader>

      <SessionBanner
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        onLogin={onLogin}
      />

      <SheetBody>
        <div className="grid grid-cols-2 gap-2">
          {services.map((s) => {
            const Icon = s.icon;
            const isActive = selected === s.key;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => onSelect(s.key)}
                className={cn(
                  "group relative flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all",
                  isActive
                    ? "border-primary bg-primary/10 shadow-[0_0_0_2px_hsl(var(--primary)/0.18)]"
                    : "border-border bg-card hover:border-primary/40 hover:bg-accent"
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
                    isActive
                      ? "border-primary/30 bg-primary/15 text-primary"
                      : "border-border bg-muted/40 text-primary"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold leading-tight">
                  {s.label}
                </span>
                {isActive && (
                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </SheetBody>

      <SheetFooter>
        <Button variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
      </SheetFooter>
    </>
  );
}

/* -------------------- Step 2: form (depends on service) -------------------- */

interface FormStepProps {
  draft: PostDraft;
  update: <K extends keyof PostDraft>(key: K, value: PostDraft[K]) => void;
  onBack: () => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoggedIn: boolean;
  userEmail?: string;
}

function FormStep({
  draft,
  update,
  onBack,
  onCancel,
  onSubmit,
  isLoggedIn,
  userEmail,
}: FormStepProps) {
  const service = draft.service!;
  const config = SERVICE_FORM_CONFIG[service];
  const serviceMeta = services.find((s) => s.key === service)!;

  const tierChips = TIER_OPTIONS.filter((t) => t.value !== "all") as {
    value: Tier;
    label: string;
  }[];

  return (
    <>
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Crear publicación
        </SheetTitle>
        <SheetDescription>Paso 2 de 2 — Detalles del perfil</SheetDescription>
      </SheetHeader>

      {/* Selected service indicator */}
      <div className="flex items-center gap-2 border-b bg-primary/5 px-6 py-2 text-xs">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <serviceMeta.icon className="h-3.5 w-3.5" />
        </div>
        <span className="font-medium">Publicando como</span>
        <span className="font-bold text-primary">{serviceMeta.label}</span>
        <button
          type="button"
          onClick={onBack}
          className="ml-auto text-primary hover:underline"
        >
          Cambiar
        </button>
      </div>

      {!isLoggedIn ? (
        <div className="border-b bg-amber-500/10 px-6 py-2 text-xs text-amber-200">
          Inicia sesión para autocompletar tus datos.
        </div>
      ) : (
        <div className="flex items-center gap-2 border-b bg-emerald-500/10 px-6 py-2 text-xs text-emerald-300">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Datos prellenados con tu cuenta · {userEmail}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
        <SheetBody className="space-y-5">
          {config.intro && (
            <p className="text-xs text-muted-foreground">{config.intro}</p>
          )}

          {/* Photo */}
          <Field>
            <Label>Foto principal</Label>
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

          {/* Identity */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <Label htmlFor="name">
                {config.showPartner ? "Nombre 1" : "Nombre artístico"}
              </Label>
              <Input
                id="name"
                required
                placeholder="Ej. Sofía Luxe"
                value={draft.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="age">
                {config.showPartner ? "Edad 1" : "Edad"}
              </Label>
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

          {config.showPartner && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <Label htmlFor="partner-name">Nombre 2</Label>
                <Input
                  id="partner-name"
                  placeholder="Nombre del/la otra"
                  value={draft.partnerName}
                  onChange={(e) => update("partnerName", e.target.value)}
                />
              </Field>
              <Field>
                <Label htmlFor="partner-age">Edad 2</Label>
                <Input
                  id="partner-age"
                  type="number"
                  min={18}
                  max={70}
                  placeholder="27"
                  value={draft.partnerAge}
                  onChange={(e) => update("partnerAge", e.target.value)}
                />
              </Field>
            </div>
          )}

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

          {/* Physical (only when relevant) */}
          {config.showPhysical && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field>
                  <Label>Tipo de cuerpo</Label>
                  <SimpleSelect
                    options={BODY_TYPE_OPTIONS.map((o) => ({
                      value: o.value,
                      label: o.label,
                    }))}
                    value={draft.bodyType}
                    onChange={(v) => update("bodyType", v as BodyType)}
                    placeholder="Seleccionar..."
                  />
                </Field>
                <Field>
                  <Label>Cabello</Label>
                  <SimpleSelect
                    options={HAIR_COLOR_OPTIONS.map((o) => ({
                      value: o.value,
                      label: o.label,
                    }))}
                    value={draft.hairColor}
                    onChange={(v) => update("hairColor", v as HairColor)}
                    placeholder="Seleccionar..."
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field>
                  <Label>Etnia</Label>
                  <SimpleSelect
                    options={ETHNICITY_OPTIONS.map((o) => ({
                      value: o.value,
                      label: o.label,
                    }))}
                    value={draft.ethnicity}
                    onChange={(v) => update("ethnicity", v as Ethnicity)}
                    placeholder="Seleccionar..."
                  />
                </Field>
                <Field>
                  <Label htmlFor="height">Estatura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    min={140}
                    max={200}
                    placeholder="168"
                    value={draft.height}
                    onChange={(e) => update("height", e.target.value)}
                  />
                </Field>
              </div>
            </>
          )}

          {/* Role (trans, escorts-gay, fetiches) */}
          {config.role && (
            <Field>
              <Label>{config.role.label}</Label>
              <ChipsRow
                options={config.role.options}
                isActive={(v) => draft.role === v}
                onClick={(v) => update("role", v)}
              />
            </Field>
          )}

          {/* Specialties — main service-specific group */}
          {config.specialties && (
            <Field>
              <Label>{config.specialties.label}</Label>
              <MultiSelect
                options={config.specialties.options}
                values={draft.specialties}
                onChange={(v) => update("specialties", v)}
                placeholder={config.specialties.placeholder}
              />
            </Field>
          )}

          {/* Extras — secondary group */}
          {config.extras && (
            <Field>
              <Label>{config.extras.label}</Label>
              <MultiSelect
                options={config.extras.options}
                values={draft.extras}
                onChange={(v) => update("extras", v)}
                placeholder={config.extras.placeholder}
              />
            </Field>
          )}

          {/* Group capacity (despedidas) */}
          {config.showGroupCapacity && (
            <Field>
              <Label htmlFor="capacity">Capacidad máxima de invitados</Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                placeholder="20"
                value={draft.groupCapacity}
                onChange={(e) => update("groupCapacity", e.target.value)}
              />
            </Field>
          )}

          {/* Description */}
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

          {/* Pricing + contact */}
          {config.showPricePerHour && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <Label htmlFor="price">
                  {config.priceLabel ?? "Precio por hora (COP miles)"}
                </Label>
                <Input
                  id="price"
                  required
                  type="number"
                  min={50}
                  step={10}
                  placeholder="250"
                  value={draft.price}
                  onChange={(e) => update("price", e.target.value)}
                />
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
          )}
          {!config.showPricePerHour && (
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
          )}

          {/* Plan */}
          <Field>
            <Label>Plan</Label>
            <ChipsRow
              options={tierChips}
              isActive={(v) => draft.tier === v}
              onClick={(v) => update("tier", v as Tier)}
            />
            <p className="text-xs text-muted-foreground">
              Los planes Platino y Oro aparecen en Destacados y Recomendados con
              prioridad.
            </p>
          </Field>

          {/* Encounter + payment + languages */}
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
            <Label>Métodos de pago</Label>
            <MultiSelect
              options={PAYMENT_OPTIONS}
              values={draft.paymentMethods}
              onChange={(v) => update("paymentMethods", v)}
              placeholder="Selecciona uno o más"
            />
          </Field>

          <Field>
            <Label>Idiomas</Label>
            <MultiSelect
              options={LANGUAGE_OPTIONS}
              values={draft.languages}
              onChange={(v) => update("languages", v)}
              placeholder="Selecciona los que hablas"
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
            onClick={onBack}
            className="sm:mr-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Atrás
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" variant="brand">
            Publicar perfil
          </Button>
        </SheetFooter>
      </form>
    </>
  );
}

/* -------------------- Shared bits -------------------- */

function SessionBanner({
  isLoggedIn,
  userEmail,
  onLogin,
}: {
  isLoggedIn: boolean;
  userEmail?: string;
  onLogin: () => void;
}) {
  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-2 border-b bg-emerald-500/10 px-6 py-2 text-xs text-emerald-300">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Datos prellenados con tu cuenta · {userEmail}
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between gap-3 border-b bg-amber-500/10 px-6 py-2 text-xs text-amber-200">
      <span className="flex-1">
        Inicia sesión para autocompletar tus datos.
      </span>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={onLogin}
        className="h-7 gap-1.5 border-amber-300/30 bg-amber-500/10 text-amber-100 hover:bg-amber-500/20"
      >
        <LogIn className="h-3.5 w-3.5" />
        Iniciar sesión
      </Button>
    </div>
  );
}

function Field({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

function ChipsRow({
  options,
  isActive,
  onClick,
}: {
  options: { value: string; label: string }[];
  isActive: (v: string) => boolean;
  onClick: (v: string) => void;
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
