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
import { MultiSelect } from "@/components/ui/multi-select";
import { SimpleSelect } from "@/components/ui/simple-select";
import { Switch } from "@/components/ui/switch";
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

  const tierOptions = TIER_OPTIONS.filter((t) => t.value !== "all").map((t) => ({
    value: t.value as Tier,
    label: t.label,
  }));

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
            <SimpleSelect
              options={AGE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              value={draft.ageRange}
              onChange={(v) =>
                update("ageRange", v as UserPreferences["ageRange"])
              }
            />
          </Field>

          <Field>
            <Label>Tipo de cuerpo</Label>
            <MultiSelect
              options={BODY_TYPE_OPTIONS}
              values={draft.bodyTypes}
              onChange={(v) => update("bodyTypes", v)}
              placeholder="Cualquier cuerpo"
            />
          </Field>

          <Field>
            <Label>Cabello</Label>
            <MultiSelect
              options={HAIR_COLOR_OPTIONS}
              values={draft.hairColors}
              onChange={(v) => update("hairColors", v)}
              placeholder="Cualquier cabello"
            />
          </Field>

          <Field>
            <Label>Etnia</Label>
            <MultiSelect
              options={ETHNICITY_OPTIONS}
              values={draft.ethnicities}
              onChange={(v) => update("ethnicities", v)}
              placeholder="Cualquier etnia"
            />
          </Field>

          <Field>
            <Label>Plan preferido</Label>
            <MultiSelect
              options={tierOptions}
              values={draft.preferredTiers as Tier[]}
              onChange={(v) => update("preferredTiers", v)}
              placeholder="Cualquier plan"
            />
          </Field>

          <Field>
            <Label>Idiomas que necesitas</Label>
            <MultiSelect
              options={LANGUAGE_OPTIONS}
              values={draft.languages}
              onChange={(v) => update("languages", v)}
              placeholder="Cualquier idioma"
            />
          </Field>

          <Field>
            <Label>Tipo de encuentro</Label>
            <MultiSelect
              options={SERVICE_LOCATION_OPTIONS}
              values={draft.serviceLocations}
              onChange={(v) => update("serviceLocations", v)}
              placeholder="Cualquier tipo"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <Label>Presupuesto máximo</Label>
              <SimpleSelect
                options={PRICE_PRESETS.map((p) => ({
                  value: p.value === null ? "all" : String(p.value),
                  label: p.label,
                }))}
                value={draft.maxPrice === null ? "all" : String(draft.maxPrice)}
                onChange={(v) =>
                  update("maxPrice", v === "all" ? null : Number(v))
                }
              />
            </Field>
            <Field>
              <Label>Distancia máxima</Label>
              <SimpleSelect
                options={DISTANCE_OPTIONS.map((d) => ({
                  value: d.value === null ? "all" : String(d.value),
                  label: d.label,
                }))}
                value={
                  draft.maxDistanceKm === null
                    ? "all"
                    : String(draft.maxDistanceKm)
                }
                onChange={(v) =>
                  update("maxDistanceKm", v === "all" ? null : Number(v))
                }
              />
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
