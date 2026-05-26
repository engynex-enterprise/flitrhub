"use client";

import { LayoutGrid, List } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import type { ViewMode } from "@/features/posts/lib/filters";

interface ViewSwitcherProps {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}

const VIEWS: { value: ViewMode; label: string; icon: typeof LayoutGrid }[] = [
  { value: "card", label: "Tarjetas", icon: LayoutGrid },
  { value: "list", label: "Lista", icon: List },
];

export function ViewSwitcher({ value, onChange }: ViewSwitcherProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border bg-card p-1">
      {VIEWS.map((v) => {
        const Icon = v.icon;
        const active = value === v.value;
        return (
          <button
            key={v.value}
            type="button"
            onClick={() => onChange(v.value)}
            aria-label={v.label}
            title={v.label}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
