"use client";

import { useEffect, useState } from "react";
import { Heart, Sparkles, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  AGE_OPTIONS,
  BODY_TYPE_OPTIONS,
  DISTANCE_OPTIONS,
  ETHNICITY_OPTIONS,
  HAIR_COLOR_OPTIONS,
  LANGUAGE_OPTIONS,
  PRICE_PRESETS,
  SERVICE_LOCATION_OPTIONS,
  TIER_OPTIONS,
} from "@/lib/filters";
import {
  DEFAULT_PREFERENCES,
  type UserPreferences,
} from "@/lib/preferences";
import type { Tier } from "@/lib/mock-posts";

interface PreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefs: UserPreferences;
  onSave: (next: UserPreferences) => void;
  onClear: () => void;
}

export function PreferencesDialog({
  open,
  onOpenChange,
  prefs,
  onSave,
  onClear,
}: PreferencesDialogProps) {
  const [draft, setDraft] = useState<UserPreferences>(prefs);

  useEffect(() => {
    if (open) setDraft(prefs);
  }, [open, prefs]);

  const update = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => setDraft((d) => ({ ...d, [key]: value }));

  const toggle = <T,>(arr: T[], value: T): T[] =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const tierOptionsForPrefs = TIER_OPTIONS.filter((t) => t.value !== "all") as {
    value: Tier;
    label: string;
  }[];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Mis preferencias
          </DialogTitle>
          <DialogDescription>
            Cuéntanos qué buscas y te mostraremos los perfiles que mejor coinciden.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <Field>
            <Label>Edad ideal</Label>
            <Select
              value={draft.ageRange}
              onChange={(e) =>
                update("ageRange", e.target.value as UserPreferences["ageRange"])
              }
            >
              {AGE_OPTIONS.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            <Label>Tipo de cuerpo</Label>
            <ChipsWrap
              options={BODY_TYPE_OPTIONS}
              isActive={(v) => draft.bodyTypes.includes(v)}
              onClick={(v) => update("bodyTypes", toggle(draft.bodyTypes, v))}
            />
          </Field>

          <Field>
            <Label>Cabello</Label>
            <ChipsWrap
              options={HAIR_COLOR_OPTIONS}
              isActive={(v) => draft.hairColors.includes(v)}
              onClick={(v) => update("hairColors", toggle(draft.hairColors, v))}
            />
          </Field>

          <Field>
            <Label>Etnia</Label>
            <ChipsWrap
              options={ETHNICITY_OPTIONS}
              isActive={(v) => draft.ethnicities.includes(v)}
              onClick={(v) => update("ethnicities", toggle(draft.ethnicities, v))}
            />
          </Field>

          <Field>
            <Label>Plan preferido</Label>
            <ChipsWrap
              options={tierOptionsForPrefs}
              isActive={(v) => draft.preferredTiers.includes(v)}
              onClick={(v) =>
                update("preferredTiers", toggle(draft.preferredTiers, v))
              }
            />
          </Field>

          <Field>
            <Label>Idiomas que necesitas</Label>
            <ChipsWrap
              options={LANGUAGE_OPTIONS}
              isActive={(v) => draft.languages.includes(v)}
              onClick={(v) => update("languages", toggle(draft.languages, v))}
            />
          </Field>

          <Field>
            <Label>Tipo de encuentro</Label>
            <ChipsWrap
              options={SERVICE_LOCATION_OPTIONS}
              isActive={(v) => draft.serviceLocations.includes(v)}
              onClick={(v) =>
                update("serviceLocations", toggle(draft.serviceLocations, v))
              }
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <Label>Presupuesto máximo</Label>
              <Select
                value={String(draft.maxPrice ?? "all")}
                onChange={(e) =>
                  update(
                    "maxPrice",
                    e.target.value === "all" ? null : Number(e.target.value)
                  )
                }
              >
                {PRICE_PRESETS.map((p) => (
                  <option
                    key={String(p.value)}
                    value={p.value === null ? "all" : p.value}
                  >
                    {p.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field>
              <Label>Distancia máxima</Label>
              <Select
                value={String(draft.maxDistanceKm ?? "all")}
                onChange={(e) =>
                  update(
                    "maxDistanceKm",
                    e.target.value === "all" ? null : Number(e.target.value)
                  )
                }
              >
                {DISTANCE_OPTIONS.map((d) => (
                  <option
                    key={String(d.value)}
                    value={d.value === null ? "all" : d.value}
                  >
                    {d.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-accent">
            <div className="min-w-0">
              <p className="text-sm font-medium">Solo perfiles verificados</p>
              <p className="text-xs text-muted-foreground">
                Identidad confirmada por la plataforma
              </p>
            </div>
            <Switch
              checked={draft.verifiedOnly}
              onCheckedChange={(v) => update("verifiedOnly", v)}
            />
          </label>
        </div>

        <DialogFooter className="flex-row gap-2 sm:justify-between">
          <Button
            variant="ghost"
            onClick={() => {
              onClear();
              setDraft(DEFAULT_PREFERENCES);
              onOpenChange(false);
            }}
            className="text-muted-foreground"
          >
            <Trash2 className="h-4 w-4" />
            Borrar
          </Button>
          <Button
            variant="brand"
            onClick={() => {
              onSave(draft);
              onOpenChange(false);
            }}
          >
            <Sparkles className="h-4 w-4" />
            Guardar y ver coincidencias
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
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
        <button
          key={opt.value}
          type="button"
          onClick={() => onClick(opt.value)}
          className={cn(
            "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
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
