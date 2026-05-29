"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  BarChart3,
  Clock,
  Compass,
  Crown,
  DollarSign,
  Eye,
  Gift,
  Heart,
  MessageCircle,
  MousePointerClick,
  Phone,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

import { ProviderActivityFeed } from "./provider-activity-feed";

/* -------------------- Mock data -------------------- */

const VISITS_BY_DAY = [
  { day: "Lun", value: 320 },
  { day: "Mar", value: 410 },
  { day: "Mié", value: 385 },
  { day: "Jue", value: 520 },
  { day: "Vie", value: 690 },
  { day: "Sáb", value: 880 },
  { day: "Dom", value: 770 },
];

const CONTACTS_BY_DAY = [
  { day: "Lun", value: 12 },
  { day: "Mar", value: 18 },
  { day: "Mié", value: 14 },
  { day: "Jue", value: 22 },
  { day: "Vie", value: 31 },
  { day: "Sáb", value: 38 },
  { day: "Dom", value: 27 },
];

const TIER_BREAKDOWN = [
  { label: "Platino", value: 62, color: "hsl(285, 70%, 65%)" },
  { label: "Plus", value: 28, color: "hsl(340, 80%, 58%)" },
  { label: "Básico", value: 10, color: "hsl(340, 12%, 45%)" },
];

const TOP_POSTS = [
  { name: "Sofía", views: 4250, favs: 312, tier: "Platino" },
  { name: "Valentina", views: 3120, favs: 248, tier: "Plus" },
  { name: "Camila", views: 2410, favs: 187, tier: "Plus" },
  { name: "Daniela", views: 1980, favs: 142, tier: "Básico" },
  { name: "Manuela", views: 1540, favs: 98, tier: "Básico" },
];

// 24 hours, normalized 0–100 intensity.
const HOURLY_ACTIVITY = [
  4, 2, 1, 1, 1, 2, 6, 12, 18, 22, 28, 35, 42, 48, 52, 58, 66, 74, 86, 92, 88,
  72, 50, 22,
];

const RATINGS_DIST = [
  { stars: 5, count: 84 },
  { stars: 4, count: 32 },
  { stars: 3, count: 9 },
  { stars: 2, count: 2 },
  { stars: 1, count: 1 },
];

const TRAFFIC_SOURCES = [
  { label: "Búsqueda", value: 48, color: "hsl(340, 80%, 58%)" },
  { label: "Recomendaciones", value: 27, color: "hsl(285, 70%, 65%)" },
  { label: "Directo", value: 15, color: "hsl(40, 90%, 60%)" },
  { label: "Stories", value: 10, color: "hsl(200, 70%, 60%)" },
];

const CITY_BREAKDOWN = [
  { label: "Bogotá", value: 54 },
  { label: "Medellín", value: 22 },
  { label: "Cali", value: 12 },
  { label: "Cartagena", value: 7 },
  { label: "Barranquilla", value: 5 },
];

const FUNNEL = [
  { label: "Visitas", value: 12400, icon: Eye },
  { label: "Favoritos", value: 843, icon: Heart },
  { label: "Chats", value: 312, icon: MessageCircle },
  { label: "Contactos", value: 127, icon: Phone },
];

// Vault income — moved here from provider-content.tsx
const VAULT_REVENUE_14D = [
  120_000, 145_000, 180_000, 95_000, 215_000, 268_000, 320_000, 280_000,
  340_000, 410_000, 380_000, 450_000, 520_000, 480_000,
];

const VAULT_TOP_EARNERS = [
  { label: "Video · 5:12", meta: "78 desbloqueos · PPV", value: 3510 },
  { label: "Foto exclusiva", meta: "142 desbloqueos · Sub", value: 4260 },
  { label: "Foto serie", meta: "98 desbloqueos · Sub", value: 2940 },
  { label: "Video · 2:34", meta: "86 desbloqueos · PPV", value: 2150 },
  { label: "Foto premium", meta: "32 desbloqueos · Sub", value: 960 },
];

