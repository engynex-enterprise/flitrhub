"use client";

import { Crown, Megaphone, Sparkles, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function AdLabel({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "rounded-full border border-white/15 bg-black/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur",
        className
      )}
    >
      Publicidad
    </span>
  );
}

export function AdBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-gradient-sensual relative overflow-hidden rounded-2xl border border-primary/20 p-6 shadow-lg",
        className
      )}
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-10 left-1/3 h-32 w-32 rounded-full bg-gold/20 blur-3xl" />
      <AdLabel className="absolute right-3 top-3" />

      <div className="relative flex flex-wrap items-center gap-4">
        <div className="bg-gradient-gold flex h-12 w-12 items-center justify-center rounded-xl text-amber-950 shadow-lg">
          <Megaphone className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold tracking-tight text-white md:text-xl">
            ¿Eres independiente? Publica tu perfil hoy
          </p>
          <p className="text-xs text-white/70 md:text-sm">
            Promociona tus servicios, recibe contactos directos y aumenta tu
            visibilidad con un plan Platino.
          </p>
        </div>
        <Button
          className="bg-gradient-gold shrink-0 border-0 font-semibold text-amber-950 shadow-md hover:opacity-90"
        >
          Conocer planes
        </Button>
      </div>
    </div>
  );
}

export function AdInlineCard() {
  return (
    <Card className="bg-gradient-sensual group relative flex flex-col justify-between overflow-hidden border-primary/20 p-5 shadow-md">
      <div className="absolute -top-10 right-0 h-32 w-32 rounded-full bg-primary/25 blur-3xl" />
      <AdLabel className="absolute right-3 top-3" />
      <div className="relative">
        <div className="bg-gradient-gold inline-flex h-9 w-9 items-center justify-center rounded-lg text-amber-950 shadow">
          <Crown className="h-5 w-5" />
        </div>
        <p className="mt-3 text-base font-bold leading-tight text-white">
          Sube de nivel a Platino
        </p>
        <p className="mt-1 text-xs text-white/70">
          Tu perfil aparecerá entre los primeros resultados y en la sección
          Destacados.
        </p>
      </div>
      <Button
        size="sm"
        className="bg-gradient-gold relative mt-4 w-full border-0 font-semibold text-amber-950 hover:opacity-90"
      >
        Activar Platino
      </Button>
    </Card>
  );
}

export function AdRowBanner() {
  return (
    <div className="bg-gradient-sensual relative overflow-hidden rounded-2xl border border-primary/20 p-5 shadow-md">
      <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
      <AdLabel className="absolute right-3 top-3" />
      <div className="relative flex flex-wrap items-center gap-4">
        <Sparkles className="h-7 w-7 text-gold" />
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-white md:text-lg">
            Hazte ver. Promociona tu perfil en minutos
          </p>
          <p className="text-xs text-white/70">
            Anúnciate y consigue más visitas semana a semana.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="border-white/20 bg-white/10 text-white hover:bg-white/20"
        >
          Comenzar
        </Button>
      </div>
    </div>
  );
}

export function AdSidebarBlock() {
  return (
    <div className="bg-gradient-sensual relative overflow-hidden rounded-xl border border-primary/20 p-4 shadow-md">
      <div className="absolute -top-6 right-0 h-20 w-20 rounded-full bg-primary/25 blur-2xl" />
      <AdLabel />
      <div className="relative mt-2 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-gold" />
        <p className="text-sm font-semibold text-white">Aumenta tus visitas</p>
      </div>
      <p className="relative mt-1 text-xs text-white/70">
        Anúnciate en flitrhub y llega a miles de usuarios diarios.
      </p>
      <Button
        size="sm"
        variant="outline"
        className="relative mt-3 w-full border-white/20 bg-white/10 text-white hover:bg-white/20"
      >
        Saber más
      </Button>
    </div>
  );
}
