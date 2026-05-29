"use client";

import {
  ArrowUpRight,
  Check,
  Crown,
  Gift,
  Sparkles,
  Unlock,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { formatCOP } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";

interface Activity {
  id: string;
  kind: "subscribe" | "ppv" | "tip" | "renew";
  user: string;
  amount: number;
  detail?: string;
  ago: string;
}

const ACTIVITY: Activity[] = [
  { id: "a1", kind: "subscribe", user: "Carlos M.", amount: 75_000, detail: "Plus · 3 meses", ago: "Hace 12 min" },
  { id: "a2", kind: "ppv", user: "Andrés P.", amount: 25_000, detail: "Video · 2:34", ago: "Hace 32 min" },
  { id: "a3", kind: "tip", user: "Anónimo", amount: 50_000, ago: "Hace 1 h" },
  { id: "a4", kind: "subscribe", user: "Felipe R.", amount: 150_000, detail: "VIP · 1 mes", ago: "Hace 2 h" },
  { id: "a5", kind: "renew", user: "Juan David L.", amount: 30_000, detail: "Básica · renovación", ago: "Hace 4 h" },
  { id: "a6", kind: "ppv", user: "Mateo G.", amount: 45_000, detail: "Video · 5:12", ago: "Hace 6 h" },
  { id: "a7", kind: "tip", user: "Anónimo", amount: 100_000, ago: "Hace 8 h" },
];

const ACTIVITY_LABEL: Record<
  Activity["kind"],
  { label: string; icon: typeof Crown; tone: string }
> = {
  subscribe: {
    label: "Nueva suscripción",
    icon: Crown,
    tone: "text-primary bg-primary/15",
  },
  renew: {
    label: "Renovación",
    icon: Check,
    tone: "text-emerald-400 bg-emerald-500/15",
  },
  ppv: {
    label: "Compra PPV",
    icon: Unlock,
    tone: "text-gold bg-amber-500/15",
  },
  tip: {
    label: "Propina",
    icon: Gift,
    tone: "text-rose-400 bg-rose-500/15",
  },
};

export function ProviderActivityFeed() {
  return (
    <section>
      <div className="mb-3">
        <h3 className="flex items-center gap-2 text-base font-bold tracking-tight">
          <Sparkles className="h-4 w-4 text-primary" />
          Actividad reciente
        </h3>
        <p className="text-xs text-muted-foreground">
          Suscripciones, compras y propinas
        </p>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="divide-y">
          {ACTIVITY.map((a) => (
            <ActivityRow key={a.id} activity={a} />
          ))}
        </div>
        <div className="border-t bg-muted/30 px-4 py-2 text-center">
          <Button variant="ghost" size="sm" className="text-xs">
            Ver toda la actividad
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </Card>
    </section>
  );
}

function ActivityRow({ activity }: { activity: Activity }) {
  const meta = ACTIVITY_LABEL[activity.kind];
  const Icon = meta.icon;
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          meta.tone
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm">
          <span className="font-semibold">{activity.user}</span>{" "}
          <span className="text-muted-foreground">— {meta.label}</span>
        </p>
        {activity.detail && (
          <p className="text-[11px] text-muted-foreground">{activity.detail}</p>
        )}
      </div>
      <div className="text-right">
        <p className="text-sm font-bold tabular-nums text-emerald-400">
          +{formatCOP(activity.amount)}
        </p>
        <p className="text-[10px] text-muted-foreground">{activity.ago}</p>
      </div>
    </div>
  );
}
