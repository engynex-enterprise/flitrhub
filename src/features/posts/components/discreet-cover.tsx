"use client";

import { ImageIcon, Lock, Sparkles } from "lucide-react";

import { useDiscreet } from "@/features/discreet/use-discreet";
import { cn } from "@/shared/lib/utils";

type Size = "xs" | "sm" | "md" | "lg";

interface DiscreetCoverProps {
  /** Visual scale of the inner icon. */
  size?: Size;
  /** Whether to show the "Privado" / "Catálogo" label below the icon. */
  showLabel?: boolean;
  /** Round shape — useful for avatar overlays. */
  rounded?: boolean;
  /** Override the displayed label. */
  label?: string;
  className?: string;
}

const ICON_SIZE: Record<Size, string> = {
  xs: "h-3 w-3",
  sm: "h-5 w-5",
  md: "h-7 w-7",
  lg: "h-10 w-10",
};

const LABEL_SIZE: Record<Size, string> = {
  xs: "text-[8px]",
  sm: "text-[9px]",
  md: "text-[10px]",
  lg: "text-xs",
};

/**
 * Replaces explicit media with an opaque placeholder when discreet mode
 * is on. Sits as an absolute overlay inside its parent (`position: relative`).
 * Designed to look like a generic catalog placeholder — no skin tones,
 * no silhouettes, no peek-on-hover.
 */
export function DiscreetCover({
  size = "md",
  showLabel = true,
  rounded = false,
  label = "Vista privada",
  className,
}: DiscreetCoverProps) {
  const { enabled } = useDiscreet();
  if (!enabled) return null;

  return (
    <div
      className={cn(
        "discreet-cover absolute inset-0 z-[1] flex flex-col items-center justify-center gap-1 overflow-hidden bg-card text-muted-foreground",
        rounded && "rounded-full",
        className
      )}
      aria-hidden
    >
      {/* Base soft gradient so it doesn't look like an error state */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-card via-muted to-card opacity-95"
      />
      {/* Diagonal stripes texture so the placeholder reads as intentional */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, currentColor 0 6px, transparent 6px 18px)",
        }}
      />
      {/* Subtle radial primary glow */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(var(--primary) / 0.18), transparent 70%)",
        }}
      />

      {size === "xs" ? (
        <ImageIcon className={cn("relative opacity-60", ICON_SIZE[size])} />
      ) : (
        <>
          <div className="relative flex items-center gap-1">
            <Lock className={cn("opacity-70", ICON_SIZE[size])} />
            {size === "lg" && (
              <Sparkles className="h-5 w-5 text-primary opacity-70" />
            )}
          </div>
          {showLabel && (
            <span
              className={cn(
                "relative font-bold uppercase tracking-wider opacity-80",
                LABEL_SIZE[size]
              )}
            >
              {label}
            </span>
          )}
        </>
      )}
    </div>
  );
}