// Ads performance — moved here from provider-ads.tsx
const ADS_IMPRESSIONS_14D = [
  1200, 1340, 980, 1620, 2100, 2480, 2210, 1860, 2030, 2540, 2820, 3120, 2960,
  3340,
];

const ADS_BEST_CAMPAIGNS = [
  { label: "Top búsqueda · abr", meta: "14d · $168k gastados", value: 320 },
  { label: "Destacado home · abr", meta: "7d · $70k gastados", value: 240 },
  { label: "Story sponsor · mar", meta: "3d · $45k gastados", value: 210 },
  { label: "Boost Bogotá · mar", meta: "21d · $168k gastados", value: 180 },
];

/* -------------------- Public component -------------------- */

export function ProviderStats() {
  return (
    <div className="space-y-4">
      {/* Headline KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi
          label="Visitas (7d)"
          value="3,975"
          delta="+18%"
          deltaTone="up"
          icon={Eye}
          tone="text-sky-400 bg-sky-500/10"
        />
        <Kpi
          label="Contactos (7d)"
          value="162"
          delta="+23%"
          deltaTone="up"
          icon={Phone}
          tone="text-primary bg-primary/10"
        />
        <Kpi
          label="Rating promedio"
          value="4.8"
          delta="+0.2"
          deltaTone="up"
          icon={Star}
          tone="text-gold bg-amber-500/10"
        />
        <Kpi
          label="Tiempo respuesta"
          value="8 min"
          delta="-2 min"
          deltaTone="up"
          icon={Clock}
          tone="text-emerald-400 bg-emerald-500/10"
        />
      </div>

      {/* Row 1 — Visits area + Contacts bars */}
      <div className="grid gap-3 lg:grid-cols-2">
        <ChartCard
          title="Visitas en los últimos 7 días"
          subtitle="Total: 3,975"
          icon={TrendingUp}
          delta="+18% vs semana anterior"
          deltaTone="up"
        >
          <AreaChart data={VISITS_BY_DAY} />
        </ChartCard>

        <ChartCard
          title="Contactos por día"
          subtitle="Total: 162"
          icon={MessageCircle}
          delta="+23% vs semana anterior"
          deltaTone="up"
        >
          <BarChartCmp data={CONTACTS_BY_DAY} />
        </ChartCard>
      </div>

      {/* Row 2 — Top posts + Tier breakdown */}
      <div className="grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <ChartCard
          title="Publicaciones más vistas"
          subtitle="Tus perfiles con mejor desempeño"
          icon={Sparkles}
        >
          <RankedBars
            items={TOP_POSTS.map((p) => ({
              label: p.name,
              meta: `${p.tier} · ${p.favs.toLocaleString("es-CO")} ♥`,
              value: p.views,
            }))}
          />
        </ChartCard>

        <ChartCard
          title="Visitas por tier"
          subtitle="Distribución de tu audiencia"
          icon={Crown}
        >
          <DonutWithLegend data={TIER_BREAKDOWN} />
        </ChartCard>
      </div>

      {/* Row 3 — Hourly heatmap (full width) */}
      <ChartCard
        title="Actividad por hora"
        subtitle="Cuándo llegan más visitas (hora local)"
        icon={Clock}
      >
        <HourlyHeatmap data={HOURLY_ACTIVITY} />
      </ChartCard>

      {/* Row 4 — Sources + Cities */}
      <div className="grid gap-3 lg:grid-cols-2">
        <ChartCard
          title="Origen de visitas"
          subtitle="Cómo llegan a tus perfiles"
          icon={Compass}
        >
          <DonutWithLegend data={TRAFFIC_SOURCES} />
        </ChartCard>

        <ChartCard
          title="Audiencia por ciudad"
          subtitle="De dónde son tus visitantes"
          icon={BarChart3}
        >
          <PercentBars data={CITY_BREAKDOWN} />
        </ChartCard>
      </div>

      {/* Row 5 — Funnel (full width; ratings moved to Reseñas sub-tab) */}
      <ChartCard
        title="Embudo de conversión"
        subtitle="De visita a contacto"
        icon={TrendingUp}
      >
        <Funnel steps={FUNNEL} />
      </ChartCard>
    </div>
  );
}

