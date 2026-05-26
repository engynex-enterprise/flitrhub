"use client";

import { Check, MapPin } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { CITIES } from "@/shared/lib/cities";

interface CitySelectorProps {
  city: string;
  onChange: (city: string) => void;
}

export function CitySelector({ city, onChange }: CitySelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <MapPin className="h-4 w-4 text-primary" />
          {city}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>Selecciona tu ciudad</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {CITIES.map((c) => (
          <DropdownMenuItem key={c} onClick={() => onChange(c)}>
            <span className="flex-1">{c}</span>
            {c === city && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
