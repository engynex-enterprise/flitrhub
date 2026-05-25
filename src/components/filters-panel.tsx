"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
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

  const toggleInArray = <T,>(arr: T[], value: T): T[] =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const activeCount = countActiveFilters(filters);

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

      <div className="scrollbar-hide flex-1 space-y-1 overflow-y-auto p-4">
        {/* Always-visible quick filters */}
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
          <Select
            value={filters.sort}
            onChange={(e) => update("sort", e.target.value as Filters["sort"])}
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Categoría */}
        <Section title="Categoría" defaultOpen>
          <FieldLabel>Plan</FieldLabel>
          <ChipsRow
            options={TIER_OPTIONS}
            isActive={(v) => filters.tier === v}
            onClick={(v) => update("tier", v)}
          />
          <ToggleRow
            label="Solo destacados"
            description="Perfiles con prioridad en Destacados"
            checked={filters.featuredOnly}
            onChange={(v) => update("featuredOnly", v)}
          />
        </Section>

        {/* Ubicación */}
        <Section title="Ubicación" defaultOpen>
          <FieldLabel>Zonas (selección múltiple)</FieldLabel>
          <ChipsWrap
            options={ZONES.map((z) => ({ value: z, label: z }))}
            isActive={(v) => filters.zones.includes(v)}
            onClick={(v) => update("zones", toggleInArray(filters.zones, v))}
          />

          <FieldLabel>Distancia</FieldLabel>
          <Select
            value={String(filters.distanceKm ?? "all")}
            onChange={(e) => {
              const v = e.target.value;
              update("distanceKm", v === "all" ? null : Number(v));
            }}
          >
            {DISTANCE_OPTIONS.map((d) => (
              <option key={String(d.value)} value={d.value === null ? "all" : d.value}>
                {d.label}
              </option>
            ))}
          </Select>

          <FieldLabel>Tipo de encuentro</FieldLabel>
          <ChipsWrap
            options={SERVICE_LOCATION_OPTIONS}
            isActive={(v) => filters.serviceLocations.includes(v)}
            onClick={(v) =>
              update("serviceLocations", toggleInArray(filters.serviceLocations, v))
            }
          />
        </Section>

        {/* Edad y físico */}
        <Section title="Edad y físico">
          <FieldLabel>Edad</FieldLabel>
          <Select
            value={filters.ageRange}
            onChange={(e) =>
              update("ageRange", e.target.value as Filters["ageRange"])
            }
          >
            {AGE_OPTIONS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </Select>

          <FieldLabel>Estatura</FieldLabel>
          <Select
            value={filters.heightRange}
            onChange={(e) =>
              update("heightRange", e.target.value as Filters["heightRange"])
            }
          >
            {HEIGHT_OPTIONS.map((h) => (
              <option key={h.value} value={h.value}>
                {h.label}
              </option>
            ))}
          </Select>

          <FieldLabel>Tipo de cuerpo</FieldLabel>
          <ChipsWrap
            options={BODY_TYPE_OPTIONS}
            isActive={(v) => filters.bodyTypes.includes(v)}
            onClick={(v) =>
              update("bodyTypes", toggleInArray(filters.bodyTypes, v))
            }
          />

          <FieldLabel>Cabello</FieldLabel>
          <ChipsWrap
            options={HAIR_COLOR_OPTIONS}
            isActive={(v) => filters.hairColors.includes(v)}
            onClick={(v) =>
              update("hairColors", toggleInArray(filters.hairColors, v))
            }
          />

          <FieldLabel>Etnia</FieldLabel>
          <ChipsWrap
            options={ETHNICITY_OPTIONS}
            isActive={(v) => filters.ethnicities.includes(v)}
            onClick={(v) =>
              update("ethnicities", toggleInArray(filters.ethnicities, v))
            }
          />
        </Section>

        {/* Atributos */}
        <Section title="Atributos">
          <FieldLabel>Senos</FieldLabel>
          <Select
            value={filters.breasts}
            onChange={(e) =>
              update("breasts", e.target.value as Filters["breasts"])
            }
          >
            {BREASTS_OPTIONS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </Select>

          <FieldLabel>Tatuajes</FieldLabel>
          <Select
            value={filters.tattoos}
            onChange={(e) =>
              update("tattoos", e.target.value as Filters["tattoos"])
            }
          >
            {TRI_STATE_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>

          <FieldLabel>Piercings</FieldLabel>
          <Select
            value={filters.piercings}
            onChange={(e) =>
              update("piercings", e.target.value as Filters["piercings"])
            }
          >
            {TRI_STATE_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </Section>

        {/* Idiomas */}
        <Section title="Idiomas">
          <ChipsWrap
            options={LANGUAGE_OPTIONS}
            isActive={(v) => filters.languages.includes(v)}
            onClick={(v) =>
              update("languages", toggleInArray(filters.languages, v))
            }
          />
        </Section>

        {/* Disponibilidad */}
        <Section title="Disponibilidad">
          <FieldLabel>Horario</FieldLabel>
          <ChipsWrap
            options={TIME_SLOT_OPTIONS}
            isActive={(v) => filters.availabilitySlots.includes(v)}
            onClick={(v) =>
              update(
                "availabilitySlots",
                toggleInArray(filters.availabilitySlots, v)
              )
            }
          />
          <ToggleRow
            label="En línea ahora"
            description="Disponibles en este momento"
            checked={filters.onlineOnly}
            onChange={(v) => update("onlineOnly", v)}
          />
        </Section>

        {/* Precio y pago */}
        <Section title="Precio y pago">
          <FieldLabel>Precio máx. por hora</FieldLabel>
          <Select
            value={String(filters.maxPrice ?? "all")}
            onChange={(e) => {
              const v = e.target.value;
              update("maxPrice", v === "all" ? null : Number(v));
            }}
          >
            {PRICE_PRESETS.map((p) => (
              <option key={String(p.value)} value={p.value === null ? "all" : p.value}>
                {p.label}
              </option>
            ))}
          </Select>

          <FieldLabel>Métodos de pago aceptados</FieldLabel>
          <ChipsWrap
            options={PAYMENT_OPTIONS}
            isActive={(v) => filters.paymentMethods.includes(v)}
            onClick={(v) =>
              update("paymentMethods", toggleInArray(filters.paymentMethods, v))
            }
          />
        </Section>

        {/* Calidad y confianza */}
        <Section title="Calidad y confianza">
          <FieldLabel>Rating mínimo</FieldLabel>
          <Select
            value={String(filters.minRating ?? "all")}
            onChange={(e) => {
              const v = e.target.value;
              update("minRating", v === "all" ? null : Number(v));
            }}
          >
            {RATING_OPTIONS.map((r) => (
              <option key={String(r.value)} value={r.value === null ? "all" : r.value}>
                {r.label}
              </option>
            ))}
          </Select>

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
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-border/60 first:border-t-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3 text-left text-xs font-bold uppercase tracking-wider text-foreground hover:text-primary"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && <div className="space-y-3 pb-4">{children}</div>}
    </div>
  );
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
        <Chip
          key={opt.value}
          label={opt.label}
          active={isActive(opt.value)}
          onClick={() => onClick(opt.value)}
        />
      ))}
    </div>
  );
}

function ChipsWrap<T extends string>({
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
        <Chip
          key={opt.value}
          label={opt.label}
          active={isActive(opt.value)}
          onClick={() => onClick(opt.value)}
        />
      ))}
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-accent"
      )}
    >
      {label}
    </button>
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