/* -------------------- Content (vault income) sub-tab -------------------- */

export function ProviderStatsContent() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi
          label="Ingresos (30d)"
          value="$13.8M"
          delta="+38%"
          deltaTone="up"
          icon={Banknote}
          tone="text-emerald-400 bg-emerald-500/10"
        />
        <Kpi
          label="MRR estimado"
          value="$5.6M"
          delta="+12%"
          deltaTone="up"
          icon={TrendingUp}
          tone="text-primary bg-primary/10"
        />
        <Kpi
          label="Suscriptores"
          value="223"
          delta="+24"
          deltaTone="up"
          icon={Users}
          tone="text-sky-400 bg-sky-500/10"
        />
        <Kpi
          label="Propinas (30d)"
          value="$150k"
          icon={Gift}
          tone="text-rose-400 bg-rose-500/10"
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ChartCard
          title="Ingresos diarios del vault"
          subtitle="Últimos 14 días"
          icon={DollarSign}
          delta="+38%"
          deltaTone="up"
        >
          <BarChartCmp
            data={VAULT_REVENUE_14D.map((v, i) => ({
              day: String(i + 1),
              value: v,
            }))}
          />
        </ChartCard>

        <ChartCard
          title="Top de ingresos por contenido"
          subtitle="Las publicaciones que mejor rinden"
          icon={Star}
        >
          <RankedBars items={VAULT_TOP_EARNERS} />
        </ChartCard>
      </div>

      <ProviderActivityFeed />
    </div>
  );
}

/* -------------------- Ads performance sub-tab -------------------- */

export function ProviderStatsAds() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi
          label="Impresiones (30d)"
          value="312k"
          delta="+22%"
          deltaTone="up"
          icon={Eye}
          tone="text-sky-400 bg-sky-500/10"
        />
        <Kpi
          label="Clics"
          value="18.4k"
          delta="+15%"
          deltaTone="up"
          icon={MousePointerClick}
          tone="text-primary bg-primary/10"
        />
        <Kpi
          label="Contactos pagos"
          value="412"
          delta="+31%"
          deltaTone="up"
          icon={Phone}
          tone="text-emerald-400 bg-emerald-500/10"
        />
        <Kpi
          label="CPC promedio"
          value="$28"
          delta="-12%"
          deltaTone="up"
          icon={Target}
          tone="text-gold bg-amber-500/10"
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ChartCard
          title="Impresiones entregadas"
          subtitle="Últimos 14 días"
          icon={Eye}
          delta="+22%"
          deltaTone="up"
        >
          <BarChartCmp
            data={ADS_IMPRESSIONS_14D.map((v, i) => ({
              day: String(i + 1),
              value: v,
            }))}
          />
        </ChartCard>

        <ChartCard
          title="Mejores campañas"
          subtitle="Por ROI (gasto vs contactos)"
          icon={TrendingUp}
        >
          <RankedBars items={ADS_BEST_CAMPAIGNS} />
        </ChartCard>
      </div>
    </div>
  );
}

/* -------------------- Reviews sub-tab -------------------- */

export function ProviderStatsReviews() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi
          label="Total reseñas"
          value="128"
          delta="+8"
          deltaTone="up"
          icon={MessageCircle}
          tone="text-primary bg-primary/10"
        />
        <Kpi
          label="Respondidas"
          value="83%"
          delta="+5%"
          deltaTone="up"
          icon={ArrowUpRight}
          tone="text-emerald-400 bg-emerald-500/10"
        />
        <Kpi
          label="Útiles totales"
          value="402"
          icon={Heart}
          tone="text-rose-400 bg-rose-500/10"
        />
        <Kpi
          label="Rating promedio"
          value="4.8"
          delta="+0.2"
          deltaTone="up"
          icon={Star}
          tone="text-gold bg-amber-500/10"
        />
      </div>

      <ChartCard
        title="Distribución de reseñas"
        subtitle="128 reseñas totales"
        icon={Star}
      >
        <RatingsBars data={RATINGS_DIST} />
      </ChartCard>
    </div>
  );
}

