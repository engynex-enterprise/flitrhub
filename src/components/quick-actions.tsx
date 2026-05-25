"use client";

import { Heart, MapPin, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  nearbyActive: boolean;
  nearbyRadius: number; // km
  onToggleNearby: () => void;
  hasPreferences: boolean;
  onOpenPreferences: () => void;
}

export function QuickActions({
  nearbyActive,
  nearbyRadius,
  onToggleNearby,
  hasPreferences,
  onOpenPreferences,
}: QuickActionsProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Button
        type="button"
        variant={nearbyActive ? "default" : "outline"}
        size="sm"
        onClick={onToggleNearby}
        className={cn(
          "gap-1.5 transition-colors",
          nearbyActive && "ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
        )}
      >
        <MapPin className="h-4 w-4" />
        {nearbyActive ? `Cerca de mí · ${nearbyRadius}km` : "Cerca de mí"}
        {nearbyActive && <X className="h-3 w-3" />}
      </Button>

      <Button
        type="button"
        variant={hasPreferences ? "default" : "outline"}
        size="sm"
        onClick={onOpenPreferences}
        className="gap-1.5"
      >
        <Heart className={cn("h-4 w-4", hasPreferences && "fill-current")} />
        {hasPreferences ? "Mis preferencias" : "Configurar preferencias"}
      </Button>
    </div>
  );
}
