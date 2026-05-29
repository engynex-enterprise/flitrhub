"use client";

import { Check, Crown, Edit3, Pause, Pencil, Plus } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { formatCOP } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";

interface SubTier {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  subs: number;
  benefits: string[];
  badge?: string;
  highlight?: boolean;
}

const TIERS: SubTier[] = [
  {
    id: "t1",
    name: "Básica",
    price: 30_000,
    durationMonths: 1,
    subs: 142,
    benefits: ["Fotos exclusivas", "Mensajes privados", "1 video al mes"],
  },
  {
    id: "t2",
    name: "Plus",
    price: 75_000,
    durationMonths: 3,
    subs: 58,
    benefits: [
      "Todo lo de Básica",
      "Videos ilimitados",
      "10% off PPV",
      "BTS",
    ],
    highlight: true,
    badge: "Recomendado",
  },
  {
    id: "t3",
    name: "VIP",
    price: 150_000,
    durationMonths: 1,
    subs: 23,
    benefits: [
      "Todo lo de Plus",
      "Videollamada mensual",
      "Contenido a pedido",
      "PPV gratis",
    ],
    badge: "Premium",
  },
];

export function ProviderTiersManager() {
  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold tracking-tight">
            <Crown className="h-4 w-4 text-primary" />
            Tiers de suscripción
          </h3>
          <p className="text-xs text-muted-foreground">
            Configura los planes que ofreces a tus fans
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Nuevo tier
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {TIERS.map((t) => (
          <ManagerTierCard key={t.id} tier={t} />
        ))}
      </div>
    </section>
  );
}

function ManagerTierCard({ tier }: { tier: SubTier }) {
  const monthlyRevenue = (tier.price / tier.durationMonths) * tier.subs;
  return (
    <Card
      className={cn(
        "relative flex flex-col gap-3 p-4",
        tier.highlight && "border-primary/40 bg-primary/5"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold">{tier.name}</p>
            {tier.badge && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                  tier.highlight
                    ? "bg-gradient-gold text-amber-950"
                    : "bg-primary/15 text-primary"
                )}
              >
                {tier.badge}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-bold leading-none">
              {formatCOP(tier.price)}
            </span>
            <span className="text-[10px] text-muted-foreground">
              / {tier.durationMonths === 1 ? "mes" : `${tier.durationMonths}m`}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          aria-label="Editar tier"
        >
          <Edit3 className="h-3 w-3" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-md bg-muted/40 p-2 text-[11px]">
        <div>
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
            Suscriptores
          </p>
          <p className="font-bold tabular-nums">{tier.subs}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
            Mensual
          </p>
          <p className="font-bold tabular-nums text-emerald-400">
            {formatCOP(Math.round(monthlyRevenue))}
          </p>
        </div>
      </div>

      <ul className="space-y-1">
        {tier.benefits.map((b) => (
          <li
            key={b}
            className="flex items-start gap-1.5 text-[11px] text-foreground/80"
          >
            <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex gap-1.5">
        <Button variant="outline" size="sm" className="flex-1 gap-1">
          <Pencil className="h-3 w-3" />
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          aria-label="Pausar"
        >
          <Pause className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
}