/* -------------------- KPI card -------------------- */

export function Kpi({
  label,
  value,
  delta,
  deltaTone,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "up" | "down";
  icon: typeof Eye;
  tone: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            tone
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-bold leading-tight">{value}</p>
        </div>
      </div>
      {delta && (
        <p
          className={cn(
            "mt-2 inline-flex items-center gap-1 text-[11px] font-semibold",
            deltaTone === "up" ? "text-emerald-400" : "text-rose-400"
          )}
        >
          {deltaTone === "up" ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {delta}
        </p>
      )}
    </Card>
  );
}

/* -------------------- Chart card wrapper -------------------- */

export function ChartCard({
  title,
  subtitle,
  icon: Icon,
  delta,
  deltaTone,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: typeof Eye;
  delta?: string;
  deltaTone?: "up" | "down";
  children: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="flex items-center gap-1.5 text-sm font-bold">
            <Icon className="h-4 w-4 text-primary" />
            {title}
          </h4>
          {subtitle && (
            <p className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {delta && (
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
              deltaTone === "up"
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-rose-500/10 text-rose-400"
            )}
          >
            {deltaTone === "up" ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {delta}
          </span>
        )}
      </div>
      {children}
    </Card>
  );
}

/* -------------------- Area chart -------------------- */

function AreaChart({ data }: { data: { day: string; value: number }[] }) {
  const W = 300;
  const H = 120;
  const PAD = 8;
  const max = Math.max(...data.map((d) => d.value)) * 1.1;
  const stepX = (W - PAD * 2) / (data.length - 1);
  const pts = data.map((d, i) => {
    const x = PAD + i * stepX;
    const y = H - PAD - (d.value / max) * (H - PAD * 2);
    return { x, y, ...d };
  });
  const linePath = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${H - PAD} L ${pts[0].x} ${H - PAD} Z`;

  return (
    <div className="space-y-2">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-32 w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="area-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.45" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={PAD}
            x2={W - PAD}
            y1={PAD + (H - PAD * 2) * t}
            y2={PAD + (H - PAD * 2) * t}
            stroke="hsl(var(--border))"
            strokeDasharray="2 3"
            strokeWidth="0.5"
          />
        ))}
        <path d={areaPath} fill="url(#area-grad)" />
        <path
          d={linePath}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {pts.map((p) => (
          <circle
            key={p.day}
            cx={p.x}
            cy={p.y}
            r="2.5"
            fill="hsl(var(--background))"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
          />
        ))}
      </svg>
      <div className="flex justify-between px-1 text-[10px] text-muted-foreground">
        {data.map((d) => (
          <span key={d.day}>{d.day}</span>
        ))}
      </div>
    </div>
  );
}

/* -------------------- Bar chart -------------------- */

export function BarChartCmp({
  data,
}: {
  data: { day: string; value: number }[];
}) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-2">
      <div className="flex h-32 items-end gap-2">
        {data.map((d) => (
          <div
            key={d.day}
            className="flex flex-1 flex-col items-center justify-end gap-1"
          >
            <span className="text-[10px] font-semibold text-foreground">
              {d.value}
            </span>
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-primary/60 to-primary"
              style={{ height: `${(d.value / max) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {data.map((d) => (
          <span
            key={d.day}
            className="flex-1 text-center text-[10px] text-muted-foreground"
          >
            {d.day}
          </span>
        ))}
      </div>
    </div>
  );
}

/* -------------------- Ranked horizontal bars -------------------- */

export function RankedBars({
  items,
}: {
  items: { label: string; meta?: string; value: number }[];
}) {
  const max = Math.max(...items.map((i) => i.value));
  return (
    <div className="space-y-2.5">
      {items.map((item, idx) => {
        const pct = (item.value / max) * 100;
        return (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex min-w-0 items-center gap-2">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{item.label}</p>
                  {item.meta && (
                    <p className="truncate text-[10px] text-muted-foreground">
                      {item.meta}
                    </p>
                  )}
                </div>
              </div>
              <span className="shrink-0 font-semibold tabular-nums">
                {item.value.toLocaleString("es-CO")}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* -------------------- Donut with legend -------------------- */

function DonutWithLegend({
  data,
}: {
  data: { label: string; value: number; color: string }[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const R = 36;
  const STROKE = 14;
  const C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="h-32 w-32 shrink-0 -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={STROKE}
        />
        {data.map((d) => {
          const dash = (d.value / total) * C;
          const el = (
            <circle
              key={d.label}
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke={d.color}
              strokeWidth={STROKE}
              strokeDasharray={`${dash} ${C - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <ul className="min-w-0 flex-1 space-y-1.5">
        {data.map((d) => (
          <li
            key={d.label}
            className="flex items-center justify-between gap-2 text-xs"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ background: d.color }}
              />
              <span className="truncate">{d.label}</span>
            </span>
            <span className="shrink-0 font-semibold tabular-nums">
              {Math.round((d.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------- Hourly heatmap -------------------- */

function HourlyHeatmap({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <div className="space-y-2">
      <div className="flex gap-[3px]">
        {data.map((v, i) => {
          const intensity = v / max;
          return (
            <div
              key={i}
              title={`${i.toString().padStart(2, "0")}:00 — ${v}%`}
              className="h-9 flex-1 rounded-sm transition-colors"
              style={{
                backgroundColor: `hsl(var(--primary) / ${0.08 + intensity * 0.85})`,
              }}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>00h</span>
        <span>06h</span>
        <span>12h</span>
        <span>18h</span>
        <span>23h</span>
      </div>
    </div>
  );
}

/* -------------------- Percent bars (cities, etc) -------------------- */

function PercentBars({ data }: { data: { label: string; value: number }[] }) {
  return (
    <div className="space-y-2.5">
      {data.map((d) => (
        <div key={d.label} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="truncate">{d.label}</span>
            <span className="font-semibold tabular-nums">{d.value}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-platino"
              style={{ width: `${d.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* -------------------- Funnel -------------------- */

function Funnel({
  steps,
}: {
  steps: { label: string; value: number; icon: typeof Eye }[];
}) {
  const top = steps[0].value;
  return (
    <div className="space-y-2">
      {steps.map((step, i) => {
        const pct = (step.value / top) * 100;
        const conv =
          i === 0 ? null : Math.round((step.value / steps[i - 1].value) * 100);
        return (
          <div key={step.label} className="space-y-1">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="flex items-center gap-2">
                <step.icon className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium">{step.label}</span>
                {conv !== null && (
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    {conv}%
                  </span>
                )}
              </span>
              <span className="font-bold tabular-nums">
                {step.value.toLocaleString("es-CO")}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-primary/80 to-platino"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* -------------------- Sparkline (small inline trend) -------------------- */

export function Sparkline({
  data,
  tone = "primary",
}: {
  data: number[];
  tone?: "primary" | "emerald" | "rose";
}) {
  const W = 100;
  const H = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = data.length > 1 ? W / (data.length - 1) : 0;
  const pts = data.map((v, i) => ({
    x: i * stepX,
    y: H - ((v - min) / range) * (H - 4) - 2,
  }));
  const linePath = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${H} L 0 ${H} Z`;
  const stroke =
    tone === "emerald"
      ? "rgb(52, 211, 153)"
      : tone === "rose"
        ? "rgb(251, 113, 133)"
        : "hsl(var(--primary))";

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="h-7 w-full"
    >
      <path d={areaPath} fill={stroke} fillOpacity="0.12" />
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* -------------------- Ratings distribution -------------------- */

function RatingsBars({
  data,
}: {
  data: { stars: number; count: number }[];
}) {
  const total = data.reduce((s, r) => s + r.count, 0);
  return (
    <div className="space-y-1.5">
      {data.map((r) => {
        const pct = (r.count / total) * 100;
        return (
          <div key={r.stars} className="flex items-center gap-2 text-xs">
            <span className="flex w-10 shrink-0 items-center gap-0.5 font-semibold">
              {r.stars}
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-8 shrink-0 text-right tabular-nums text-muted-foreground">
              {r.count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
