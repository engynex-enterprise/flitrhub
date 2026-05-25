"use client";

import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface MultiSelectOption<T extends string> {
  value: T;
  label: string;
}

export interface MultiSelectProps<T extends string> {
  options: MultiSelectOption<T>[];
  values: T[];
  onChange: (values: T[]) => void;
  placeholder?: string;
  className?: string;
  /** Max items to render as chips in the trigger before collapsing to "+N" */
  maxChipsInTrigger?: number;
}

export function MultiSelect<T extends string>({
  options,
  values,
  onChange,
  placeholder = "Selecciona...",
  className,
  maxChipsInTrigger = 2,
}: MultiSelectProps<T>) {
  const [open, setOpen] = React.useState(false);

  const toggle = (v: T) => {
    if (values.includes(v)) onChange(values.filter((x) => x !== v));
    else onChange([...values, v]);
  };

  const clear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange([]);
  };

  const selectedOptions = options.filter((o) => values.includes(o.value));
  const hidden = Math.max(0, selectedOptions.length - maxChipsInTrigger);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent/40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            className
          )}
        >
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1 overflow-hidden text-left">
            {selectedOptions.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                {selectedOptions.slice(0, maxChipsInTrigger).map((opt) => (
                  <span
                    key={opt.value}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary"
                  >
                    {opt.label}
                  </span>
                ))}
                {hidden > 0 && (
                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    +{hidden}
                  </span>
                )}
              </>
            )}
          </div>
          <div className="ml-2 flex shrink-0 items-center gap-1">
            {selectedOptions.length > 0 && (
              <span
                role="button"
                tabIndex={-1}
                onClick={clear}
                className="rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label="Limpiar selección"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-1"
      >
        <div className="max-h-64 overflow-y-auto">
          {options.map((opt) => {
            const checked = values.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggle(opt.value)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm transition-colors",
                  "hover:bg-accent",
                  checked && "text-foreground"
                )}
              >
                <Checkbox checked={checked} onCheckedChange={() => toggle(opt.value)} />
                <span className="flex-1">{opt.label}</span>
                {checked && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
            );
          })}
        </div>
        {values.length > 0 && (
          <div className="mt-1 flex items-center justify-between border-t pt-2">
            <span className="px-2 text-xs text-muted-foreground">
              {values.length} seleccionado{values.length === 1 ? "" : "s"}
            </span>
            <button
              type="button"
              onClick={() => onChange([])}
              className="rounded px-2 py-1 text-xs font-medium text-primary hover:bg-accent"
            >
              Limpiar
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
