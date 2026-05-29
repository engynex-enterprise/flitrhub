"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  Crown,
  Globe,
  MapPin,
  Megaphone,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import { Switch } from "@/shared/components/ui/switch";
import { formatCOP } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";
import {
  AD_PRODUCT_CATALOG,
  type AdProductId,
  type AdProductMeta,
} from "@/features/home/components/ads";

/* -------------------- Options -------------------- */

const CITIES = [
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Bucaramanga",
  "Pereira",
  "Santa Marta",
];

const SERVICES = [
  "Masajes",
  "Escorts",
  "Webcam",
  "Parejas",
  "Despedidas",
  "Contactos",
];

const LANGUAGES = [
  { id: "es", label: "Español" },
  { id: "en", label: "Inglés" },
  { id: "pt", label: "Portugués" },
];

const TIERS = [
  { id: "platino", label: "Platino" },
  { id: "oro", label: "Oro" },
  { id: "plata", label: "Plata" },
  { id: "basico", label: "Básico" },
];

const SLOTS = [
  { id: "manana", label: "Mañana" },
  { id: "tarde", label: "Tarde" },
  { id: "noche", label: "Noche" },
  { id: "madrugada", label: "Madrugada" },
];

const WEEK_DAYS = ["L", "M", "M", "J", "V", "S", "D"];

const MY_POSTS = [
  { id: "p_sofia", name: "Sofía · masajes en Bogotá", tier: "Platino" },
  { id: "p_valentina", name: "Valentina · masajes en Bogotá", tier: "Plus" },
  { id: "p_camila", name: "Camila · escorts en Bogotá", tier: "Plus" },
  { id: "p_daniela", name: "Daniela · escorts en Bogotá", tier: "Básico" },
];

const BID_STRATEGIES = [
  {
    id: "cpc",
    label: "CPC",
    title: "Pagar por clic",
    desc: "Ideal si buscas tráfico al perfil",
  },
  {
    id: "cpm",
    label: "CPM",
    title: "Pagar por mil impresiones",
    desc: "Para maximizar visibilidad",
  },
  {
    id: "cpa",
    label: "CPA",
    title: "Pagar por contacto",
    desc: "Solo pagas cuando hay conversión",
  },
] as const;

type BidStrategy = (typeof BID_STRATEGIES)[number]["id"];
type VisitorKind = "all" | "new" | "returning";

interface TargetingState {
  product: AdProductId;
  postId: string;
  cities: string[];
  radiusKm: number;
  ageMin: number;
  ageMax: number;
  languages: string[];
  services: string[];
  tiers: string[];
  visitor: VisitorKind;
  slots: string[];
  days: number[];
  lookalike: boolean;
  retargeting: boolean;
  dailyBudget: number;
  durationDays: number;
  bidStrategy: BidStrategy;
}

const DEFAULT_STATE: TargetingState = {
  product: "search-top",
  postId: MY_POSTS[0].id,
  cities: ["Bogotá"],
  radiusKm: 15,
  ageMin: 25,
  ageMax: 45,
  languages: ["es"],
  services: ["Masajes"],
  tiers: ["platino", "oro"],
  visitor: "all",
  slots: ["tarde", "noche"],
  days: [1, 2, 3, 4, 5, 6, 0],
  lookalike: false,
  retargeting: true,
  dailyBudget: 25_000,
  durationDays: 7,
  bidStrategy: "cpc",
};

/* -------------------- Component -------------------- */

interface AdTargetingDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProduct?: AdProductId;
}

