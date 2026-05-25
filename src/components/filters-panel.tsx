"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Crown,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Wifi,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { SimpleSelect } from "@/components/ui/simple-select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  AGE_OPTIONS,
  BODY_TYPE_OPTIONS,
  BREASTS_OPTIONS,
  DEFAULT_FILTERS,
  DISTANCE_OPTIONS,
  ETHNICITY_OPTIONS,
  HAIR_COLOR_OPTIONS,
  HEIGHT_OPTIONS,
  LANGUAGE_OPTIONS,
  PAYMENT_OPTIONS,
  PRICE_PRESETS,
  RATING_OPTIONS,
  SERVICE_LOCATION_OPTIONS,
  SORT_OPTIONS,
  TIER_OPTIONS,
  TIME_SLOT_OPTIONS,
  TRI_STATE_OPTIONS,
  ZONES,
  countActiveFilters,
  type Filters,
} from "@/lib/filters";

interface FiltersPanelProps {
  filters: Filters;
  onChange: (next: Filters) => void;
  open: boolean;
  onClose: () => void;
}

export function FiltersPanel({ filters, onChange, open, onClose }: FiltersPanelProps) {
  const update = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value });

  const activeCount = countActiveFilters(filters);

  const zoneOptions = ZONES.map((z) => ({ value: z, label: z }));

  return (
    <aside
      className={cn(
        "fixed inset-y-0 right-0 top-16 z-30 flex w-80 flex-col border-l bg-background transition-transform duration-300",
        open ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Filtros</h2>
          {activeCount > 0 && (
            <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
              {activeCount}
            </span>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar filtros">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto p-4">
        {/* Quick filters — pinned, prominent */}
        <div className="grid grid-cols-2 gap-2 pb-4">
          <QuickToggle
            icon={Crown}
            label="Solo destacados"
            sublabel="Perfiles Premium"
            active={filters.featuredOnly}
            onClick={() => update("featuredOnly", !filters.featuredOnly)}
            tone="gold"
          />
          <QuickToggle
            icon={Wifi}
            label="Solo en línea"
            sublabel="Activas ahora"
            active={filters.onlineOnly}
            onClick={() => update("onlineOnly", !filters.onlineOnly)}
            tone="emerald"
          />
        </div>

        <div className="space-y-3 pb-4">
          <FieldLabel>Buscar</FieldLabel>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={(e) => update("search", e.target.value)}
              placeholder="Nombre del perfil..."
              className="pl-9"
            />
          </div>

          <FieldLabel>Ordenar por</FieldLabel>
          <SimpleSelect
            options={SORT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            value={filters.sort}
            onChange={(v) => update("sort", v as Filters["sort"])}
          />
        </div>

        <Section title="Categoría" defaultOpen>
          <FieldLabel>Plan</FieldLabel>
          <SimpleSelect
            options={TIER_OPTIONS.map((t) => ({ value: t.value, label: t.label }))}
            value={filters.tier}
            onChange={(v) => update("tier", v as Filters["tier"])}
          />
        </Section>

        <Section title="Ubicación" defaultOpen>
          <FieldLabel>Zonas</FieldLabel>
          <MultiSelect
            options={zoneOptions}
            values={filters.zones}
            onChange={(v) => update("zones", v)}
            placeholder="Todas las zonas"
          />

          <FieldLabel>Distancia</FieldLabel>
          <SimpleSelect
            options={DISTANCE_OPTIONS.map((d) => ({
              value: d.value === null ? "all" : String(d.value),
              label: d.label,
            }))}
            value={filters.distanceKm === null ? "all" : String(filters.distanceKm)}
            onChange={(v) => update("distanceKm", v === "all" ? null : Number(v))}
          />

          <FieldLabel>Tipo de encuentro</FieldLabel>
          <MultiSelect
            options={SERVICE_LOCATION_OPTIONS}
            values={filters.serviceLocations}
            onChange={(v) => update("serviceLocations", v)}
            placeholder="Cualquiera"
          />
        </Section>

        <Section title="Edad y físico">
          <FieldLabel>Edad</FieldLabel>
          <SimpleSelect
            options={AGE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            value={filters.ageRange}
            onChange={(v) => update("ageRange", v as Filters["ageRange"])}
          />

          <FieldLabel>Estatura</FieldLabel>
          <SimpleSelect
            options={HEIGHT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            value={filters.heightRange}
            onChange={(v) => update("heightRange", v as Filters["heightRange"])}
          />

          <FieldLabel>Tipo de cuerpo</FieldLabel>
          <MultiSelect
            options={BODY_TYPE_OPTIONS}
            values={filters.bodyTypes}
            onChange={(v) => update("bodyTypes", v)}
            placeholder="Cualquier cuerpo"
          />

          <FieldLabel>Cabello</FieldLabel>
          <MultiSelect
            options={HAIR_COLOR_OPTIONS}
            values={filters.hairColors}
            onChange={(v) => update("hairColors", v)}
            placeholder="Cualquier cabello"
          />

          <FieldLabel>Etnia</FieldLabel>
          <MultiSelect
            options={ETHNICITY_OPTIONS}
            values={filters.ethnicities}
            onChange={(v) => update("ethnicities", v)}
            placeholder="Cualquier etnia"
          />
        </Section>

        <Section title="Atributos">
          <FieldLabel>Senos</FieldLabel>
          <SimpleSelect
            options={BREASTS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            value={filters.breasts}
            onChange={(v) => update("breasts", v as Filters["breasts"])}
          />

          <FieldLabel>Tatuajes</FieldLabel>
          <SimpleSelect
            options={TRI_STATE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            value={filters.tattoos}
            onChange={(v) => update("tattoos", v as Filters["tattoos"])}
          />

          <FieldLabel>Piercings</FieldLabel>
          <SimpleSelect
            options={TRI_STATE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            value={filters.piercings}
            onChange={(v) => update("piercings", v as Filters["piercings"])}
          />
        </Section>

        <Section title="Idiomas">
          <MultiSelect
            options={LANGUAGE_OPTIONS}
            values={filters.languages}
            onChange={(v) => update("languages", v)}
            placeholder="Cualquier idioma"
          />
        </Section>

        <Section title="Disponibilidad">
          <FieldLabel>Horario</FieldLabel>
          <MultiSelect
            options={TIME_SLOT_OPTIONS}
            values={filters.availabilitySlots}
            onChange={(v) => update("availabilitySlots", v)}
            placeholder="Cualquier horario"
          />
        </Section>

        <Section title="Precio y pago">
          <FieldLabel>Precio máx. por hora</FieldLabel>
          <SimpleSelect
            options={PRICE_PRESETS.map((p) => ({
              value: p.value === null ? "all" : String(p.value),
              label: p.label,
            }))}
            value={filters.maxPrice === null ? "all" : String(filters.maxPrice)}
            onChange={(v) => update("maxPrice", v === "all" ? null : Number(v))}
          />

          <FieldLabel>Métodos de pago</FieldLabel>
          <MultiSelect
            options={PAYMENT_OPTIONS}
            values={filters.paymentMethods}
            onChange={(v) => update("paymentMethods", v)}
            placeholder="Cualquiera"
          />
        </Section>

        <Section title="Calidad y confianza">
          <FieldLabel>Rating mínimo</FieldLabel>
          <SimpleSelect
            options={RATING_OPTIONS.map((r) => ({
              value: r.value === null ? "all" : String(r.value),
              label: r.label,
            }))}
            value={filters.minRating === null ? "all" : String(filters.minRating)}
            onChange={(v) => update("minRating", v === "all" ? null : Number(v))}
          />

          <ToggleRow
            label="Con video"
            description="Perfiles con video de presentación"
            checked={filters.withVideo}
            onChange={(v) => update("withVideo", v)}
          />
          <ToggleRow
            label="Verificados"
            description="Identidad confirmada por la plataforma"
            checked={filters.verifiedOnly}
            onChange={(v) => update("verifiedOnly", v)}
          />
          <ToggleRow
            label="Solo favoritos"
            description="Perfiles que guardaste"
            checked={filters.favoritesOnly}
            onChange={(v) => update("favoritesOnly", v)}
          />
        </Section>
      </div>

      <div className="border-t p-4">
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => onChange(DEFAULT_FILTERS)}
          disabled={activeCount === 0}
        >
          <RotateCcw className="h-4 w-4" />
          Restablecer filtros ({activeCount})
        </Button>
      </div>
    </aside>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </label>
  );
}

function Section({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [openState, setOpenState] = useState(defaultOpen);
  return (
    <div className="border-t border-border/60 first:border-t-0">
      <button
        type="button"
        onClick={() => setOpenState((v) => !v)}
        className="flex w-full items-center justify-between py-3 text-left text-xs font-bold uppercase tracking-wider text-foreground hover:text-primary"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            openState && "rotate-180"
          )}
        />
      </button>
      {openState && <div className="space-y-3 pb-4">{children}</div>}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-accent">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

function QuickToggle({
  icon: Icon,
  label,
  sublabel,
  active,
  onClick,
  tone,
}: {
  icon: typeof SlidersHorizontal;
  label: string;
  sublabel: string;
  active: boolean;
  onClick: () => void;
  tone: "gold" | "emerald";
}) {
  const toneStyles = {
    gold: {
      activeBg: "bg-gradient-to-br from-amber-500/25 to-amber-700/10 border-amber-400/60 shadow-[0_0_0_2px_rgba(245,180,80,0.18)]",
      icon: "text-gold",
      iconBg: "bg-amber-500/15",
    },
    emerald: {
      activeBg: "bg-gradient-to-br from-emerald-500/25 to-emerald-700/10 border-emerald-400/60 shadow-[0_0_0_2px_rgba(80,200,140,0.18)]",
      icon: "text-emerald-400",
      iconBg: "bg-emerald-500/15",
    },
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-all",
        active
          ? toneStyles.activeBg
          : "border-border bg-card hover:border-primary/30 hover:bg-accent"
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
            active ? toneStyles.iconBg : "bg-muted"
          )}
        >
          <Icon
            className={cn(
              "h-3.5 w-3.5 transition-colors",
              active ? toneStyles.icon : "text-muted-foreground"
            )}
          />
        </span>
        {active && (
          <span className="inline-flex h-4 items-center rounded-full bg-primary px-1.5 text-[9px] font-bold uppercase text-primary-foreground">
            On
          </span>
        )}
      </div>
      <p className="text-xs font-semibold">{label}</p>
      <p className="text-[10px] text-muted-foreground">{sublabel}</p>
    </button>
  );
}

export function FiltersOpenButton({
  onClick,
  activeCount,
}: {
  onClick: () => void;
  activeCount: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed right-4 top-20 z-20 flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-semibold shadow-md hover:bg-accent"
    >
      <SlidersHorizontal className="h-4 w-4 text-primary" />
      Filtros
      {activeCount > 0 && (
        <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
          {activeCount}
        </span>
      )}
    </button>
  );
}