export function AdTargetingDrawer({
  open,
  onOpenChange,
  initialProduct,
}: AdTargetingDrawerProps) {
  const [state, setState] = useState<TargetingState>({
    ...DEFAULT_STATE,
    product: initialProduct ?? DEFAULT_STATE.product,
  });

  // Pre-select product when opened from a specific marketplace card without
  // resetting other targeting choices the user already configured.
  useEffect(() => {
    if (open && initialProduct && initialProduct !== state.product) {
      setState((prev) => ({ ...prev, product: initialProduct }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialProduct]);

  const update = <K extends keyof TargetingState>(
    key: K,
    value: TargetingState[K]
  ) => setState((prev) => ({ ...prev, [key]: value }));

  const toggleArrayItem = <T,>(
    arr: T[],
    item: T,
    setter: (next: T[]) => void
  ) => {
    setter(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
  };

  const product = useMemo(
    () => AD_PRODUCT_CATALOG.find((p) => p.id === state.product)!,
    [state.product]
  );

  // Crude reach estimator — purely visual, scales with audience width and budget.
  const estimate = useMemo(() => computeEstimate(state), [state]);

  const totalBudget = state.dailyBudget * state.durationDays;

  const reset = () =>
    setState({
      ...DEFAULT_STATE,
      product: initialProduct ?? DEFAULT_STATE.product,
    });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col sm:max-w-lg md:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Nueva campaña
          </SheetTitle>
          <SheetDescription>
            Configura quién verá tu anuncio, por cuánto tiempo y con qué
            presupuesto. Estilo Facebook & Google Ads.
          </SheetDescription>
        </SheetHeader>

        <SheetBody className="flex-1 space-y-6 overflow-y-auto px-6 py-4">
          {/* Product */}
          <Section
            icon={Megaphone}
            title="Producto"
            subtitle="Elige el formato de tu anuncio"
          >
            <div className="grid gap-2">
              {AD_PRODUCT_CATALOG.slice(0, 6).map((p) => (
                <ProductOption
                  key={p.id}
                  product={p}
                  active={state.product === p.id}
                  onClick={() => update("product", p.id)}
                />
              ))}
            </div>
          </Section>

          {/* Post */}
          <Section
            icon={Sparkles}
            title="Publicación a promocionar"
            subtitle="A qué perfil aplicará esta campaña"
          >
            <select
              value={state.postId}
              onChange={(e) => update("postId", e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {MY_POSTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Section>

          {/* Geographic */}
          <Section
            icon={MapPin}
            title="Audiencia geográfica"
            subtitle="Dónde aparecerá tu campaña"
          >
            <div className="space-y-3">
              <div>
                <Label className="mb-1.5 block text-xs">Ciudades</Label>
                <div className="flex flex-wrap gap-1.5">
                  {CITIES.map((c) => (
                    <ChipToggle
                      key={c}
                      active={state.cities.includes(c)}
                      onClick={() =>
                        toggleArrayItem(state.cities, c, (next) =>
                          update("cities", next)
                        )
                      }
                    >
                      {c}
                    </ChipToggle>
                  ))}
                </div>
              </div>
              <RangeRow
                label="Radio desde el centro"
                min={1}
                max={50}
                value={state.radiusKm}
                onChange={(v) => update("radiusKm", v)}
                suffix="km"
              />
            </div>
          </Section>

          {/* Demographics */}
          <Section
            icon={Users}
            title="Demografía"
            subtitle="Rango etario e idiomas"
          >
            <div className="space-y-3">
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <Label>Edad</Label>
                  <span className="font-semibold tabular-nums">
                    {state.ageMin} – {state.ageMax} años
                  </span>
                </div>
                <DualRange
                  min={18}
                  max={70}
                  low={state.ageMin}
                  high={state.ageMax}
                  onChangeLow={(v) =>
                    update("ageMin", Math.min(v, state.ageMax - 1))
                  }
                  onChangeHigh={(v) =>
                    update("ageMax", Math.max(v, state.ageMin + 1))
                  }
                />
              </div>
              <div>
                <Label className="mb-1.5 block text-xs">Idiomas</Label>
                <div className="flex flex-wrap gap-1.5">
                  {LANGUAGES.map((l) => (
                    <ChipToggle
                      key={l.id}
                      active={state.languages.includes(l.id)}
                      onClick={() =>
                        toggleArrayItem(state.languages, l.id, (next) =>
                          update("languages", next)
                        )
                      }
                    >
                      <Globe className="h-2.5 w-2.5" />
                      {l.label}
                    </ChipToggle>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Interests */}
          <Section
            icon={Sparkles}
            title="Intereses"
            subtitle="Categorías y tiers que les interesan"
          >
            <div className="space-y-3">
              <div>
                <Label className="mb-1.5 block text-xs">
                  Servicios que han visto
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {SERVICES.map((s) => (
                    <ChipToggle
                      key={s}
                      active={state.services.includes(s)}
                      onClick={() =>
                        toggleArrayItem(state.services, s, (next) =>
                          update("services", next)
                        )
                      }
                    >
                      {s}
                    </ChipToggle>
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-1.5 block text-xs">Tier objetivo</Label>
                <div className="flex flex-wrap gap-1.5">
                  {TIERS.map((t) => (
                    <ChipToggle
                      key={t.id}
                      active={state.tiers.includes(t.id)}
                      onClick={() =>
                        toggleArrayItem(state.tiers, t.id, (next) =>
                          update("tiers", next)
                        )
                      }
                    >
                      <Crown className="h-2.5 w-2.5" />
                      {t.label}
                    </ChipToggle>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Behavior */}
          <Section
            icon={TrendingUp}
            title="Comportamiento"
            subtitle="Cómo interactúan con la plataforma"
          >
            <div className="space-y-3">
              <div>
                <Label className="mb-1.5 block text-xs">
                  Tipo de visitante
                </Label>
                <div className="grid grid-cols-3 gap-1.5">
                  <RadioPill
                    active={state.visitor === "all"}
                    onClick={() => update("visitor", "all")}
                  >
                    Todos
                  </RadioPill>
                  <RadioPill
                    active={state.visitor === "new"}
                    onClick={() => update("visitor", "new")}
                  >
                    Nuevos
                  </RadioPill>
                  <RadioPill
                    active={state.visitor === "returning"}
                    onClick={() => update("visitor", "returning")}
                  >
                    Recurrentes
                  </RadioPill>
                </div>
              </div>
              <div>
                <Label className="mb-1.5 block text-xs">Bloques horarios</Label>
                <div className="flex flex-wrap gap-1.5">
                  {SLOTS.map((s) => (
                    <ChipToggle
                      key={s.id}
                      active={state.slots.includes(s.id)}
                      onClick={() =>
                        toggleArrayItem(state.slots, s.id, (next) =>
                          update("slots", next)
                        )
                      }
                    >
                      <Clock className="h-2.5 w-2.5" />
                      {s.label}
                    </ChipToggle>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Schedule */}
          <Section
            icon={Calendar}
            title="Días activos"
            subtitle="Cuándo correr el anuncio durante la semana"
          >
            <div className="flex flex-wrap gap-1.5">
              {WEEK_DAYS.map((d, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() =>
                    toggleArrayItem(state.days, i, (next) =>
                      update("days", next)
                    )
                  }
                  className={cn(
                    "h-9 w-9 rounded-full border text-xs font-bold transition-colors",
                    state.days.includes(i)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-accent"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </Section>

          {/* Custom audiences */}
          <Section
            icon={Users}
            title="Audiencias personalizadas"
            subtitle="Estrategias avanzadas"
          >
            <div className="space-y-2">
              <ToggleRow
                title="Lookalike de tus mejores clientes"
                description="Busca usuarios parecidos a quienes ya te contactaron."
                checked={state.lookalike}
                onChange={(v) => update("lookalike", v)}
              />
              <ToggleRow
                title="Retargeting"
                description="Vuelve a impactar a quienes vieron tu perfil pero no contactaron."
                checked={state.retargeting}
                onChange={(v) => update("retargeting", v)}
              />
            </div>
          </Section>

          {/* Budget */}
          <Section
            icon={Megaphone}
            title="Presupuesto y puja"
            subtitle="Cuánto y cómo gastar"
          >
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="daily-budget" className="mb-1.5 block text-xs">
                    Diario (COP)
                  </Label>
                  <Input
                    id="daily-budget"
                    type="number"
                    min={5_000}
                    step={1_000}
                    value={state.dailyBudget}
                    onChange={(e) =>
                      update("dailyBudget", Number(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="duration" className="mb-1.5 block text-xs">
                    Duración (días)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min={1}
                    max={90}
                    value={state.durationDays}
                    onChange={(e) =>
                      update("durationDays", Number(e.target.value) || 1)
                    }
                  />
                </div>
              </div>
              <div className="rounded-md bg-muted/40 px-3 py-2 text-xs">
                Presupuesto total:{" "}
                <span className="font-bold text-emerald-400">
                  {formatCOP(totalBudget)}
                </span>
              </div>

              <div>
                <Label className="mb-1.5 block text-xs">
                  Estrategia de puja
                </Label>
                <div className="grid gap-2">
                  {BID_STRATEGIES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => update("bidStrategy", s.id)}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border p-2.5 text-left transition-colors",
                        state.bidStrategy === s.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-accent"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                          state.bidStrategy === s.id
                            ? "border-primary bg-primary"
                            : "border-border"
                        )}
                      >
                        {state.bidStrategy === s.id && (
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold">
                          {s.label} · {s.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {s.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Summary */}
          <EstimateCard
            reach={estimate.reach}
            impressions={estimate.impressions}
            clicks={estimate.clicks}
            cpc={estimate.cpc}
            contacts={estimate.contacts}
            product={product}
            totalBudget={totalBudget}
          />
        </SheetBody>

        <SheetFooter className="border-t bg-background px-6 py-3">
          <div className="flex w-full items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
              className="gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Resetear
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="brand"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="gap-1.5"
              >
                Crear campaña ·{" "}
                <span className="font-bold">{formatCOP(totalBudget)}</span>
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/* -------------------- Estimator -------------------- */

function computeEstimate(s: TargetingState) {
  // Width factor: more options selected → wider audience.
  const cityFactor = Math.min(s.cities.length, 5) / 5;
  const ageWidth = (s.ageMax - s.ageMin) / 50;
  const langFactor = Math.min(s.languages.length, 3) / 3;
  const tierFactor = Math.min(s.tiers.length, 4) / 4;
  const slotFactor = Math.min(s.slots.length, 4) / 4;
  const dayFactor = Math.min(s.days.length, 7) / 7;
  const visitorFactor = s.visitor === "all" ? 1 : 0.6;
  const lookalikeFactor = s.lookalike ? 1.2 : 1;
  const retargetingFactor = s.retargeting ? 1.1 : 1;

  const width =
    (cityFactor * 0.25 +
      ageWidth * 0.15 +
      langFactor * 0.1 +
      tierFactor * 0.15 +
      slotFactor * 0.1 +
      dayFactor * 0.15 +
      visitorFactor * 0.1) *
    lookalikeFactor *
    retargetingFactor;

  const totalBudget = s.dailyBudget * s.durationDays;
  // Heuristic: 1k COP buys ~80 impressions for CPM, scaled by width.
  const imprPerPeso = 0.08 * (0.7 + width);
  const impressions = Math.round(totalBudget * imprPerPeso);
  const ctr = 0.06 + width * 0.04;
  const clicks = Math.round(impressions * ctr);
  const reach = Math.round(impressions * 0.55);
  const cpc = clicks ? Math.round(totalBudget / clicks) : 0;
  const convRate = 0.07;
  const contacts = Math.round(clicks * convRate);

  return { reach, impressions, clicks, cpc, contacts };
}

/* -------------------- Estimate card -------------------- */

function EstimateCard({
  reach,
  impressions,
  clicks,
  cpc,
  contacts,
  product,
  totalBudget,
}: {
  reach: number;
  impressions: number;
  clicks: number;
  cpc: number;
  contacts: number;
  product: AdProductMeta;
  totalBudget: number;
}) {
  return (
    <Card className="bg-gradient-sensual relative overflow-hidden border-primary/30 p-4">
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/30 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2 text-gold">
          <TrendingUp className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Estimación
          </span>
        </div>
        <p className="mt-1 text-sm font-bold text-white">
          {product.name} · {formatCOP(totalBudget)} total
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
          <EstStat label="Alcance" value={fmtK(reach)} />
          <EstStat label="Impres." value={fmtK(impressions)} />
          <EstStat label="Clics" value={fmtK(clicks)} />
          <EstStat label="CPC" value={formatCOP(cpc)} />
          <EstStat label="Contactos" value={String(contacts)} />
        </div>
      </div>
    </Card>
  );
}

function EstStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/[0.06] p-2 backdrop-blur">
      <p className="text-[9px] uppercase tracking-wider text-white/60">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold tabular-nums text-white">{value}</p>
    </div>
  );
}

function fmtK(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString("es-CO");
}

/* -------------------- Building blocks -------------------- */

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: typeof Target;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <div>
        <h3 className="flex items-center gap-1.5 text-sm font-bold">
          <Icon className="h-3.5 w-3.5 text-primary" />
          {title}
        </h3>
        {subtitle && (
          <p className="text-[11px] text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function ProductOption({
  product,
  active,
  onClick,
}: {
  product: AdProductMeta;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = product.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg border p-2.5 text-left transition-colors",
        active
          ? "border-primary bg-primary/10"
          : "border-border hover:bg-accent"
      )}
    >
      <span
        className={cn(
          "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
          active ? "border-primary bg-primary" : "border-border"
        )}
      >
        {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>
      <Icon className="h-4 w-4 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold">{product.name}</p>
        <p className="text-[10px] text-muted-foreground">{product.estReach}</p>
      </div>
      <span className="shrink-0 text-xs font-bold text-foreground">
        {formatCOP(product.price)}
        <span className="ml-0.5 text-[10px] font-normal text-muted-foreground">
          /{product.durationDays}d
        </span>
      </span>
    </button>
  );
}

function ChipToggle({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:bg-accent"
      )}
    >
      {children}
    </button>
  );
}

function RadioPill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:bg-accent"
      )}
    >
      {children}
    </button>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border p-3">
      <div className="min-w-0">
        <p className="text-xs font-bold">{title}</p>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function RangeRow({
  label,
  min,
  max,
  value,
  onChange,
  suffix,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <Label>{label}</Label>
        <span className="font-semibold tabular-nums">
          {value} {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
}

function DualRange({
  min,
  max,
  low,
  high,
  onChangeLow,
  onChangeHigh,
}: {
  min: number;
  max: number;
  low: number;
  high: number;
  onChangeLow: (v: number) => void;
  onChangeHigh: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <input
        type="range"
        min={min}
        max={max}
        value={low}
        onChange={(e) => onChangeLow(Number(e.target.value))}
        className="w-full accent-primary"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={high}
        onChange={(e) => onChangeHigh(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
}
